import requests, time, json
from bs4 import BeautifulSoup
from urllib.parse import urljoin

BASE = "https://qbreader.org"
START_URLS = [
    "https://qbreader.org/set/.../",   # fill with allowed URLs
]

headers = {
    "User-Agent": "YourName (LLM project; permitted scraper)"
}

out = []

def scrape_question_page(url):
    r = requests.get(url, headers=headers)
    soup = BeautifulSoup(r.text, "html.parser")

    q = soup.select_one(".question-text").get_text(strip=True)
    a = soup.select_one(".answer-text").get_text(strip=True)

    return {
        "id": url.split("/")[-1],
        "url": url,
        "question": q,
        "answer": a,
    }

for page in START_URLS:
    r = requests.get(page, headers=headers)
    soup = BeautifulSoup(r.text, "html.parser")

    links = [
        urljoin(BASE, a["href"])
        for a in soup.select("a.question-link")
    ]

    for link in links:
        try:
            item = scrape_question_page(link)
            out.append(item)
            print("Scraped:", link)
        except Exception as e:
            print("Error:", link, e)
        time.sleep(1.0)

with open("data/cleaned.jsonl", "w", encoding="utf8") as f:
    for item in out:
        f.write(json.dumps(item, ensure_ascii=False) + "\n")
