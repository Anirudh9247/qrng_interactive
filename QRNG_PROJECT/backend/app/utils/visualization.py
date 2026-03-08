import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt
import os
import time

# Directory configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PLOT_DIR = os.path.join(BASE_DIR, "static", "plots")

os.makedirs(PLOT_DIR, exist_ok=True)


# Entropy comparison plot
def save_entropy_comparison_plot(quantum_entropy, classical_entropy):

    labels = ["Quantum RNG", "Classical RNG"]
    values = [quantum_entropy, classical_entropy]

    plt.figure()
    plt.bar(labels, values)

    plt.title("Entropy Comparison")
    plt.ylabel("Entropy")
    plt.grid(axis="y", linestyle="--", alpha=0.6)

    plot_path = os.path.join(PLOT_DIR, "entropy_comparison.png")

    plt.savefig(plot_path)
    plt.close()

    return plot_path

# Bit distribution plot
def save_bit_distribution_plot(zeros, ones):

    labels = ["0", "1"]
    values = [zeros, ones]

    plt.figure()
    plt.bar(labels, values)

    plt.title("Bit Distribution")
    plt.xlabel("Bit Value")
    plt.ylabel("Count")
    plt.grid(axis="y", linestyle="--", alpha=0.6)

    filename = f"distribution_{int(time.time())}.png"
    plot_path = os.path.join(PLOT_DIR, filename)

    plt.savefig(plot_path)
    plt.close()

    return plot_path

# Entropy progress plot
def plot_entropy_progress(sample_sizes, entropy_values):

    plt.figure()
    plt.plot(sample_sizes, entropy_values, marker="o")

    plt.title("Entropy vs Sample Size")
    plt.xlabel("Number of Qubits")
    plt.ylabel("Entropy")
    plt.grid(True, linestyle="--", alpha=0.6)

    filename = f"entropy_progress_{int(time.time())}.png"
    plot_path = os.path.join(PLOT_DIR, filename)

    plt.savefig(plot_path)
    plt.close()

    return plot_path