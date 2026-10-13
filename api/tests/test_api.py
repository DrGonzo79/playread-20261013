from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health() -> None:
    assert client.get("/health").json() == {"status": "ok"}


def test_fixture_verdicts_cover_decision_range() -> None:
    expected = {"starfall": "SIGN", "echoes": "INVESTIGATE", "neon": "REJECT"}
    for candidate_id, verdict in expected.items():
        response = client.post(f"/assess/{candidate_id}", json={})
        assert response.status_code == 200
        assert response.json()["verdict"] == verdict
        assert response.json()["simulated"] is True


def test_override_is_a_real_domain_operation() -> None:
    response = client.post("/assess/echoes", json={"dimensions": {"code": 10, "provenance": 10, "production": 10, "playability": 10, "commercial": 10}})
    assert response.status_code == 200
    assert response.json()["score"] == 10
    assert response.json()["verdict"] == "SIGN"


def test_invalid_score_and_missing_candidate_are_visible() -> None:
    invalid = client.post("/assess/echoes", json={"dimensions": {"code": 101, "provenance": 10, "production": 10, "playability": 10, "commercial": 10}})
    assert invalid.status_code == 422
    missing = client.post("/assess/unknown", json={})
    assert missing.status_code == 404
    assert missing.json()["detail"] == "candidate_not_found"
