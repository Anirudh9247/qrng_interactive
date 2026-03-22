from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Add this import

from app.api.analysis import router as analysis_router
from app.api.comparision import router as comparison_router

load_dotenv()

app = FastAPI(title="Secure QRNG API")

# --- Add this CORS block ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------------------

app.include_router(analysis_router)
app.include_router(comparison_router)

@app.get("/")
def root():
    return {"message": "QRNG Backend Running Successfully"}