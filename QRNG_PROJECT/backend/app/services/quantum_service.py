from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

MAX_QUBITS = 24

simulator = AerSimulator()


def _generate_batch(size: int) -> str:
    qc = QuantumCircuit(size, size)
    qc.h(range(size))
    qc.measure(range(size), range(size))

    compiled = transpile(qc, simulator)
    job = simulator.run(compiled, shots=1)
    result = job.result()
    counts = result.get_counts()

    bitstring = list(counts.keys())[0]

    # ✅ Fix 1: strip spaces Qiskit inserts for readability
    bitstring = bitstring.replace(" ", "")

    # ✅ Fix 2: reverse to get big-endian (qubit 0 = leftmost bit)
    bitstring = bitstring[::-1]

    return bitstring


def generate_qubits(sample_size: int) -> str:
    bits = ""

    while len(bits) < sample_size:
        batch_size = min(MAX_QUBITS, sample_size - len(bits))
        batch_bits = _generate_batch(batch_size)
        bits += batch_bits

    # ✅ Trim to exact size in case last batch overshot
    return bits[:sample_size]

import requests

def generate_real_quantum_bits(n_bits: int) -> str:
    try:
        url = f"https://qrng.anu.edu.au/API/jsonI.php?length={n_bits}&type=uint8"
        response = requests.get(url, timeout=10)
        data = response.json()["data"]

        # Convert numbers → binary bits
        bits = ''.join(format(num, '08b') for num in data)

        return bits[:n_bits]

    except Exception as e:
        print("QRNG API failed:", e)

        # fallback (IMPORTANT)
        return "0" * n_bits