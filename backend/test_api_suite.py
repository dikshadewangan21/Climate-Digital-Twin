from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_full_pipeline():
    print("1. Testing /health...")
    r = client.get('/health')
    assert r.status_code == 200, r.text
    print("   -> OK:", r.json()['status'])

    print("2. Testing /api/districts...")
    r = client.get('/api/districts')
    assert r.status_code == 200, r.text
    res_data = r.json()
    districts = res_data.get('districts', res_data)
    assert len(districts) == 33, f"Expected 33 districts, got {len(districts)}"
    print(f"   -> OK: {len(districts)} districts loaded. First: {districts[0]['name']} ({districts[0]['temperature_c']} C, {districts[0]['rainfall_mm']} mm)")

    print("3. Testing /api/forecast?district=raipur&days=7...")
    r = client.get('/api/forecast?district=raipur&days=7')
    assert r.status_code == 200, r.text
    fc = r.json()
    assert len(fc['forecast']) == 7
    print("   -> OK: 7-day forecast generated for Raipur. Summary avg temp:", fc['summary']['avg_temperature_c'])

    print("4. Testing /api/alerts...")
    r = client.get('/api/alerts')
    assert r.status_code == 200, r.text
    alerts = r.json()
    print("   -> OK: Alerts summary:", alerts['summary'])

    print("5. Testing /api/scenario (POST)...")
    r = client.post('/api/scenario', json={'district_id': 'raipur', 'temp_delta_c': 2.5, 'rain_delta_pct': -25.0})
    assert r.status_code == 200, r.text
    scen = r.json()
    print("   -> OK: Scenario simulated temp:", scen['scenario']['temperature_c'], "rain:", scen['scenario']['rainfall_mm'])

    print("6. Testing /api/compare?districts=raipur,bastar,surguja...")
    r = client.get('/api/compare?districts=raipur,bastar,surguja')
    assert r.status_code == 200, r.text
    comp = r.json()
    print("   -> OK: Compared", len(comp['districts']), "districts")

    print("7. Testing /api/report?district=raipur...")
    r = client.get('/api/report?district=raipur')
    assert r.status_code == 200, r.text
    rep = r.json()
    print("   -> OK: Report generated for", rep['district']['name'])

    print("\n>>> ALL 7 BACKEND API ENDPOINTS VERIFIED & WORKING PERFECTLY! <<<")

if __name__ == "__main__":
    test_full_pipeline()
