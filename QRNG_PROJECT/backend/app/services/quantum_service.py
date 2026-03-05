from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
from qiskit import transpile
def generate_qubits(n: int = 10):
    """
    Generate n quantum random bits using Hadamard gate.
    """
    qc = QuantumCircuit(n, n)
    # Put qubits into superposition
    for i in range(n):
        qc.h(i)
    # Measure qubits
    qc.measure(range(n), range(n))
    simulator = AerSimulator()
    compiled_circuit = transpile(qc, simulator)
    result = simulator.run(compiled_circuit, shots=1).result()
    counts = result.get_counts()
    bitstring = list(counts.keys())[0]
    # Convert string -> list of ints
    bits = [int(bit) for bit in bitstring]
    return bits