from pydantic import BaseModel

class AnalysisRequest(BaseModel):
    sample_size: int