from fastapi import APIRouter, Body, Request
from fastapi.responses import JSONResponse
from app.services.analysis_service import compare_rng

router = APIRouter(prefix="/comparison", tags=["Comparison"])


@router.post("/compare-rng")
def compare_random_generators(request: Request, sample_size: int = Body(..., embed=True)):
    try:
        result = compare_rng(sample_size)

        # Build absolute plot URL from the actual incoming request host.
        # Bypasses BACKEND_URL env var — works on Render, Vercel, and locally.
        relative_path = result.get("comparison_plot", "")
        if relative_path and not relative_path.startswith("http"):
            base = str(request.base_url).rstrip("/")
            result["comparison_plot"] = f"{base}/{relative_path.lstrip('/')}"

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