from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy.sql import func
from app.model.base import Base

class RandomExperiment(Base):
    __tablename__ = "random_experiments"

    id = Column(Integer, primary_key=True, index=True)
    generator = Column(String, nullable=False)
    sample_size = Column(Integer, nullable=False)
    zeros = Column(Integer, nullable=False)
    ones = Column(Integer, nullable=False)
    entropy = Column(Float, nullable=False)
    chi_square = Column(Float, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())