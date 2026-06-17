import requests
import json
from datetime import datetime, timezone

API_URL = "https://sozialversicherungssatz.de/api/v1/insurers?active=true&type=GKV&per_page=200"
API_KEY = "svs_K6JDvwWMY4FBboAKIXuZGzPME77d97brCYMIoebMVBmE2tiD"

OUTPUT_FILE = "krankenkassen.json"

headers = {
    "X-API-Key": API_KEY
}

response = requests.get(API_URL, headers=headers, timeout=30)
response.raise_for_status()

data = response.json()

result = {
    #"updated_at": datetime.now(timezone.utc).isoformat(),
    "updated_at": datetime.now().strftime("%Y-%m-%d"),
    "data": data
}

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(
    f"Сохранено {len(data.get('data', data))} записей "
    f"в {OUTPUT_FILE}"
)

input("Выйти? (y/n): ")