from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schema.analysis_schema import RandomnessRequest
from app.schema.experiment_schema import ExperimentRequest

from app.services.quantum_service import generate_qubits
from app.services.classical_rng_service import generate_classical_bits
from app.services.analysis_service import run_experiment

from app.db.session import get_db
from app.model.random_experiment import RandomExperiment

from fastapi import HTTPException
from app.utils.randomness_tests import (
    frequency_test,
    entropy_test,
)

router = APIRouter()


@router.post("/analyze-randomness")
async def analyze_randomness(data: RandomnessRequest):

    if data.sample_size > 1_000_000:
        raise HTTPException(
            status_code=400,
            detail="Sample size too large. Max allowed = 1,000,000"
        )

    bits = generate_qubits(data.sample_size)

    frequency = frequency_test(bits)
    entropy = entropy_test(bits)

    return {
        "generated_bits": bits,
        "frequency_test": frequency,
        "entropy_test": entropy
    }


@router.post("/run-experiment")
def run_experiment(generator: str, sample_size: int):

    if generator == "quantum":
        bits = generate_qubits(sample_size)

    elif generator == "classical":
        bits = generate_classical_bits(sample_size)

    else:
        raise ValueError("Invalid generator type")

    zeros = bits.count("0")
    ones = bits.count("1")

    entropy = entropy_test(bits)

    return {
        "generator": generator,
        "sample_size": sample_size,
        "zeros": zeros,
        "ones": ones,
        "entropy": entropy
    }


@router.post("/run-experiment-db")
def run_experiment_db(
    data: ExperimentRequest,
    db: Session = Depends(get_db)
):

    result = run_experiment(data.generator, data.sample_size)

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

    return result

@router.get("/experiments")
def get_experiments(db: Session = Depends(get_db)):

    experiments = db.query(RandomExperiment).all()

    return experiments

@router.get("/experiment/{experiment_id}")
def get_experiment(experiment_id: int, db: Session = Depends(get_db)):

    experiment = db.query(RandomExperiment).filter(
        RandomExperiment.id == experiment_id
    ).first()

    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")

    return experiment