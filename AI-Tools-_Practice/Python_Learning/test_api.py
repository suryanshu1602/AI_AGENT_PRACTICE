import requests

base_url = "https://jsonplaceholder.typicode.com"
endpoint = "/posts/1"
expected_status = 200

print(f"I will hit this {base_url}{endpoint}, and I am expecting that it will be {expected_status} Ok!")

response = requests.get(f"{base_url}{endpoint}")

if response.status_code == expected_status:
    print(f"[OK] Got {response.status_code} - {response.json()['title']}")
else:
    print(f"[FAIL] Expected {expected_status}, got {response.status_code}")
