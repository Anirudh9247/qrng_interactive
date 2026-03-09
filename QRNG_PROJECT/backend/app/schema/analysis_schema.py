from pydantic import BaseModel


class RandomnessRequest(BaseModel):
    sample_size: int