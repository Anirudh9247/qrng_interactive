from sqlalchemy import Column, Integer, Float, String
from app.model.base import Base

class RandomExperiment(Base):
    __tablename__ = "random_experiments"

    id = Column(Integer, primary_key=True, index=True)
    generator = Column(String)
    sample_size = Column(Integer)
    zeros = Column(Integer)
    ones = Column(Integer)
    entropy = Column(Float)