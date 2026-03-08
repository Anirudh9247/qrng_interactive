import math
def frequency_test(bits):
    """
    Simple frequency (monobit) test.
    Checks if number of 0s and 1s are roughly equal.
    """
    # Convert string bits → integers
    ones = sum(int(b) for b in bits)
    zeros = len(bits) - ones
    print("Total bits:", len(bits))
    print("Ones:", ones)
    print("Zeros:", zeros)
    ratio = ones / len(bits)
    print("One ratio:", ratio)
    if 0.45 < ratio < 0.55:
        print("Randomness Test: PASS")
    else:
        print("Randomness Test: FAIL")
    return {
        "ones": ones,
        "zeros": zeros,
        "ratio": ratio
    }
def entropy_test(bits):
    """
    Calculate Shannon entropy of the bit sequence
    """
    bits = [int(b) for b in bits]
    total = len(bits)
    ones = sum(bits)
    zeros = total - ones
    p0 = zeros / total
    p1 = ones / total
    entropy = 0
    if p0 > 0:
        entropy -= p0 * math.log2(p0)
    if p1 > 0:
        entropy -= p1 * math.log2(p1)
    return {
        "entropy": entropy
    }
def chi_square_test(bits):

    zeros = bits.count("0")
    ones = bits.count("1")

    total = zeros + ones
    expected = total / 2

    chi_square = ((zeros - expected) ** 2 / expected) + ((ones - expected) ** 2 / expected)

    return {
        "zeros": zeros,
        "ones": ones,
        "chi_square": chi_square
    }