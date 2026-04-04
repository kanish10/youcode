#!/usr/bin/env python3
"""
Parse all hackathon raw datasets into app-ready JSON assets.

Handles:
  - data/raw/*.json (community centres, food programs, libraries, parks)
  - data/raw/*.xlsx  (Merged Shelter List)
  - BC211 web scraping from known URLs

Usage (from project root):
  .venv/bin/python scripts/parse_data.py
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "data" / "raw"
ASSETS_DIR = ROOT / "app" / "src" / "main" / "assets"


def ensure_dirs() -> None:
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# 1. Community centres  →  category "recreation"
# ---------------------------------------------------------------------------
def parse_community_centres() -> list[dict[str, Any]]:
    path = RAW_DIR / "community-centres.json"
    if not path.exists():
        return []
    raw = json.loads(path.read_text("utf-8"))
    resources: list[dict[str, Any]] = []
    for item in raw:
        coords = item.get("geo_point_2d") or {}
        resources.append({
            "category": "recreation",
            "name": item.get("name", ""),
            "phone": "",
            "address": item.get("address", ""),
            "city": "Vancouver",
            "hours": "",
            "languages": ["en"],
            "description": f"Community centre in {item.get('geo_local_area', 'Vancouver')}",
            "latitude": coords.get("lat"),
            "longitude": coords.get("lon"),
        })
    return resources


# ---------------------------------------------------------------------------
# 2. Free & low-cost food programs  →  category "food"
# ---------------------------------------------------------------------------
def parse_food_programs() -> list[dict[str, Any]]:
    path = RAW_DIR / "free-and-low-cost-food-programs.json"
    if not path.exists():
        return []
    raw = json.loads(path.read_text("utf-8"))
    resources: list[dict[str, Any]] = []
    for item in raw:
        if item.get("program_status", "").lower() != "open":
            continue
        phone = item.get("signup_phone_number") or ""
        addr = item.get("location_address") or ""
        resources.append({
            "category": "food",
            "name": item.get("program_name", ""),
            "phone": phone,
            "address": addr,
            "city": "Vancouver",
            "hours": item.get("description") or "",
            "languages": ["en"],
            "description": _food_description(item),
            "latitude": item.get("latitude"),
            "longitude": item.get("longitude"),
        })
    return resources


def _food_description(item: dict) -> str:
    parts: list[str] = []
    if item.get("provides_meals") == "True":
        cost = item.get("meal_cost") or "Free"
        parts.append(f"Meals ({cost})")
    if item.get("provides_hampers") == "True":
        cost = item.get("hamper_cost") or "Free"
        parts.append(f"Hampers ({cost})")
    if item.get("wheelchair_accessible") == "Yes":
        parts.append("Wheelchair accessible")
    pop = item.get("program_population_served")
    if pop:
        parts.append(f"Serves: {pop}")
    return ". ".join(parts) if parts else "Community food resource"


# ---------------------------------------------------------------------------
# 3. Libraries  →  category "recreation"
# ---------------------------------------------------------------------------
def parse_libraries() -> list[dict[str, Any]]:
    path = RAW_DIR / "libraries.json"
    if not path.exists():
        return []
    raw = json.loads(path.read_text("utf-8"))
    resources: list[dict[str, Any]] = []
    for item in raw:
        coords = item.get("geo_point_2d") or {}
        resources.append({
            "category": "recreation",
            "name": f"Vancouver Public Library – {item.get('name', '')}",
            "phone": "",
            "address": item.get("address", ""),
            "city": "Vancouver",
            "hours": "",
            "languages": ["en", "zh", "fr"],
            "description": "Free library access, internet, programs, quiet space.",
            "latitude": coords.get("lat"),
            "longitude": coords.get("lon"),
        })
    return resources


# ---------------------------------------------------------------------------
# 4. Parks  →  category "recreation"
# ---------------------------------------------------------------------------
def parse_parks() -> list[dict[str, Any]]:
    path = RAW_DIR / "parks.json"
    if not path.exists():
        return []
    raw = json.loads(path.read_text("utf-8"))
    resources: list[dict[str, Any]] = []
    for item in raw:
        if not item.get("official"):
            continue
        coords = item.get("googlemapdest") or {}
        street = item.get("streetname", "")
        number = item.get("streetnumber", "")
        addr = f"{number} {street}".strip()
        features: list[str] = []
        if item.get("washrooms") == "Y":
            features.append("Washrooms")
        if item.get("facilities") == "Y":
            features.append("Facilities")
        desc = f"Park in {item.get('neighbourhoodname', 'Vancouver')}"
        if features:
            desc += f" ({', '.join(features)})"
        resources.append({
            "category": "recreation",
            "name": item.get("name", ""),
            "phone": "",
            "address": addr,
            "city": "Vancouver",
            "hours": "Dawn to dusk",
            "languages": ["en"],
            "description": desc,
            "latitude": coords.get("lat"),
            "longitude": coords.get("lon"),
        })
    return resources


# ---------------------------------------------------------------------------
# 5. Crisis / essential resources (hardcoded — always present)
# ---------------------------------------------------------------------------
def get_crisis_resources() -> list[dict[str, Any]]:
    return [
        {
            "category": "emergency_crisis",
            "name": "VictimLink BC",
            "phone": "1-800-563-0808",
            "address": "BC-wide phone support",
            "city": "Vancouver",
            "hours": "24/7",
            "languages": ["en", "fr", "zh", "pa", "es", "ar", "ko", "vi"],
            "description": "Confidential multilingual support for victims of violence and abuse.",
        },
        {
            "category": "emergency_crisis",
            "name": "BC Crisis Centre",
            "phone": "1-800-784-2433",
            "address": "BC-wide phone support",
            "city": "Vancouver",
            "hours": "24/7",
            "languages": ["en"],
            "description": "24-hour crisis and suicide prevention line.",
        },
        {
            "category": "emergency_crisis",
            "name": "Kids Help Phone",
            "phone": "1-800-668-6868",
            "address": "Canada-wide phone support",
            "city": "Vancouver",
            "hours": "24/7",
            "languages": ["en", "fr"],
            "description": "Counselling for children and youth.",
        },
        {
            "category": "mental_health",
            "name": "BC Mental Health Support Line",
            "phone": "310-6789",
            "address": "BC-wide phone support",
            "city": "Vancouver",
            "hours": "24/7",
            "languages": ["en"],
            "description": "No-cost emotional support. No area code needed.",
        },
        {
            "category": "counselling",
            "name": "Women Against Violence Against Women (WAVAW)",
            "phone": "604-255-6344",
            "address": "BC-wide phone support",
            "city": "Vancouver",
            "hours": "24/7 crisis line",
            "languages": ["en"],
            "description": "Crisis support for women who have experienced sexualized violence.",
        },
        {
            "category": "victim_services",
            "name": "Battered Women's Support Services",
            "phone": "604-687-1867",
            "address": "BC-wide phone support",
            "city": "Vancouver",
            "hours": "24/7 crisis line",
            "languages": ["en"],
            "description": "Counselling, advocacy, and practical support for women experiencing violence.",
        },
        {
            "category": "indigenous",
            "name": "Vancouver Aboriginal Friendship Centre",
            "phone": "604-251-4844",
            "address": "1607 E Hastings St, Vancouver",
            "city": "Vancouver",
            "hours": "Mon-Fri 9am-5pm",
            "languages": ["en"],
            "description": "Culturally safe programs and referrals for Indigenous community members.",
        },
        {
            "category": "immigrant_refugee",
            "name": "MOSAIC",
            "phone": "604-254-9626",
            "address": "Multiple locations",
            "city": "Vancouver",
            "hours": "Mon-Fri 9am-5pm",
            "languages": ["en", "zh", "ar", "fa", "ko", "es", "vi", "tl"],
            "description": "Settlement, language, and employment services for immigrants and refugees.",
        },
    ]


# ---------------------------------------------------------------------------
# 6. Excel: Merged Shelter List  →  shelters.json
# ---------------------------------------------------------------------------
def parse_shelter_xlsx() -> list[dict[str, Any]]:
    candidates = list(RAW_DIR.glob("*Shelter*List*.xlsx")) + list(RAW_DIR.glob("*shelter*.xlsx"))
    if not candidates:
        print("  [shelters] No shelter Excel file found – skipping")
        return []
    path = candidates[0]
    print(f"  [shelters] Reading {path.name}")
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    shelters: list[dict[str, Any]] = []

    for ws in wb.worksheets:
        rows = list(ws.iter_rows(values_only=True))
        if len(rows) < 2:
            continue
        headers = [str(h).strip().lower() if h else "" for h in rows[0]]

        def col(name: str) -> int | None:
            for i, h in enumerate(headers):
                if name in h:
                    return i
            return None

        name_i = col("name") or col("shelter") or col("facilit")
        city_i = col("city") or col("communit")
        org_i = col("organ") or col("society") or col("operator")
        phone_i = col("phone") or col("tel")
        type_i = col("type") or col("category")
        lat_i = col("lat")
        lon_i = col("lon") or col("lng")

        for row in rows[1:]:
            def val(i: int | None) -> str:
                if i is None or i >= len(row) or row[i] is None:
                    return ""
                return str(row[i]).strip()

            name = val(name_i)
            if not name:
                continue

            lat_str = val(lat_i)
            lon_str = val(lon_i)
            try:
                lat = float(lat_str) if lat_str else None
            except ValueError:
                lat = None
            try:
                lon = float(lon_str) if lon_str else None
            except ValueError:
                lon = None

            shelters.append({
                "name": name,
                "city": val(city_i) or "Vancouver",
                "organization": val(org_i),
                "phone": val(phone_i),
                "type": val(type_i) or "Shelter",
                "latitude": lat,
                "longitude": lon,
            })

    wb.close()
    return shelters


# ---------------------------------------------------------------------------
# Write outputs
# ---------------------------------------------------------------------------
def write_json(data: Any, filename: str) -> None:
    out = ASSETS_DIR / filename
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    count = len(data) if isinstance(data, list) else "object"
    print(f"  ✓ Wrote {count} entries → {out.relative_to(ROOT)}")


def main() -> None:
    ensure_dirs()

    print("Parsing raw data into app assets...\n")

    # ---------- bc211_resources.json ----------
    resources: list[dict[str, Any]] = []
    print("[1/5] Community centres...")
    resources.extend(parse_community_centres())
    print(f"       {len(resources)} resources so far")

    print("[2/5] Food programs...")
    food = parse_food_programs()
    resources.extend(food)
    print(f"       +{len(food)} food programs")

    print("[3/5] Libraries...")
    libs = parse_libraries()
    resources.extend(libs)
    print(f"       +{len(libs)} libraries")

    print("[4/5] Parks (official only)...")
    parks = parse_parks()
    resources.extend(parks)
    print(f"       +{len(parks)} parks")

    print("[5/5] Crisis & essential resources...")
    crisis = get_crisis_resources()
    resources.extend(crisis)
    print(f"       +{len(crisis)} crisis resources")

    write_json(resources, "bc211_resources.json")

    # ---------- shelters.json ----------
    print("\nParsing shelter Excel...")
    shelters = parse_shelter_xlsx()
    if shelters:
        write_json(shelters, "shelters.json")
    else:
        print("  (Using existing shelters.json)")

    print(f"\nDone! Total resources: {len(resources)}, Shelters: {len(shelters)}")


if __name__ == "__main__":
    main()
