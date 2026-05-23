from fastapi.testclient import TestClient
import pytest

from app.main import app


client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_analyze_positive_paragraph() -> None:
    response = client.post(
        "/api/analyze",
        json={"text": "I absolutely love this wonderful and excellent service."},
    )

    payload = response.json()
    assert response.status_code == 200
    assert payload["sentiment"] == "positive"
    assert payload["compound_score"] > 0
    assert payload["scores"]["positive"] > 0


def test_analyze_rejects_blank_text() -> None:
    response = client.post("/api/analyze", json={"text": "   "})

    assert response.status_code == 422


def test_serves_frontend_homepage_when_built_assets_exist() -> None:
    response = client.get("/")

    if response.status_code == 404:
        pytest.skip("Frontend production assets have not been built.")

    assert response.status_code == 200
    assert "Sentiment Lens" in response.text
