from fastapi import APIRouter
from app.schema.analysis_schema import AnalysisRequest

from app.services.quantum_service import generate_qubits

from app.utils.randomness_tests import (
    frequency_test,
    entropy_test,
)

router = APIRouter()

@router.post("/analyze-randomness")
def analyze_randomness(data: AnalysisRequest):

    bits = generate_qubits(data.num_qubits)

    frequency = frequency_test(bits)
    entropy = entropy_test(bits)

    return {
        "generated_bits": bits,
        "frequency_test": frequency,
        "entropy_test": entropy
    }