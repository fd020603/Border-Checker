from fastapi import FastAPI

app = FastAPI(
    title="Border Checker API",
    version="0.1.0",
    description="Policy-based data sovereignty assessment API"
)

@app.get("/")
def read_root():
    return {
        "project": "Border Checker",
        "status": "ok",
        "message": "Backend is running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}