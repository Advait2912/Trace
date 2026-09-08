"""
Unit test suite for TRACE: Linear Recurrent Memory Core
Testing 10/10 requirements per IMPLEMENTATION_PLAN_FIXED.md §2
"""

import numpy as np
import pytest
from core.linear_memory import LinearMemory, build_codebook


def test_01_initial_zero_state():
    """Test 1: S_0 is strictly initialized to zero matrix of shape (d, d)."""
    d = 4
    mem = LinearMemory(d=d)
    assert mem.state.shape == (d, d)
    assert np.all(mem.state == 0.0)


def test_02_single_write_exact_recovery():
    """Test 2: Single write with any non-zero key retrieves exact value on readout."""
    d = 3
    mem = LinearMemory(d=d)
    key = np.array([0.6, 0.8, 0.0])
    val = 7.5

    mem.write(key, val)
    pred = mem.read_scalar(key)
    assert np.isclose(pred, val, atol=1e-9)


def test_03_orthonormal_codebook_zero_interference():
    """Test 3: Orthonormal writes (red=1, blue=2, green=3) have zero cross-key leakage."""
    d = 3
    mem = LinearMemory(d=d)
    codebook = build_codebook(["red", "blue", "green"], d=3, seed=42)

    k_red = np.array(codebook["red"])
    k_blue = np.array(codebook["blue"])
    k_green = np.array(codebook["green"])

    # Orthogonality checks
    assert np.isclose(np.dot(k_red, k_blue), 0.0, atol=1e-9)
    assert np.isclose(np.dot(k_red, k_green), 0.0, atol=1e-9)
    assert np.isclose(np.dot(k_blue, k_green), 0.0, atol=1e-9)

    mem.write(k_red, 1.0, label="red")
    mem.write(k_blue, 2.0, label="blue")
    mem.write(k_green, 3.0, label="green")

    # Readout for each must be exact ground truth
    assert np.isclose(mem.read_scalar(k_red), 1.0, atol=1e-9)
    assert np.isclose(mem.read_scalar(k_blue), 2.0, atol=1e-9)
    assert np.isclose(mem.read_scalar(k_green), 3.0, atol=1e-9)


def test_04_overlapping_keys_exact_derived_leak():
    """Test 4: Non-orthogonal keys produce exact mathematical blend matching leak coefficient."""
    d = 2
    mem = LinearMemory(d=d)

    # key_A and key_B with known overlap
    k_a = np.array([1.0, 0.0])
    # k_b has projection 0.5 onto k_a
    k_b = np.array([0.5, np.sqrt(0.75)])

    leak_expected = LinearMemory.interference_score(k_a, k_b)
    assert np.isclose(leak_expected, 0.5, atol=1e-9)

    mem.write(k_a, 1.0, label="key_A")
    mem.write(k_b, 9.0, label="key_B")

    # Readout for k_a must be 1.0 + leak * 9.0 = 1.0 + 0.5 * 9.0 = 5.5
    pred_a = mem.read_scalar(k_a)
    expected_pred_a = 1.0 + leak_expected * 9.0
    assert np.isclose(pred_a, expected_pred_a, atol=1e-9)


def test_05_capacity_dimension_controls_orthogonality():
    """Test 5: Controlled experiment where higher d allows constructing orthonormal codebook."""
    symbols = ["s1", "s2", "s3", "s4"]

    # When d=4 >= 4 symbols, QR produces strictly orthonormal keys
    cb_d4 = build_codebook(symbols, d=4, seed=123)
    keys_d4 = [np.array(cb_d4[s]) for s in symbols]
    for i in range(len(symbols)):
        for j in range(i + 1, len(symbols)):
            assert np.isclose(np.dot(keys_d4[i], keys_d4[j]), 0.0, atol=1e-9)

    # When d=2 < 4 symbols, exact orthogonality is mathematically impossible
    cb_d2 = build_codebook(symbols, d=2, seed=123)
    keys_d2 = [np.array(cb_d2[s]) for s in symbols]
    has_overlap = any(
        not np.isclose(np.dot(keys_d2[i], keys_d2[j]), 0.0, atol=1e-2)
        for i in range(len(symbols))
        for j in range(i + 1, len(symbols))
    )
    assert has_overlap


def test_06_additive_commutativity_for_orthogonal_writes():
    """Test 6: Order of writing orthogonal demonstrations does not change final state matrix."""
    d = 3
    cb = build_codebook(["a", "b", "c"], d=3, seed=10)
    ka, kb, kc = np.array(cb["a"]), np.array(cb["b"]), np.array(cb["c"])

    mem1 = LinearMemory(d=3)
    mem1.write(ka, 1.0)
    mem1.write(kb, 2.0)
    mem1.write(kc, 3.0)

    mem2 = LinearMemory(d=3)
    mem2.write(kc, 3.0)
    mem2.write(ka, 1.0)
    mem2.write(kb, 2.0)

    assert np.allclose(mem1.state, mem2.state, atol=1e-9)


def test_07_exact_recovery_for_arbitrary_key_magnitudes():
    """Test 7: Readout formula (S k_q) / (k_q . k_q) recovers exact value for any key magnitude."""
    d = 3
    mem = LinearMemory(d=d)
    
    # Test with different key norms (small, unit, large)
    k_small = np.array([0.1, 0.2, 0.0])
    k_large = np.array([5.0, 10.0, 0.0])
    
    mem.write(k_small, 4.2)
    assert np.isclose(mem.read_scalar(k_small), 4.2, atol=1e-9)
    
    mem.reset()
    mem.write(k_large, 9.8)
    assert np.isclose(mem.read_scalar(k_large), 9.8, atol=1e-9)


def test_08_reset_clears_state_and_history():
    """Test 8: reset() returns state to zeros and empties history."""
    d = 2
    mem = LinearMemory(d=d)
    mem.write(np.array([1.0, 0.0]), 5.0)
    assert len(mem.write_history) == 1
    assert np.any(mem.state != 0.0)

    mem.reset()
    assert len(mem.write_history) == 0
    assert np.all(mem.state == 0.0)


def test_09_vector_value_support():
    """Test 9: Core supports full vector values v in R^d alongside scalar decoding."""
    d = 3
    mem = LinearMemory(d=d)
    k1 = np.array([1.0, 0.0, 0.0])
    v1 = np.array([2.0, 4.0, 6.0])

    mem.write(k1, v1)
    read_vec = mem.read(k1)
    assert np.allclose(read_vec, v1, atol=1e-9)


def test_10_interference_formula_consistency():
    """Test 10: Analytical formula for interference_score is symmetric in dot product."""
    ka = np.array([0.8, 0.6])
    kb = np.array([0.0, 1.0])
    # (ka . kb) / (ka . ka) = 0.6 / 1.0 = 0.6
    score_ab = LinearMemory.interference_score(ka, kb)
    assert np.isclose(score_ab, 0.6, atol=1e-9)
