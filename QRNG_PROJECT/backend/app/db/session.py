import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.model.base import Base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./qrng.db")

# Ensure the parent directory exists for the SQLite file (needed on Render disk)
if DATABASE_URL.startswith("sqlite:///"):
    db_path = DATABASE_URL.replace("sqlite:///", "")
    db_dir = os.path.dirname(db_path)
    if db_dir:
        os.makedirs(db_dir, exist_ok=True)

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
from sqlalchemy.orm import Session
from fastapi import Depends

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()