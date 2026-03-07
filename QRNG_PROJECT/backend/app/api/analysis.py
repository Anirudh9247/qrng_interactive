from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schema.analysis_schema import AnalysisRequest
from app.schema.experiment_schema import ExperimentRequest

from app.services.quantum_service import generate_qubits
from app.services.analysis_service import run_experiment

from app.db.session import get_db
from app.model.random_experiment import RandomExperiment

from app.utils.randomness_tests import (
    frequency_test,
    entropy_test,
)

router = APIRouter()


@router.post("/analyze-randomness")
def analyze_randomness(data: AnalysisRequest):

    bits = generate_qubits(data.sample_size)

    frequency = frequency_test(bits)
    entropy = entropy_test(bits)

    return {
        "generated_bits": bits,
        "frequency_test": frequency,
        "entropy_test": entropy
    }


@router.post("/run-experiment")
def run_randomness_experiment(
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