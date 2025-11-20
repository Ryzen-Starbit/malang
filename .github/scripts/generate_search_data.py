import os, json
from datetime import datetime, timezone
from bs4 import BeautifulSoup

# ==========================
# CONFIGURATION
# ==========================
INCLUDE_DIRS = ["src/pages"]
SEARCH_OUTPUT = "resrc/data/search.json"
SITEMAP_OUTPUT = "sitemap.xml"
BASE_URL = "https://www.malangbvp.info/?page="

# ==========================
# GENERATE SEARCH.JSON
# ==========================
entries = []

for base_dir in INCLUDE_DIRS:
    for root, _, files in os.walk(base_dir):
        for file in files:
            if file.endswith(".html"):
                path_ = os.path.join(root, file)
                with open(path_, encoding="utf-8") as f:
                    soup = BeautifulSoup(f, "html.parser")
                    title = soup.title.string.strip() if soup.title else file
                    text = " ".join(soup.get_text().split())
                    entries.append({
                        "title": title,
                        "url": "/" + os.path.relpath(path_, ".").replace("\\", "/"),
                        "content": text[:800]
                    })

# Save search.json
os.makedirs(os.path.dirname(SEARCH_OUTPUT), exist_ok=True)
with open(SEARCH_OUTPUT, "w", encoding="utf-8") as f:
    json.dump(entries, f, indent=2)

print(f"Generated {SEARCH_OUTPUT} with {len(entries)} entries")

# ==========================
# GENERATE SITEMAP.XML
# ==========================
urls = [entry["url"].split("/")[-1] for entry in entries]

sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
]

# Homepage
sitemap.append("  <url>")
sitemap.append("    <loc>https://www.malangbvp.info/</loc>")
sitemap.append(f"    <lastmod>{datetime.now(timezone.utc).date()}</lastmod>")
sitemap.append("    <priority>1.0</priority>")
sitemap.append("  </url>")

# Pages
for page in urls:
    sitemap.append("  <url>")
    sitemap.append(f"    <loc>{BASE_URL}{page}</loc>")
    sitemap.append(f"    <lastmod>{datetime.now(timezone.utc).date()}</lastmod>")
    sitemap.append("    <priority>0.7</priority>")
    sitemap.append("  </url>")

sitemap.append("</urlset>")

# Write sitemap.xml
with open(SITEMAP_OUTPUT, "w", encoding="utf-8") as f:
    f.write("\n".join(sitemap))

print(f"Generated {SITEMAP_OUTPUT} with {len(urls)} URLs")
