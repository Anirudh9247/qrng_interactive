from numpy import ones, zeros
import matplotlib.pyplot as plt
from app.utils.randomness_tests import frequency_test, entropy_test
from app.services.quantum_service import generate_qubits
from app.services.classical_rng_service import generate_classical_bits
from app.utils.visualization import plot_entropy_progress
from app.utils.visualization import plot_bit_distribution
def run_randomness_analysis(bits):

    frequency = frequency_test(bits)
    entropy = entropy_test(bits)

    return {
        "frequency_test": frequency,
        "entropy_test": entropy
    }
def plot_bit_distribution(zeros, ones):
    labels = ["0s", "1s"]
    values = [zeros, ones]

    plt.bar(labels, values)
    plt.title("Bit Distribution")
    plt.ylabel("Count")
    plt.show()

def run_experiment(generator, sample_size):

    if generator == "quantum":
        bits = generate_qubits(sample_size)
    else:
        bits = generate_classical_bits(sample_size)

    zeros = bits.count("0")
    ones = bits.count("1")

    ent = entropy_test(bits)

    return {
        "generator": generator,
        "sample_size": sample_size,
        "zeros": zeros,
        "ones": ones,
        "entropy":ent["entropy"]   }

