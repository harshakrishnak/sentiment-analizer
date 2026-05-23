import { FormEvent, useState } from "react";

import { analyzeText, AnalysisResult, Sentiment } from "./api";

const MAX_CHARACTERS = 5000;
const sampleText =
  "The customer support team was responsive and resolved my issue quickly. I am very pleased with the overall experience.";

const displayLabel: Record<Sentiment, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
};

function percentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedText = text.trim();

    if (!trimmedText) {
      setError("Enter a paragraph before starting the analysis.");
      setResult(null);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const analysis = await analyzeText(trimmedText);
      setResult(analysis);
    } catch (requestError) {
      setResult(null);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong while analyzing the paragraph.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Natural language insights</p>
        <h1>
          Understand the feeling
          <span> behind every paragraph.</span>
        </h1>
        <p className="intro">
          Paste English text and get an instant sentiment label with a score
          breakdown from positive to negative.
        </p>
      </header>

      <section className="workspace" aria-label="Sentiment analysis workspace">
        <form className="composer" onSubmit={handleSubmit}>
          <div className="composer-header">
            <label htmlFor="paragraph">Paragraph to analyze</label>
            <button
              className="sample-button"
              type="button"
              onClick={() => {
                setText(sampleText);
                setError("");
              }}
            >
              Use sample text
            </button>
          </div>
          <textarea
            id="paragraph"
            placeholder="For example: I appreciated how smoothly everything worked today..."
            value={text}
            maxLength={MAX_CHARACTERS}
            onChange={(event) => setText(event.target.value)}
            rows={9}
          />
          <div className="composer-footer">
            <span className="character-count">
              {text.length.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()}
            </span>
            <button className="analyze-button" type="submit" disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Analyze Sentiment"}
            </button>
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </form>

        <ResultPanel result={result} isLoading={isLoading} />
      </section>

      <p className="model-note">
        Local MVP powered by VADER sentiment scoring. Scores reflect language
        polarity and are not human judgement.
      </p>
    </main>
  );
}

interface ResultPanelProps {
  result: AnalysisResult | null;
  isLoading: boolean;
}

function ResultPanel({ result, isLoading }: ResultPanelProps) {
  if (isLoading) {
    return (
      <aside className="result-panel loading" aria-live="polite">
        <div className="spinner" />
        <p>Reading sentiment signals...</p>
      </aside>
    );
  }

  if (!result) {
    return (
      <aside className="result-panel empty">
        <div className="pulse-mark">Aa</div>
        <h2>Analysis appears here</h2>
        <p>Enter a paragraph and submit it to see its sentiment profile.</p>
      </aside>
    );
  }

  const scores = [
    { key: "positive", label: "Positive", value: result.scores.positive },
    { key: "neutral", label: "Neutral", value: result.scores.neutral },
    { key: "negative", label: "Negative", value: result.scores.negative },
  ];

  return (
    <aside className={`result-panel result ${result.sentiment}`} aria-live="polite">
      <p className="result-label">Detected sentiment</p>
      <div className="headline-result">
        <h2>{displayLabel[result.sentiment]}</h2>
        <span>{percentage(result.confidence)} strength</span>
      </div>
      <div className="compound">
        <span>Compound score</span>
        <strong>{result.compound_score.toFixed(4)}</strong>
      </div>
      <div className="bars">
        {scores.map((score) => (
          <div className="score-row" key={score.key}>
            <div className="score-meta">
              <span>{score.label}</span>
              <span>{percentage(score.value)}</span>
            </div>
            <div className="track">
              <div
                className={`fill ${score.key}`}
                style={{ width: percentage(score.value) }}
              />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default App;

