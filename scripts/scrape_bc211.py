#!/usr/bin/env python3
"""
BC211 resource scraper.

Fetches service listings from bc.211.ca search result pages and outputs
a combined JSON file for the Bloom app.

Usage (from project root):
  .venv/bin/python scripts/scrape_bc211.py
"""

from __future__ import annotations

import json
import re
import time
from pathlib import Path
from typing import Any

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "data" / "raw"
ASSETS_DIR = ROOT / "app" / "src" / "main" / "assets"

CATEGORY_MAP = {
    "501:502:503:504:505:506:507:508:509:510:512:513": "mental_health",
    "419:420:422:423": "counselling",
    "418": "victim_services",
    "357:358:359:360:361:362:363:364:365:366": "legal_aid",
    "keyword=recreation": "recreation",
    "468:469:470:471:472:473:474:475:476:477:479:1300": "food",
    "493:494:496:497:498:499": "housing",
    "368:369:370:371:372:373:374:375:376:378": "employment",
    "459:460:461:462:463:464:465:466": "indigenous",
    "533:534:535:536:537:538:539:540:541:542:543": "immigrant_refugee",
    "390:391:392:393:394:395:396:397:398": "substance_use",
}

URLS = [
    "https://bc.211.ca/result/?topics=501:502:503:504:505:506:507:508:509:510:512:513",
    "https://bc.211.ca/result/?topics=419:420:422:423",
    "https://bc.211.ca/result/?topics=418",
    "https://bc.211.ca/result/?topics=357:358:359:360:361:362:363:364:365:366",
    "https://bc.211.ca/result/?keyword=recreation",
    "https://bc.211.ca/result/?topics=468:469:470:471:472:473:474:475:476:477:479:1300",
    "https://bc.211.ca/result/?topics=493:494:496:497:498:499",
    "https://bc.211.ca/result/?topics=368:369:370:371:372:373:374:375:376:378",
    "https://bc.211.ca/result/?topics=459:460:461:462:463:464:465:466",
    "https://bc.211.ca/result/?topics=533:534:535:536:537:538:539:540:541:542:543",
    "https://bc.211.ca/result/?topics=390:391:392:393:394:395:396:397:398",
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}


def classify_url(url: str) -> str:
    for key, cat in CATEGORY_MAP.items():
        if key in url:
            return cat
    return "general"


def scrape_page(url: str, session: requests.Session) -> list[dict[str, Any]]:
    category = classify_url(url)
    results: list[dict[str, Any]] = []

    try:
        resp = session.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"    ⚠ Failed to fetch {url}: {e}")
        return results

    soup = BeautifulSoup(resp.text, "html.parser")

    selectors = [
        ".result-item",
        ".search-result",
        "[class*='result']",
        ".listing",
        "article",
    ]
    cards = []
    for sel in selectors:
        cards = soup.select(sel)
        if cards:
            break

    if not cards:
        rows = soup.select("tr, li")
        if len(rows) > 2:
            cards = rows

    for card in cards:
        title_el = (
            card.select_one("h2, h3, h4, .title, [class*='title'], [class*='name']")
        )
        desc_el = card.select_one(
            ".description, [class*='desc'], p, [class*='summary']"
        )
        phone_el = card.select_one(
            ".phone, [class*='phone'], [href^='tel:'], [class*='tel']"
        )
        addr_el = card.select_one(
            ".address, [class*='address'], [class*='location']"
        )

        title = title_el.get_text(strip=True) if title_el else ""
        if not title:
            continue

        description = desc_el.get_text(strip=True) if desc_el else ""
        phone = ""
        if phone_el:
            href = phone_el.get("href", "")
            if href.startswith("tel:"):
                phone = href.replace("tel:", "").strip()
            else:
                phone = phone_el.get_text(strip=True)
        address = addr_el.get_text(strip=True) if addr_el else ""

        results.append({
            "category": category,
            "name": title,
            "phone": phone,
            "address": address,
            "city": "Vancouver",
            "hours": "",
            "languages": ["en"],
            "description": description[:500],
            "source": url,
        })

    return results


def deduplicate(resources: list[dict[str, Any]]) -> list[dict[str, Any]]:
    seen: set[str] = set()
    unique: list[dict[str, Any]] = []
    for r in resources:
        key = (r["name"].lower().strip(), r.get("phone", ""))
        if key not in seen:
            seen.add(key)
            unique.append(r)
    return unique


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)

    session = requests.Session()
    all_resources: list[dict[str, Any]] = []

    print("Scraping BC211 resources...\n")
    for i, url in enumerate(URLS, 1):
        cat = classify_url(url)
        print(f"[{i}/{len(URLS)}] {cat}: {url[:60]}...")
        resources = scrape_page(url, session)
        print(f"         Found {len(resources)} entries")
        all_resources.extend(resources)
        time.sleep(1.5)

    all_resources = deduplicate(all_resources)
    print(f"\nTotal unique BC211 resources: {len(all_resources)}")

    raw_out = OUT_DIR / "bc211_scraped.json"
    raw_out.write_text(json.dumps(all_resources, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved raw data → {raw_out.relative_to(ROOT)}")

    existing_path = ASSETS_DIR / "bc211_resources.json"
    existing: list[dict[str, Any]] = []
    if existing_path.exists():
        existing = json.loads(existing_path.read_text("utf-8"))
        print(f"Loaded {len(existing)} existing resources from assets")

    existing_names = {r["name"].lower().strip() for r in existing}
    new_entries = [r for r in all_resources if r["name"].lower().strip() not in existing_names]
    merged = existing + new_entries
    existing_path.write_text(json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Merged total: {len(merged)} resources → {existing_path.relative_to(ROOT)}")
    print(f"  ({len(new_entries)} new from BC211 scrape)")


if __name__ == "__main__":
    main()
