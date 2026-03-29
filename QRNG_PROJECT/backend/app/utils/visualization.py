import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt
import io
import base64


def _fig_to_base64() -> str:
    """Render the current matplotlib figure to a base64-encoded PNG string."""
    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight")
    plt.close()
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")


def save_entropy_comparison_plot(quantum_entropy: float, classical_entropy: float) -> str:
    labels = ["Quantum RNG", "Classical RNG"]
    values = [quantum_entropy, classical_entropy]

    fig, ax = plt.subplots(facecolor="#0f172a")
    ax.set_facecolor("#1e293b")
    bars = ax.bar(labels, values, color=["#06b6d4", "#3b82f6"], width=0.4)

    ax.set_title("Entropy Comparison", color="white", fontsize=14, pad=12)
    ax.set_ylabel("Entropy", color="#94a3b8")
    ax.tick_params(colors="#94a3b8")
    ax.spines[:].set_color("#334155")
    ax.grid(axis="y", linestyle="--", alpha=0.3, color="#475569")
    for bar, val in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.01,
                f"{val:.4f}", ha="center", va="bottom", color="white", fontsize=10)

    return _fig_to_base64()


def save_bit_distribution_plot(zeros: int, ones: int) -> str:
    labels = ["0 (Zeros)", "1 (Ones)"]
    values = [zeros, ones]

    fig, ax = plt.subplots(facecolor="#0f172a")
    ax.set_facecolor("#1e293b")
    bars = ax.bar(labels, values, color=["#06b6d4", "#8b5cf6"], width=0.4)

    ax.set_title("Bit Distribution", color="white", fontsize=14, pad=12)
    ax.set_xlabel("Bit Value", color="#94a3b8")
    ax.set_ylabel("Count", color="#94a3b8")
    ax.tick_params(colors="#94a3b8")
    ax.spines[:].set_color("#334155")
    ax.grid(axis="y", linestyle="--", alpha=0.3, color="#475569")
    for bar, val in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.3,
                str(val), ha="center", va="bottom", color="white", fontsize=11, fontweight="bold")

    return _fig_to_base64()


def plot_entropy_progress(sample_sizes, entropy_values) -> str:
    fig, ax = plt.subplots(facecolor="#0f172a")
    ax.set_facecolor("#1e293b")
    ax.plot(sample_sizes, entropy_values, marker="o", color="#06b6d4",
            linewidth=2, markerfacecolor="#8b5cf6", markersize=6)

    ax.set_title("Entropy vs Sample Size", color="white", fontsize=14, pad=12)
    ax.set_xlabel("Number of Qubits", color="#94a3b8")
    ax.set_ylabel("Entropy", color="#94a3b8")
    ax.tick_params(colors="#94a3b8")
    ax.spines[:].set_color("#334155")
    ax.grid(True, linestyle="--", alpha=0.3, color="#475569")

    return _fig_to_base64()