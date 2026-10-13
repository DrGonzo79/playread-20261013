export type Dimension = "code" | "provenance" | "production" | "playability" | "commercial";
export type Evidence = {key: Dimension; label: string; detail: string; status: "pass" | "watch" | "risk"};
export type Candidate = {
  id: string; title: string; studio: string; engine: string; stage: string; ask: string;
  dimensions: Record<Dimension, number>; evidence: Evidence[]; gaps: string[];
};
export type Assessment = {score: number; verdict: "SIGN" | "INVESTIGATE" | "REJECT"; confidence: "HIGH" | "MEDIUM" | "LOW"; drivers: Evidence[]};

const weights: Record<Dimension, number> = {code: .3, provenance: .25, production: .2, playability: .15, commercial: .1};

export function assess(candidate: Candidate): Assessment {
  const score = Math.round((Object.keys(weights) as Dimension[]).reduce((sum, key) => sum + candidate.dimensions[key] * weights[key], 0));
  const verdict = score <= 32 ? "SIGN" : score <= 62 ? "INVESTIGATE" : "REJECT";
  const evidenceCount = candidate.evidence.length + Math.min(candidate.gaps.length, 5);
  const confidence = evidenceCount >= 8 ? "HIGH" : evidenceCount >= 6 ? "MEDIUM" : "LOW";
  const drivers = [...candidate.evidence].sort((a, b) => candidate.dimensions[b.key] - candidate.dimensions[a.key]).slice(0, 3);
  return {score, verdict, confidence, drivers};
}
