from sqlalchemy import Column, Integer
from app.model.base import Base

class RandomExperiment(Base):
    __tablename__ = "random_experiments"

    id = Column(Integer, primary_key=True, index=True)