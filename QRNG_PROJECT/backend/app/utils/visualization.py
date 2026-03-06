import matplotlib.pyplot as plt

def plot_bit_distribution(bits):

    zeros = bits.count('0')
    ones = bits.count('1')

    labels = ['0', '1']
    values = [zeros, ones]

    plt.bar(labels, values)

    plt.title("Quantum Bit Distribution")
    plt.xlabel("Bit Value")
    plt.ylabel("Count")

    plt.show()
def plot_entropy_progress(sample_sizes, entropy_values):

    plt.plot(sample_sizes, entropy_values, marker='o')

    plt.title("Entropy vs Sample Size")
    plt.xlabel("Number of Qubits")
    plt.ylabel("Entropy")

    plt.show()