# Product plan

## ICP and JTBD

The initial ICP is a head of scouting, portfolio director, or technical producer at a 10–50 person indie publisher signing 10–30 games a year. When a playable prototype survives initial scouting, they need to decide whether to risk roughly $1M without stitching together unstructured code, rights, production, playtest, and market notes.

## MVP and offer

Sell a human-reviewed seven-day greenlight memo for $4,500. The software supports evidence capture and comparison; it does not replace expert judgment. The 24-hour free snapshot earns trust, the $7,500 rush option prices urgency, and a $7,500/month retainer covers three memos. Do not build the retainer platform until a one-off memo sells.

## Data model

- `Candidate`: studio, build, engine, stage, funding ask.
- `EvidenceArtifact`: immutable source reference, area, finding, status, reviewer, collected time.
- `Assessment`: versioned weights, risk score, confidence, verdict, drivers, gaps.
- `Decision`: human disposition, rationale, conditions, overrides.
- `AccessEvent`: actor, artifact, purpose, timestamp, deletion receipt.

The demo persists none of these and imports three shared fictional fixtures.

## Architecture and AI strategy

Static Next.js provides a safe public interaction. FastAPI owns the deterministic assessment contract. Production would add isolated ephemeral workers, per-engine analyzers, a rights ledger, encrypted evidence storage, and a reviewer console. AI may summarize evidence or suggest questions, but every claim must cite an artifact and every verdict remains human-approved. Never train on customer builds by default.

## Economics and GTM

Fifty qualified publisher outreaches × a 30% free-snapshot acceptance assumption × 40% memo conversion yields six memos and $27K in 90 days. Two retainers in months 9–12 plus six additional memos yields the report’s roughly $114K year-one model. Every conversion rate is unproven. Search demand is zero, so distribution is founder-led outreach through trusted scouts, technical producers, industry events, and the 403-publisher target list.

## Validation, moat, and risks

Validate build-sharing before automation: 10 qualified calls, three observed triages, two NDA-approved builds, one paid memo. Track willingness to share, price acceptance, analyst hours, decision changes, and false-positive overrides. The only credible moat is an outcome-linked benchmark corpus plus trust; the format alone is copyable. Existential risks are a build leak, false certainty, outsider distribution, regulatory change, and a buyer ceiling near $4M ARR.

## 30 / 60 / 90 days

- **30:** sell one concierge pilot; observe three real triages; finalize NDA, retention, and evidence taxonomy.
- **60:** deliver five memos manually; measure reviewer time and decision changes; prototype an offline scanner inside an isolated sandbox.
- **90:** target six paid memos; publish anonymized benchmark ranges; decide whether evidence ingestion deserves investment. Kill the product if sharing or payment thresholds fail.
