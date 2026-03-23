import random

random.seed(42)

def generate_classical_bits(n: int = 10):
    return [random.randint(0,1) for _ in range(n)]