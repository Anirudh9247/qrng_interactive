from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

# Step 1: Create a quantum circuit with 1 qubit and 1 classical bit
qc = QuantumCircuit(1, 1)

# Step 2: Apply Hadamard gate to create superposition
qc.h(0)

# Step 3: Measure the qubit
qc.measure(0, 0)

# Step 4: Use quantum simulator
simulator = AerSimulator()

# Step 5: Run the circuit once (1 shot)
result = simulator.run(qc, shots=1).result()

# Step 6: Get and print the result
counts = result.get_counts()
print("Quantum Random Output:", counts)
