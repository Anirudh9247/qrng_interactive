from app.utils.randomness_tests import frequency_test, entropy_test
from app.services.quantum_service import generate_qubits
from app.services.classical_rng_service import generate_classical_bits
from app.utils.randomness_tests import frequency_test, entropy_test

def run_randomness_analysis(bits):

    frequency = frequency_test(bits)
    entropy = entropy_test(bits)

    return {
        "frequency_test": frequency,
        "entropy_test": entropy
    }
def run_experiment(generator, sample_size):

    if generator == "quantum":
        bits = generate_qubits(sample_size)
    else:
        bits = generate_classical_bits(sample_size)

    freq = frequency_test(bits)
    ent = entropy_test(bits)

    zeros = freq["zeros"]
    ones = freq["ones"]

    return {
        "generator": generator,
        "sample_size": sample_size,
        "zeros": zeros,
        "ones": ones,
        "entropy": ent["entropy"]
    }