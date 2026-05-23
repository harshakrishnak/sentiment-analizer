from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .schemas import AnalyzeRequest, AnalyzeResponse
from .sentiment import SentimentService

app = FastAPI(
    title="Sentiment Analyzer API",
    description="Analyze the sentiment of an English paragraph.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sentiment_service = SentimentService()


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze_sentiment(request: AnalyzeRequest) -> AnalyzeResponse:
    return sentiment_service.analyze(request.text)

