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