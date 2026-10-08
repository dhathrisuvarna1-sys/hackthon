from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "en" in data["languages_supported"]

def test_analyze_empty_message():
    response = client.post("/api/analyze/message", json={"text": "   "})
    assert response.status_code == 400

def test_analyze_valid_scam_message():
    response = client.post("/api/analyze/message", json={
        "text": "Your account will be blocked today. Click http://verify-kyc.xyz immediately."
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["SCAM", "SUSPICIOUS"]
    assert "id" in data
    assert len(data["evidence"]) > 0

def test_analyze_upi_endpoint():
    response = client.post("/api/analyze/upi", json={
        "requester": "Refund Desk",
        "upi_id": "refund@okaxis",
        "amount": "2000",
        "type": "Collect",
        "note": "Approve to receive refund"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SCAM"

def test_get_learn_topics():
    response = client.get("/api/learn")
    assert response.status_code == 200
    topics = response.json()
    assert len(topics) >= 8
    assert any(t["slug"] == "fake-kyc" for t in topics)
