# PlayRead

PlayRead is a runnable concept prototype for standardized technical diligence on indie game publishing deals. It turns fictional code, rights, production, stability, and commercial evidence into an explainable `SIGN`, `INVESTIGATE`, or `REJECT` read.

The GitHub Pages demo is frontend-only and uses explicitly fictional fixtures with simulated analysis. The FastAPI service is real, deterministic, tested source but is **not publicly deployed**. This is decision support, not legal advice or an autonomous greenlight system.

## Run

```bash
npm ci
npm run dev
uv sync --project api --locked --dev
uv run --project api uvicorn main:app --reload
```

## Verify

```bash
npm run typecheck
npm run test:e2e
npm run build
npm run audit:prod
uv run --project api pytest api/tests
```

## Product slice

- Compare three fictional candidate builds.
- Run a deterministic five-dimension greenlight assessment.
- Inspect evidence, filter by diligence area, and see open gaps.
- Exercise loading, failure, retry, stale-result clearing, and three verdict paths.
- Call `POST /assess/{candidate_id}` with fixture scores or a validated override.

See [research/notes.md](research/notes.md), [docs/PRODUCT.md](docs/PRODUCT.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), and [docs/BUILD_PROMPTS.md](docs/BUILD_PROMPTS.md).
