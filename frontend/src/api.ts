export type Sentiment = "positive" | "neutral" | "negative";

export interface AnalysisResult {
  text: string;
  sentiment: Sentiment;
  compound_score: number;
  confidence: number;
  scores: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

export async function analyzeText(text: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("Analysis could not be completed. Please try again.");
  }

  return (await response.json()) as AnalysisResult;
}
