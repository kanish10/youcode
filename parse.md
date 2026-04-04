# BC211 Data Extraction Guide (for Codebase Integration)

## 🎯 Goal

Extract structured data from multiple BC211 search result pages and convert it into a format (JSON) that can be used in your codebase (e.g., for APIs, databases, or AI pipelines).

---

## 📥 Input

A list of BC211 URLs containing filtered search results (HTML pages, no export option available).

---

## 🧠 Recommended Approach: Web Scraping → JSON

### 1. Install Dependencies

```bash
pip install requests beautifulsoup4 pandas
```

---

### 2. Basic Scraper (Python)

```python
import requests
from bs4 import BeautifulSoup
import pandas as pd

urls = [
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
    "https://bc.211.ca/result/?topics=390:391:392:393:394:395:396:397:398"
]

all_data = []

for url in urls:
    res = requests.get(url)
    soup = BeautifulSoup(res.text, "html.parser")

    # Adjust selectors after inspecting the site
    cards = soup.select(".result-item")

    for c in cards:
        title = c.select_one(".title")
        desc = c.select_one(".description")
        phone = c.select_one(".phone")

        all_data.append({
            "title": title.text.strip() if title else None,
            "description": desc.text.strip() if desc else None,
            "phone": phone.text.strip() if phone else None,
            "source": url
        })

df = pd.DataFrame(all_data)
df.to_json("bc211_data.json", orient="records", indent=2)
```

---

## ⚡ Alternative (Better): Use Hidden API

### Steps:

1. Open Chrome DevTools → Network tab
2. Filter by `XHR` or `Fetch`
3. Reload page
4. Look for API calls like:

   ```
   /api/search?topics=...
   ```

### If found:

```python
import requests

url = "API_ENDPOINT_HERE"
res = requests.get(url)
data = res.json()
```

✔ Advantages:

* Cleaner structured data
* Faster and more reliable
* No HTML parsing required

---

## 🧱 If Content is JavaScript Rendered → Use Playwright

### Install:

```bash
pip install playwright
playwright install
```

### Example:

```python
from playwright.sync_api import sync_playwright

urls = ["https://bc.211.ca/result/?topics=501:502"]

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()

    for url in urls:
        page.goto(url)
        page.wait_for_timeout(3000)

        items = page.query_selector_all(".result-item")

        for item in items:
            print(item.inner_text())

    browser.close()
```

---

## 🗃️ Output Format (Recommended JSON Structure)

```json
{
  "title": "Service Name",
  "description": "Service description",
  "phone": "Contact number",
  "category": "Optional category",
  "location": "Optional location",
  "source": "URL"
}
```

---

## 🚀 Integration into Codebase

### Option A: Local File

* Save as `bc211_data.json`
* Load directly in your app

### Option B: Database

* MongoDB → flexible JSON storage
* PostgreSQL → structured queries
* Vector DB → for AI retrieval

---

## 🤖 For AI / RAG Use Case

### Recommended Pipeline:

1. Clean text fields
2. Chunk descriptions
3. Generate embeddings
4. Store in vector DB

### Example Entry:

```json
{
  "title": "...",
  "description": "...",
  "embedding": "..."
}
```

---

## ⚠️ Important Considerations

* Handle **pagination** (multiple result pages)
* Add delays to avoid rate limits:

```python
import time
time.sleep(1)
```

* Check for **duplicate entries**
* Respect website **terms of use**

---

## ✅ Next Steps (for Cursor)

Ask Cursor to:

* Convert scraper into production-ready module
* Add pagination support
* Add retries + error handling
* Save to DB instead of JSON
* Build ingestion pipeline for RAG

---

If you want, I can also generate a **Cursor prompt** that tells it exactly how to turn this into a full pipeline (scraper + DB + embeddings).
