# Border Checker

Border Checker is a policy-based data sovereignty assessment tool.

## Project Structure

- `backend/`: FastAPI backend
- `frontend/`: Next.js frontend
- `docs/`: project documents

## Backend Run

```bash
cd backend
python3 -m venv .venv
# activate venv
pip install -r requirements.txt
uvicorn app.main:app --reload
source .venv/bin/activate
