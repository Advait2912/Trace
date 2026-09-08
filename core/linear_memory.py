"""
TRACE: Linear Recurrent Memory Core Module
==========================================

Primary Source:
BDH-CQ (Engdahl, Kosowski, Chorowski, Stamirowska et al., 2026, arXiv:2608.09888), §3.2,
which defines the general update S_t = U_θ(S_{t-1}, D_t) and notes its additive special case
S_t = S_{t-1} + U_θ(D_t).

EXPLICIT NON-CLAIM:
This toy model instantiates only the additive special case that BDH-CQ's own paper names
as the linear-attention view of its general update rule (with U_θ(D_t) = v_t k_t^T).
It does not reconstruct U_θ, whose form is proprietary and undisclosed.
It must never be described as reproducing BDH or BDH-CQ.
"""

from typing import Dict, List, Optional, Tuple, Union
import numpy as np


class LinearMemory:
    """
    Fixed-capacity linear associative memory:
        State:    S ∈ R^(d × d), S_0 = 0
        Update:   S_t = S_{t-1} + v_t k_t^T
        Readout:  ŷ = (S_t · k_query) / (k_query · k_query)
        Leak:     Interference(k_a, k_b) = (k_a · k_b) / (k_a · k_a)
    """

    def __init__(self, d: int, carrier: Optional[np.ndarray] = None):
        if d < 1:
            raise ValueError(f"Dimension d must be >= 1, got {d}")
        self.d = d
        self.state = np.zeros((d, d), dtype=np.float64)
        self.write_history: List[Dict[str, Union[str, float, List[float]]]] = []

        # Canonical unit carrier for scalar value encoding/decoding
        if carrier is None:
            c = np.ones(d, dtype=np.float64)
            self.carrier = c / np.linalg.norm(c)
        else:
            c = np.asarray(carrier, dtype=np.float64).flatten()
            if len(c) != d:
                raise ValueError(f"Carrier dimension {len(c)} must match d={d}")
            self.carrier = c / np.linalg.norm(c)

    def reset(self) -> None:
        """Resets the recurrent state to zero and clears write history."""
        self.state = np.zeros((self.d, self.d), dtype=np.float64)
        self.write_history = []

    def encode_scalar_value(self, val: float) -> np.ndarray:
        """Maps a scalar value into R^d along the carrier direction."""
        return float(val) * self.carrier

    def decode_scalar_value(self, vec: np.ndarray) -> float:
        """Projects a vector in R^d onto the carrier direction to recover scalar."""
        return float(np.dot(vec, self.carrier))

    def write(
        self,
        key: np.ndarray,
        value: Union[float, np.ndarray],
        label: Optional[str] = None,
    ) -> np.ndarray:
        """
        Updates recurrent state: S_t = S_{t-1} + v_t k_t^T
        Returns the updated state matrix.
        """
        k = np.asarray(key, dtype=np.float64).flatten()
        if len(k) != self.d:
            raise ValueError(f"Key dimension {len(k)} does not match state dimension {self.d}")

        if np.isscalar(value) or (isinstance(value, np.ndarray) and value.ndim == 0):
            v = self.encode_scalar_value(float(value))
            scalar_val = float(value)
        else:
            v = np.asarray(value, dtype=np.float64).flatten()
            if len(v) != self.d:
                raise ValueError(f"Value dimension {len(v)} does not match state dimension {self.d}")
            scalar_val = self.decode_scalar_value(v)

        # Outer product update: v k^T ∈ R^(d × d)
        delta_s = np.outer(v, k)
        self.state += delta_s

        self.write_history.append({
            "label": label or f"step_{len(self.write_history)}",
            "scalar_value": scalar_val,
            "key": k.tolist(),
            "state_snapshot": self.state.copy().tolist(),
        })

        return self.state.copy()

    def read(self, k_query: np.ndarray) -> np.ndarray:
        """
        Readout vector: ŷ = (S_t · k_query) / (k_query · k_query)
        """
        kq = np.asarray(k_query, dtype=np.float64).flatten()
        if len(kq) != self.d:
            raise ValueError(f"Query key dimension {len(kq)} does not match state dimension {self.d}")

        denom = float(np.dot(kq, kq))
        if denom == 0.0:
            raise ZeroDivisionError("Query key norm is zero.")

        numer = self.state @ kq
        return numer / denom

    def read_scalar(self, k_query: np.ndarray) -> float:
        """Reads out the vector and projects onto the scalar carrier."""
        vec = self.read(k_query)
        return self.decode_scalar_value(vec)

    @staticmethod
    def interference_score(key_target: np.ndarray, key_interferer: np.ndarray) -> float:
        """
        Calculates theoretical leakage coefficient:
            Interference(k_target, k_interferer) = (k_target · k_interferer) / (k_target · k_target)
        """
        ka = np.asarray(key_target, dtype=np.float64).flatten()
        kb = np.asarray(key_interferer, dtype=np.float64).flatten()
        denom = float(np.dot(ka, ka))
        if denom == 0.0:
            raise ZeroDivisionError("Target key norm is zero.")
        return float(np.dot(ka, kb) / denom)


def build_codebook(
    symbols: List[str],
    d: int,
    seed: int = 42,
) -> Dict[str, List[float]]:
    """
    Constructs a codebook mapping symbols to unit key vectors in R^d:
    - If len(symbols) <= d: constructs an orthonormal codebook via QR decomposition.
      Zero cross-key interference by construction.
    - If len(symbols) > d: constructs random unit vectors on S^(d-1).
      Vectors are forced to overlap because exact orthogonality is impossible in R^d.
    """
    num_symbols = len(symbols)
    rng = np.random.default_rng(seed)

    if num_symbols <= d:
        # Construct orthonormal keys via QR decomposition
        gaussian_matrix = rng.standard_normal((d, d))
        q, _ = np.linalg.qr(gaussian_matrix)
        # Each column of Q is an orthonormal unit vector in R^d
        codebook = {symbols[i]: q[:, i].tolist() for i in range(num_symbols)}
    else:
        # Over-capacity: random vectors on S^(d-1)
        raw_vectors = rng.standard_normal((num_symbols, d))
        norms = np.linalg.norm(raw_vectors, axis=1, keepdims=True)
        unit_vectors = raw_vectors / norms
        codebook = {symbols[i]: unit_vectors[i].tolist() for i in range(num_symbols)}

    return codebook
