from pydantic import BaseModel
class ExperimentRequest(BaseModel):
    generator: str
    sample_size: int
class ExperimentResponse(BaseModel):
    generator: str
    sample_size: int
    zeros: int
    ones: int
    entropy: float