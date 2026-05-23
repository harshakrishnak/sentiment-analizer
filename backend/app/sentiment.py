from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from .schemas import AnalyzeResponse, ScoreBreakdown


class SentimentService:
    def __init__(self) -> None:
        self._analyzer = SentimentIntensityAnalyzer()

    def analyze(self, text: str) -> AnalyzeResponse:
        raw_scores = self._analyzer.polarity_scores(text)
        compound = raw_scores["compound"]

        if compound >= 0.05:
            sentiment = "positive"
        elif compound <= -0.05:
            sentiment = "negative"
        else:
            sentiment = "neutral"

        return AnalyzeResponse(
            text=text,
            sentiment=sentiment,
            compound_score=compound,
            confidence=round(abs(compound), 4),
            scores=ScoreBreakdown(
                positive=raw_scores["pos"],
                neutral=raw_scores["neu"],
                negative=raw_scores["neg"],
            ),
        )

