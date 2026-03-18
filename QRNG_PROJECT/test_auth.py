import requests

base_url = "http://localhost:8000"
session = requests.Session()

print("1. Testing Register...")
try:
    res = session.post(f"{base_url}/register", json={
        "username": "api_test_user",
        "email": "apitest@nexus.io",
        "password": "password123"
    })
    print(f"Status: {res.status_code}, Response: {res.json()}")
except Exception as e:
    print(f"Failed: {e}")

print("\\n2. Testing Login...")
try:
    res = session.post(f"{base_url}/login", data={
        "username": "apitest@nexus.io",
        "password": "password123"
    })
    print(f"Status: {res.status_code}, Response: {res.text}")
    print(f"Cookies: {session.cookies.get_dict()}")
except Exception as e:
    print(f"Failed: {e}")

print("\\n3. Testing Get Profile (/me)...")
try:
    res = session.get(f"{base_url}/me")
    print(f"Status: {res.status_code}, Response: {res.text}")
except Exception as e:
    print(f"Failed: {e}")
