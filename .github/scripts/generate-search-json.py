import os, json
from bs4 import BeautifulSoup

# Directories to include
include_dirs = ["src/pages"]
output_path = "resrc/data/search.json"
entries = []

for base_dir in include_dirs:
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

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(entries, f, indent=2)

print(f"✅ Generated {output_path} with {len(entries)} entries")
