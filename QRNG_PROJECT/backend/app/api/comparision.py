from fastapi import APIRouter, Body
from app.services.analysis_service import compare_rng

router = APIRouter(prefix="/comparison", tags=["Comparison"])


@router.post("/compare-rng")
def compare_random_generators(sample_size: int = Body(..., embed=True)):
    result = compare_rng(sample_size)
    return result