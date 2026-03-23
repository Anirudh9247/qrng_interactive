# from numpy import ones, zeros
import os
import matplotlib.pyplot as plt
from dotenv import load_dotenv
from urllib.parse import urljoin

load_dotenv()
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
from app.utils.randomness_tests import frequency_test, entropy_test
from app.services.quantum_service import generate_qubits
from app.services.classical_rng_service import generate_classical_bits
from app.utils.visualization import plot_entropy_progress
from app.utils.visualization import save_bit_distribution_plot
from app.utils.visualization import save_entropy_comparison_plot
from app.utils.randomness_tests import chi_square_test
def run_randomness_analysis(bits):

    frequency = frequency_test(bits)
    entropy = entropy_test(bits)
    chi_square = chi_square_test(bits)

    return {
        "frequency_test": frequency,
        "entropy_test": entropy,
        "chi_square_test": chi_square
    }
def plot_bit_distribution(zeros, ones):
    import time
    labels = ["0s", "1s"]
    values = [zeros, ones]

    plt.figure()
    plt.bar(labels, values)
    plt.title("Bit Distribution")
    plt.ylabel("Count")
    plt.grid(axis="y", linestyle="--", alpha=0.6)

    filename = f"bit_distribution_{int(time.time())}.png"
    plot_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../utils/static/plots")
    os.makedirs(plot_dir, exist_ok=True)
    plot_path = os.path.join(plot_dir, filename)

    plt.savefig(plot_path)
    plt.close()

    return plot_path

def run_experiment(generator, sample_size):

    if generator == "quantum":
        bits = generate_qubits(sample_size)
    else:
        bits = generate_classical_bits(sample_size)

    # 🔥 FIX: normalize all to string
    bits = [str(b) for b in bits]

    zeros = bits.count("0")
    ones = bits.count("1")

    ent = entropy_test(bits)
    chi_square = chi_square_test(bits)

    plot_path = save_bit_distribution_plot(zeros, ones)
    # Normalize path separators and remove leading slashes for clean URL construction
    clean_plot_path = plot_path.replace("\\", "/").lstrip("/")
    distribution_url = urljoin(BACKEND_URL.rstrip("/") + "/", clean_plot_path)

    return {
        "generator": generator,
        "sample_size": sample_size,
        "zeros": zeros,
        "ones": ones,
        "entropy": ent["entropy"],
        "chi_square": chi_square["chi_square"],
        "distribution_plot": distribution_url
    }

def compare_rng(sample_size):

    quantum_bits = generate_qubits(sample_size)
    classical_bits = generate_classical_bits(sample_size)

    quantum_entropy = entropy_test(quantum_bits)["entropy"]
    classical_entropy = entropy_test(classical_bits)["entropy"]
    
    plot_path = save_entropy_comparison_plot(quantum_entropy, classical_entropy)
    # Normalize path separators and remove leading slashes for clean URL construction
    clean_plot_path = plot_path.replace("\\", "/").lstrip("/")
    comparison_url = urljoin(BACKEND_URL.rstrip("/") + "/", clean_plot_path)

    return {
        "quantum_entropy": quantum_entropy,
        "classical_entropy": classical_entropy,
        "comparison_plot": comparison_url
    }