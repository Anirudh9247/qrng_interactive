from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.model.base import Base

DATABASE_URL = "postgresql://postgres:postgre@localhost:5432/qrng_db"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
