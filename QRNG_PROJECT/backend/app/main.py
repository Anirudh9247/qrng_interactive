from dotenv import load_dotenv
from fastapi import FastAPI
from app.api.user import router as user_router

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Secure QRNG API")

app.include_router(user_router)

@app.get("/")
def root():
    return {"message": "QRNG Backend Running Successfully"}