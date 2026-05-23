from pydantic import BaseModel, Field, field_validator


class AnalyzeRequest(BaseModel):
    text: str = Field(..., max_length=5000, description="English text to analyze.")

    @field_validator("text")
    @classmethod
    def text_must_contain_content(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Text must not be empty.")
        return value


class ScoreBreakdown(BaseModel):
    positive: float
    neutral: float
    negative: float


class AnalyzeResponse(BaseModel):
    text: str
    sentiment: str
    compound_score: float
    confidence: float
    scores: ScoreBreakdown

