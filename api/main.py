from pathlib import Path
from typing import Literal
import json

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="PlayRead assessment API", version="0.1.0")
DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "demo_candidates.json"
WEIGHTS = {"code": 0.30, "provenance": 0.25, "production": 0.20, "playability": 0.15, "commercial": 0.10}


class DimensionScores(BaseModel):
    code: int = Field(ge=0, le=100)
    provenance: int = Field(ge=0, le=100)
    production: int = Field(ge=0, le=100)
    playability: int = Field(ge=0, le=100)
    commercial: int = Field(ge=0, le=100)


class AssessmentRequest(BaseModel):
    dimensions: DimensionScores | None = None


class AssessmentResponse(BaseModel):
    candidate_id: str
    score: int
    verdict: Literal["SIGN", "INVESTIGATE", "REJECT"]
    confidence: Literal["HIGH", "MEDIUM", "LOW"]
    driver_keys: list[str]
    evidence_gaps: list[str]
    simulated: bool = True


def load_candidates() -> list[dict]:
    return json.loads(DATA_PATH.read_text(encoding="utf-8"))


def assess_candidate(candidate: dict, override: DimensionScores | None = None) -> AssessmentResponse:
    dimensions = override.model_dump() if override else candidate["dimensions"]
    score = round(sum(dimensions[key] * weight for key, weight in WEIGHTS.items()))
    verdict = "SIGN" if score <= 32 else "INVESTIGATE" if score <= 62 else "REJECT"
    evidence_count = len(candidate["evidence"]) + min(len(candidate["gaps"]), 5)
    confidence = "HIGH" if evidence_count >= 8 else "MEDIUM" if evidence_count >= 6 else "LOW"
    driver_keys = sorted(WEIGHTS, key=lambda key: dimensions[key], reverse=True)[:3]
    return AssessmentResponse(candidate_id=candidate["id"], score=score, verdict=verdict, confidence=confidence, driver_keys=driver_keys, evidence_gaps=candidate["gaps"])


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/assess/{candidate_id}", response_model=AssessmentResponse)
def assess(candidate_id: str, request: AssessmentRequest) -> AssessmentResponse:
    candidate = next((item for item in load_candidates() if item["id"] == candidate_id), None)
    if candidate is None:
        raise HTTPException(status_code=404, detail="candidate_not_found")
    return assess_candidate(candidate, request.dimensions)
