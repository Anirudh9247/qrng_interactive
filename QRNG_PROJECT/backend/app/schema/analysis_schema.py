from pydantic import BaseModel

class AnalysisRequest(BaseModel):
    num_qubits: int