import os
import time
import matplotlib.pyplot as plt
from dotenv import load_dotenv
from urllib.parse import urljoin

from app.utils.randomness_tests import frequency_test, entropy_test, chi_square_test
from app.services.quantum_service import generate_qubits
from app.services.classical_rng_service import generate_classical_bits
from app.utils.visualization import save_bit_distribution_plot, save_entropy_comparison_plot

load_dotenv()
BACKEND_URL = os.getenv("BACKEND_URL", "https://qrng-interactive.onrender.com")


def _to_bitstring(bits) -> str:
    """Normalise any bit source (string or list) to a plain '0'/'1' string."""
    if isinstance(bits, list):
        return "".join(str(b) for b in bits)
    return str(bits)


def _make_url(plot_path: str) -> str:
    """Convert a local file path to an absolute backend URL."""
    clean = plot_path.replace("\\", "/").lstrip("/")
    return urljoin(BACKEND_URL.rstrip("/") + "/", clean)


def run_randomness_analysis(bits):
    bits = _to_bitstring(bits)
    return {
        "frequency_test": frequency_test(bits),
        "entropy_test": entropy_test(bits),
        "chi_square_test": chi_square_test(bits),
    }


def run_experiment(generator: str, sample_size: int):
    raw = generate_qubits(sample_size) if generator == "quantum" \
          else generate_classical_bits(sample_size)

    bits = _to_bitstring(raw)

    zeros = bits.count("0")
    ones  = bits.count("1")
    ent   = entropy_test(bits)
    chi   = chi_square_test(bits)

    plot_path = save_bit_distribution_plot(zeros, ones)

    return {
        "generator":         generator,
        "sample_size":       sample_size,
        "zeros":             zeros,
        "ones":              ones,
        "entropy":           ent["entropy"],
        "chi_square":        chi["chi_square"],
        "distribution_plot": _make_url(plot_path),
    }


def compare_rng(sample_size: int):
    quantum_bits   = _to_bitstring(generate_qubits(sample_size))
    classical_bits = _to_bitstring(generate_classical_bits(sample_size))

    quantum_entropy   = entropy_test(quantum_bits)["entropy"]
    classical_entropy = entropy_test(classical_bits)["entropy"]

    plot_path = save_entropy_comparison_plot(quantum_entropy, classical_entropy)

    return {
        "quantum_entropy":   quantum_entropy,
        "classical_entropy": classical_entropy,
        "quantum_bits":      quantum_bits,
        "classical_bits":    classical_bits,
        "comparison_plot":   _make_url(plot_path),
    }