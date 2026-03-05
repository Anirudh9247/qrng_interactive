from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
# Maximum safe qubits per circuit
MAX_QUBITS = 24

simulator = AerSimulator()
def _generate_batch(size: int) -> str:
    """
    Generate a batch of quantum random bits.
    Uses Hadamard superposition + measurement.
    """
    qc = QuantumCircuit(size, size)
    # Put all qubits into superposition
    qc.h(range(size))
    # Measure all qubits
    qc.measure(range(size), range(size))
    compiled = transpile(qc, simulator)
    job = simulator.run(compiled, shots=1)
    result = job.result()
    counts = result.get_counts()
    bitstring = list(counts.keys())[0]
    return bitstring
def generate_qubits(n_bits: int) -> str:
    """
    Generate n_bits of quantum random bits safely
    by batching circuits to avoid backend qubit limits.
    """
    if n_bits <= 0:
        raise ValueError("Number of bits must be positive")
    result_bits = ""
    remaining = n_bits
    while remaining > 0:
        batch_size = min(MAX_QUBITS, remaining)
        bits = _generate_batch(batch_size)
        result_bits += bits
        remaining -= batch_size
    return result_bits