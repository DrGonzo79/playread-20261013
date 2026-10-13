# Architecture

```text
shared fictional JSON ─┬─> Next.js static UI ─> deterministic browser assessment ─> verdict + evidence
                       └─> FastAPI loader ─────> validated weighted assessment ─────> JSON contract
```

The public Pages deployment contains only the static frontend. It deliberately does not call a backend. The Python service reads the same explicit fixtures, accepts bounded score overrides, performs a weighted domain calculation, and exposes health and assessment endpoints.

## Failure paths

| Path | Trigger | Visible behavior |
|---|---|---|
| Empty | No assessment yet | Neutral prompt; no implied verdict |
| Loading | Assessment requested | Disabled action and animated evidence scan |
| Upstream error | Demo failure toggle | Named error, no saved verdict, retry action |
| Invalid input | Score outside 0–100 | FastAPI `422` with field path |
| Missing entity | Unknown candidate | FastAPI `404 candidate_not_found` |
| Stale state | Candidate changed | Prior result and filter are cleared |

## Production boundaries

Source archives and binaries must execute only in isolated, time-bounded workers with malware scanning, zero standing credentials, encryption, immutable access logs, tenant isolation, and verified deletion. Assessment versions are immutable. Human decisions and overrides are separate events. Legal review remains a qualified-human workflow.
