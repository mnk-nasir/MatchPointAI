import json
import requests

BASE = "http://localhost:8000/api/v1"

payload = {
    "step1": {
        "companyName": "NextGen",
        "legalStructure": "LTD",
        "incorporationYear": 2023,
        "country": "UK",
        "stage": "MVP",
        "previousFunding": 50000
    },
    "step2": {},
    "step3": {"tam": 500},
    "step4": {"monthlyRevenue": 20000, "activeUsers": 1500},
    "step5": {"foundersCount": 2, "hasTechnicalFounder": True},
    "step6": {"burnRate": 15000},
    "step7": {},
    "step8": {"exitStrategy": "Acquisition"}
}

resp = requests.post(f"{BASE}/evaluations/submit/", json=payload, timeout=20)
print("Status:", resp.status_code)
print(json.dumps(resp.json(), indent=2))

if resp.status_code == 201 and "evaluation_id" in resp.json():
    eid = resp.json()["evaluation_id"]
    detail = requests.get(f"{BASE}/evaluations/{eid}/", timeout=20)
    print("Detail status:", detail.status_code)
    try:
        print(json.dumps(detail.json(), indent=2))
    except Exception:
        print(detail.text)
