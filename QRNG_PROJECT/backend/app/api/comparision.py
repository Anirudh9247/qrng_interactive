from fastapi import APIRouter, Body
from fastapi.responses import JSONResponse
from app.services.analysis_service import compare_rng

router = APIRouter(prefix="/comparison", tags=["Comparison"])


@router.post("/compare-rng")
def compare_random_generators(sample_size: int = Body(..., embed=True)):
    try:
        result = compare_rng(sample_size)
        return {
            "success": True,
            "data": result,
            "error": None
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "data": None, "error": str(e)}
        )