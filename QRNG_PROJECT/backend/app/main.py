from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Add this import
from fastapi.staticfiles import StaticFiles

from app.api.analysis import router as analysis_router
from app.api.comparision import router as comparison_router
from app.db.session import engine
from app.model.random_experiment import Base

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Secure QRNG API")

# --- Add this CORS block ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------------------

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(analysis_router)
app.include_router(comparison_router)

@app.get("/")
def root():
    return {"message": "QRNG Backend Running Successfully"}