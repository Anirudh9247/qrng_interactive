from dotenv import load_dotenv
from fastapi import FastAPI

from app.api.user import router as user_router
from app.api.analysis import router as analysis_router
from app.api.comparision import router as comparison_router

load_dotenv()

app = FastAPI(title="Secure QRNG API")

app.include_router(user_router)
app.include_router(analysis_router)
app.include_router(comparison_router)


@app.get("/")
def root():
    return {"message": "QRNG Backend Running Successfully"}