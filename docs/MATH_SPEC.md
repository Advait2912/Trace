# TRACE: Mathematical Specification & Derivations

## 1. Executive Summary & Non-Claim

This document establishes the mathematical foundation of **TRACE (Memory in Motion)**. 

> **Explicit Non-Claim:**
> This educational model instantiates only the additive special case that BDH-CQ's own paper names as the linear-attention view of its general update rule ($S_t = S_{t-1} + U_\theta(D_t)$ with $U_\theta(D_t) = v_t k_t^T$). It does not reconstruct $U_\theta$, whose form is proprietary and undisclosed. It must never be described as reproducing BDH or BDH-CQ.

---

## 2. Core State & Dynamics

### State Representation
The recurrent memory state is a fixed-size square matrix:
$$S \in \mathbb{R}^{d \times d}, \quad S_0 = \mathbf{0}_{d \times d}$$
Memory footprint remains strictly $d^2$ floating-point scalars, invariant to sequence length $T$.

### Update Rule (Fast Weight Outer-Product)
When demonstration $t$ arrives with key vector $k_t \in \mathbb{R}^d$ and value vector $v_t \in \mathbb{R}^d$:
$$S_t = S_{t-1} + v_t k_t^T$$
where $v_t k_t^T \in \mathbb{R}^{d \times d}$ is the rank-1 outer product:
$$(v_t k_t^T)_{i, j} = v_{t, i} k_{t, j}$$

After $T$ demonstrations:
$$S_T = \sum_{t=1}^T v_t k_t^T$$

### Readout Rule (Normalized Projection)
To query the memory with query key $k_q \in \mathbb{R}^d$:
$$\hat{y} = \frac{S_T k_q}{k_q \cdot k_q}$$

---

## 3. Mathematical Derivation of Interference & Leakage

Substituting $S_T = \sum_{i=1}^T v_i k_i^T$ into the readout equation:
$$S_T k_q = \left(\sum_{i=1}^T v_i k_i^T\right) k_q = \sum_{i=1}^T v_i (k_i^T k_q) = \sum_{i=1}^T (k_i \cdot k_q) v_i$$

Dividing by the quadratic normalizer $k_q \cdot k_q$:
$$\hat{y} = \sum_{i=1}^T \left(\frac{k_i \cdot k_q}{k_q \cdot k_q}\right) v_i$$

### Case A: Querying a Specific Target Demonstration $k_a$
Setting $k_q = k_a$:
$$\hat{y}_a = \frac{k_a \cdot k_a}{k_a \cdot k_a} v_a + \sum_{b \neq a} \left(\frac{k_b \cdot k_a}{k_a \cdot k_a}\right) v_b = v_a + \sum_{b \neq a} \text{Leak}(k_a, k_b) v_b$$

where the **pairwise interference coefficient** is:
$$\text{Leak}(k_a, k_b) = \frac{k_a \cdot k_b}{k_a \cdot k_a}$$

### Case B: Orthonormal Codebook ($k_i \cdot k_j = \delta_{ij}$)
When keys are mutually orthogonal:
$$k_b \cdot k_a = 0 \quad (\forall b \neq a) \implies \text{Leak}(k_a, k_b) = 0$$
$$\hat{y}_a = v_a \quad \text{(Exact, lossless retrieval)}$$

### Case C: Non-Orthogonal Superposition (Two Overlapping Demonstrations)
Suppose two demonstrations $(k_A, v_A)$ and $(k_B, v_B)$ are absorbed into $S_2$:
$$\hat{y}_A = v_A + \left(\frac{k_A \cdot k_B}{k_A \cdot k_A}\right) v_B$$
The readout for key $A$ contains a fractional superposition of value $B$. This leakage is derived directly from linear projection onto a non-orthogonal basis.

---

## 4. Capacity vs. Dimension ($d$)

### Why $d$ Controls Interference:
1. **Low-symbol regime ($num\_symbols \le d$):**
   In $\mathbb{R}^d$, a maximum of $d$ linearly independent mutually orthogonal vectors can exist. In our controlled experiment, when $num\_symbols \le d$, we construct an **orthonormal** key codebook via QR decomposition:
   $$Q, R = \text{qr}(X), \quad X \sim \mathcal{N}(0, I_d) \implies Q^T Q = I_d$$
   Zero cross-key interference is achieved **by construction**.

2. **High-symbol regime ($num\_symbols > d$):**
   By the fundamental theorem of linear algebra, any set of $m > d$ vectors in $\mathbb{R}^d$ is linearly dependent. It is geometrically impossible for all vectors to be mutually orthogonal:
   $$\exists i \neq j \quad \text{such that} \quad k_i \cdot k_j \neq 0$$
   Therefore, interference is **mathematically forced**, not an engineered bug.

---

## 5. Scalar Value Encoding & Decoding

In the benchmark task (colors $\to$ numbers, e.g. `red → 1.0`):
- A canonical unit carrier vector $u \in \mathbb{R}^d$ is chosen:
  $$u = \frac{1}{\sqrt{d}} [1, 1, \dots, 1]^T, \quad \|u\|_2 = 1.0$$
- Value encoding:
  $$v_t = c_t \cdot u \in \mathbb{R}^d$$
- Scalar decoding:
  $$\hat{c} = u^T \hat{y} \in \mathbb{R}$$
All state grid cells in $S$ remain populated and active.
