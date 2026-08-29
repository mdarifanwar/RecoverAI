from fastapi import FastAPI

from app.api.routes import router


app = FastAPI(
    title="RecoverAI AI Service",
    description="AI-powered payment recovery decision service",
    version="1.0.0"
)


app.include_router(router)


@app.get("/")
def root():
    return {
        "service": "RecoverAI AI Service",
        "status": "UP",
        "version": "1.0.0"
    }