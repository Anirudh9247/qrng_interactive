from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.model.base import Base

DATABASE_URL = "sqlite:///./qrng.db"

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