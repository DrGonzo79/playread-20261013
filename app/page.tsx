"use client";

import {useMemo, useState} from "react";
import rawCandidates from "../data/demo_candidates.json";
import {assess, type Assessment, type Candidate, type Dimension} from "../lib/assessment";

const candidates = rawCandidates as Candidate[];
const filters: {key: "all" | Dimension; label: string}[] = [
  {key: "all", label: "All evidence"}, {key: "code", label: "Code"}, {key: "provenance", label: "Rights"},
  {key: "production", label: "Production"}, {key: "playability", label: "Stability"}, {key: "commercial", label: "Market"}
];

export default function Home() {
  const [candidateId, setCandidateId] = useState(candidates[1].id);
  const [filter, setFilter] = useState<"all" | Dimension>("all");
  const [result, setResult] = useState<Assessment | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [failNext, setFailNext] = useState(false);
  const candidate = candidates.find(item => item.id === candidateId) ?? candidates[0];
  const visibleEvidence = useMemo(() => candidate.evidence.filter(item => filter === "all" || item.key === filter), [candidate, filter]);

  function selectCandidate(id: string) {
    setCandidateId(id); setResult(null); setState("idle"); setFilter("all");
  }

  function runAssessment() {
    setState("loading"); setResult(null);
    window.setTimeout(() => {
      if (failNext) {setState("error"); setFailNext(false); return;}
      setResult(assess(candidate)); setState("idle");
    }, 450);
  }

  return <main>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="PlayRead home"><span>PR</span>PlayRead</a>
      <div className="demo-pill">FICTIONAL DEMO · SIMULATED ANALYSIS</div>
      <a className="text-link" href="#method">Methodology ↗</a>
    </header>

    <section className="hero" id="top">
      <div>
        <p className="eyebrow">PUBLISHER GREENLIGHT ROOM / READ 024</p>
        <h1>Know what’s hiding<br/>inside the build.</h1>
      </div>
      <p className="dek">A decision workspace for scouts and technical producers. Compare prototype evidence, surface deal-breakers, and issue a reviewable greenlight read.</p>
    </section>

    <section className="workspace" aria-label="Prototype diligence workspace">
      <aside className="candidate-list">
        <div className="section-label"><span>Candidate builds</span><b>03</b></div>
        {candidates.map((item, index) => <button key={item.id} onClick={() => selectCandidate(item.id)} className={`candidate ${item.id === candidate.id ? "active" : ""}`} aria-pressed={item.id === candidate.id}>
          <span className="candidate-no">0{index + 1}</span>
          <span><strong>{item.title}</strong><small>{item.studio} · {item.engine}</small></span>
          <span aria-hidden="true">→</span>
        </button>)}
        <div className="privacy-note"><b>LOCAL DEMO</b><p>No files leave this browser. Production ingestion is intentionally not implemented.</p></div>
      </aside>

      <div className="review-panel">
        <div className="project-head">
          <div><p className="eyebrow">{candidate.stage} · {candidate.ask}</p><h2>{candidate.title}</h2><p>{candidate.studio} / {candidate.engine}</p></div>
          <div className="head-actions">
            <label className="failure-toggle"><input type="checkbox" checked={failNext} onChange={e => setFailNext(e.target.checked)}/> Simulate service failure</label>
            <button className="primary" onClick={runAssessment} disabled={state === "loading"}>{state === "loading" ? "Reading build…" : result ? "Run again" : "Run greenlight read"}</button>
          </div>
        </div>

        {state === "error" && <div className="error-panel" role="alert"><div><b>ASSESSMENT_UNAVAILABLE</b><p>The simulated analysis service did not return a result. No verdict was saved.</p></div><button onClick={runAssessment}>Retry assessment</button></div>}

        {!result && state !== "error" && <div className={`empty-state ${state === "loading" ? "loading" : ""}`} aria-live="polite">
          <div className="scanline"/><span className="big-mark">{state === "loading" ? "•••" : "↳"}</span>
          <h3>{state === "loading" ? "Tracing evidence paths" : "No decision issued yet"}</h3>
          <p>{state === "loading" ? "Applying the five-dimension risk contract to fictional evidence." : "Review the evidence below, then run the greenlight read. The result is decision support—not legal advice."}</p>
        </div>}

        {result && <section className={`verdict verdict-${result.verdict.toLowerCase()}`} aria-live="polite" data-testid="verdict">
          <div><p className="eyebrow">RECOMMENDATION / {result.confidence} CONFIDENCE</p><h3>{result.verdict}</h3><p>{result.verdict === "SIGN" ? "Risk is bounded enough to move into term-sheet diligence." : result.verdict === "INVESTIGATE" ? "Resolve the named evidence gaps before committing capital." : "The current build and plan exceed the acceptable risk envelope."}</p></div>
          <div className="score-ring" style={{"--score": result.score} as React.CSSProperties}><strong>{result.score}</strong><span>RISK / 100</span></div>
          <div className="drivers"><span>TOP DRIVERS</span>{result.drivers.map(driver => <b key={driver.key}>{driver.label}</b>)}</div>
        </section>}

        <section className="evidence-section">
          <div className="section-label"><span>Evidence ledger</span><b>{candidate.evidence.length} checks</b></div>
          <div className="filters" role="group" aria-label="Filter evidence">
            {filters.map(item => <button key={item.key} className={filter === item.key ? "active" : ""} onClick={() => setFilter(item.key)}>{item.label}</button>)}
          </div>
          <div className="evidence-grid">
            {visibleEvidence.length ? visibleEvidence.map(item => <article key={item.key} className="evidence-card">
              <div><span className={`status status-${item.status}`}>{item.status}</span><span>{candidate.dimensions[item.key]} risk</span></div>
              <h3>{item.label}</h3><p>{item.detail}</p>
            </article>) : <p className="no-evidence">No evidence in this view.</p>}
          </div>
        </section>

        <section className="gaps">
          <div><p className="eyebrow">OPEN EVIDENCE GAPS</p><h3>{candidate.gaps.length} questions before signature</h3></div>
          <ol>{candidate.gaps.map(gap => <li key={gap}>{gap}</li>)}</ol>
        </section>
      </div>
    </section>

    <section className="method" id="method">
      <p className="eyebrow">METHOD / VERSION 0.1</p><h2>Evidence before automation.</h2>
      <div><p>Risk scores weight code health 30%, rights provenance 25%, production feasibility 20%, playability 15%, and commercial evidence 10%. Lower is safer.</p><p>All candidates and findings are fictional. The production concept requires human review, isolated compute, verifiable deletion, and qualified legal counsel.</p></div>
    </section>
    <footer><span>PLAYREAD / CONCEPT PROTOTYPE</span><span>Source idea: IdeaBrowser · Oct 13, 2026</span></footer>
  </main>;
}
