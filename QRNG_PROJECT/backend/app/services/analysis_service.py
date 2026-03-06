from app.utils.randomness_tests import frequency_test, entropy_test

def run_randomness_analysis(bits):

    frequency = frequency_test(bits)
    entropy = entropy_test(bits)

    return {
        "frequency_test": frequency,
        "entropy_test": entropy
    }