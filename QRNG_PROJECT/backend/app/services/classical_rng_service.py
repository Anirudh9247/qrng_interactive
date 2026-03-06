import random

def generate_classical_bits(n: int = 10):

    bits = []

    for _ in range(n):
        bits.append(random.randint(0,1))

    return bits