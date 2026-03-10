from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

MAX_QUBITS = 24

simulator = AerSimulator()


def _generate_batch(size: int):

    qc = QuantumCircuit(size, size)

    qc.h(range(size))

    qc.measure(range(size), range(size))

    compiled = transpile(qc, simulator)

    job = simulator.run(compiled, shots=1)

    result = job.result()

    counts = result.get_counts()

    bitstring = list(counts.keys())[0]

    return bitstring


def generate_qubits(sample_size: int):

    bits = ""

    while len(bits) < sample_size:

        batch_size = min(MAX_QUBITS, sample_size - len(bits))

        batch_bits = _generate_batch(batch_size)

        bits += batch_bits

    return bits