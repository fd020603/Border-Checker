# Border Checker

Border Checker is a full-stack decision-support application for cross-border
data transfer and data sovereignty review. It combines discovered technical
metadata with manual policy context, evaluates GDPR and Saudi PDPL rule packs, and
returns only qualitative decisions with explainable actions and legal basis
references.

This project is intentionally positioned as an internal compliance support tool.
It does not replace legal advice.

## What It Does

- Merges cloud or discovered technical metadata with business and policy inputs
- Evaluates a GDPR cross-border transfer pack with rule precedence only
- Returns one normalized decision grade:
  - `deny`
  - `manual_review`
  - `condition_allow`
  - `allow`
- Preserves triggered-rule rationale, legal basis references, required actions,
  next steps, and review hints
- Provides a Korean-language Next.js UI connected to the real FastAPI backend
- Provides a guided step-by-step input workflow with pack-specific questions and persisted values

## Architecture

- `backend/`
  - FastAPI API layer
  - merge, evaluate, packs, and demo-sample endpoints
  - rule evaluation engine with triggered-rule trace output
  - multi-pack policy directories under `policy_packs/`
- `frontend/`
  - Next.js App Router UI
  - real fetch integration to backend APIs
  - pack selector, guided step wizard, merge preview, decision result, and explainability panels
- `backend/sample_inputs/`
  - reference inputs for backend testing and policy-pack maintenance

## Decision Model

Scoring is removed from the product.

Final decisions are resolved by strict rule precedence only:

`deny > manual_review > condition_allow > allow`

If multiple rules trigger, the strictest decision wins while all triggered
rules, actions, and references remain visible in the response.

## Main API Endpoints

- `GET /api/v1/packs`
  - lists supported pack summaries
- `GET /api/v1/packs/{pack_id}/detail`
  - returns pack metadata used by the frontend
- `POST /api/v1/merge`
  - merges custom technical and policy inputs
- `POST /api/v1/evaluate`
  - runs the qualitative policy evaluation
- `GET /api/v1/samples/demo`
  - returns backend demo scenarios for API testing or pack validation

## Run Locally

### 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend default URL:

```bash
http://127.0.0.1:8000
```

### 2. Frontend

```bash
cd frontend
npm ci
npm run dev
```

Frontend default URL:

```bash
http://127.0.0.1:3000
```

Optional environment variable:

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## Demo Flow

1. Open the frontend
2. Choose the legal pack, then answer the step-by-step guided questions
3. Click `병합 미리보기` to inspect the merged input
4. Click `평가 실행`
5. Review the final decision, triggered rules, legal basis, and next steps

## Sample Scenarios Included

- Korea adequacy path: expected `allow`
- US transfer with SCC path and missing documentation: expected `condition_allow`
- Sensitive-data transfer with incomplete evidence: expected `manual_review`
- Third-country transfer with no valid mechanism: expected `deny`

Saudi PDPL pack metadata also includes sample scenario definitions for internal validation,
but the main site uses direct user input rather than a sample-loader flow.

## Policy Pack Files

- GDPR pack:
  - `backend/policy_packs/gdpr/gdpr_pack_v3.json`
  - `backend/policy_packs/gdpr/input_schema_v2.json`
- Saudi PDPL pack:
  - `backend/policy_packs/saudi_pdpl/saudi_pdpl_pack_v1.json`
  - `backend/policy_packs/saudi_pdpl/input_schema_v1.json`

If you want to change policy logic, start here:

- update rules in the relevant JSON file under `backend/policy_packs/<pack_id>/`
- adjust pack-specific derived facts in `backend/app/services/derived_fields.py`
- update pack loading in `backend/app/services/pack_loader.py`
- update guided input definitions in `frontend/app/guided-pack-config.ts`

## Verification

Backend tests:

```bash
cd backend
python -m unittest discover -s tests
```

Frontend checks:

```bash
cd frontend
npm run lint
npm run build
```

## Limitations

- This tool is a policy-based decision-support aid, not a legal advice engine
- Unknown or incomplete facts may correctly produce `manual_review`
- The GDPR pack is operational and demo-ready, but not a substitute for
  case-specific legal review

## Disclaimer

This tool is a policy-based decision-support aid and does not replace formal
legal review, DPO review, or legal counsel where interpretation is uncertain.
