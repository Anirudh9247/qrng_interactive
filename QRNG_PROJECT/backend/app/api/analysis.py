from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.schema.analysis_schema import RandomnessRequest
from app.schema.experiment_schema import ExperimentRequest

from app.services.quantum_service import generate_qubits
from app.services.classical_rng_service import generate_classical_bits
from app.services.analysis_service import run_experiment

from app.db.session import get_db
from app.model.random_experiment import RandomExperiment

from fastapi import HTTPException
from fastapi.responses import JSONResponse
from app.utils.randomness_tests import (
    frequency_test,
    entropy_test,
)

router = APIRouter()


@router.post("/analyze-randomness")
async def analyze_randomness(data: RandomnessRequest):
    try:
        if data.sample_size > 1_000_000:
            return JSONResponse(
                status_code=400,
                content={"success": False, "data": None, "error": "Sample size too large. Max allowed = 1,000,000"}
            )

        bits = generate_qubits(data.sample_size)

        frequency = frequency_test(bits)
        entropy = entropy_test(bits)

        return {
            "success": True,
            "data": {
                "generated_bits": bits,
                "frequency_test": frequency,
                "entropy_test": entropy
            },
            "error": None
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "data": None, "error": str(e)}
        )


@router.post("/run-experiment")
def run_experiment_endpoint(generator: str, sample_size: int):
    try:
        if generator == "quantum":
            bits = generate_qubits(sample_size)
        elif generator == "classical":
            bits = generate_classical_bits(sample_size)
        else:
            return JSONResponse(
                status_code=400,
                content={"success": False, "data": None, "error": "Invalid generator type"}
            )

        zeros = bits.count("0")
        ones = bits.count("1")
        entropy = entropy_test(bits)

        return {
            "success": True,
            "data": {
                "generator": generator,
                "sample_size": sample_size,
                "zeros": zeros,
                "ones": ones,
                "entropy": entropy
            },
            "error": None
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "data": None, "error": str(e)}
        )


@router.post("/run-experiment-db")
def run_experiment_db(
    request: Request,
    data: ExperimentRequest,
    db: Session = Depends(get_db)
):
    try:
        result = run_experiment(data.generator, data.sample_size)

        # Build an absolute plot URL from the actual incoming request host.
        # This works correctly on Render, locally, and everywhere — no env var needed.
        relative_path = result.get("distribution_plot", "")
        if relative_path and not relative_path.startswith("http"):
            base = str(request.base_url).rstrip("/")
            result["distribution_plot"] = f"{base}/{relative_path.lstrip('/')}"

        experiment = RandomExperiment(
            generator=data.generator,
            sample_size=data.sample_size,
            zeros=result["zeros"],
            ones=result["ones"],
            entropy=result["entropy"]
        )

        db.add(experiment)
        db.commit()
        db.refresh(experiment)

        return {
            "success": True,
            "data": result,
            "error": None
        }
    except Exception as e:
        db.rollback()
        return JSONResponse(
            status_code=500,
            content={"success": False, "data": None, "error": str(e)}
        )

@router.get("/experiments")
def get_experiments(db: Session = Depends(get_db)):
    try:
        experiments = db.query(RandomExperiment).all()
        return {
            "success": True,
            "data": experiments,
            "error": None
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "data": None, "error": str(e)}
        )

@router.get("/experiment/{experiment_id}")
def get_experiment(experiment_id: int, db: Session = Depends(get_db)):
    try:
        experiment = db.query(RandomExperiment).filter(
            RandomExperiment.id == experiment_id
        ).first()

        if not experiment:
            return JSONResponse(
                status_code=404,
                content={"success": False, "data": None, "error": "Experiment not found"}
            )

        return {
            "success": True,
            "data": experiment,
            "error": None
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "data": None, "error": str(e)}
        )