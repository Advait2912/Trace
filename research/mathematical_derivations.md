# Mathematical Foundations & Analytical Derivations

**Project:** TRACE: Memory in Motion &mdash; In-Context Learning with Recurrent Memory  
**Computational Substrate:** Frozen linear recurrent associative memory in $\mathbb{R}^{d \times d}$.

---

## 1. Recurrent State Formulation

Let the recurrent memory state at step $t \in \{0, 1, \dots, T\}$ be denoted by $S_t \in \mathbb{R}^{d \times d}$.

### Base State (Initialization)
$$S_0 = \mathbf{0}_{d \times d}$$
The physical state footprint contains exactly $d^2$ floating-point scalars and remains invariant regardless of the sequence length $T$.

### State Update (Rank-1 Associative Write)
Given a demonstration $D_t = (k_t, v_t)$ where:
- Key vector $k_t \in \mathbb{R}^d$ ($k_t \neq \mathbf{0}$)
- Value vector $v_t \in \mathbb{R}^d$

The recurrent state update is defined as:
$$S_t = S_{t-1} + v_t k_t^T$$

By unrolling the recurrence over $t$ demonstrations:
$$S_t = \sum_{\tau=1}^t v_\tau k_\tau^T$$

---

## 2. Normalized Readout Derivation

Given a query key $k_q \in \mathbb{R}^d \setminus \{\mathbf{0}\}$, the readout operator computes:
$$\hat{y} = \frac{S_t k_q}{\|k_q\|_2^2} = \frac{S_t k_q}{k_q \cdot k_q}$$

Substituting the unrolled summation of $S_t$:
$$\hat{y} = \frac{\left(\sum_{\tau=1}^t v_\tau k_\tau^T\right) k_q}{k_q \cdot k_q}$$

Using the associativity of matrix-vector multiplication:
$$\left(v_\tau k_\tau^T\right) k_q = v_\tau \left(k_\tau^T k_q\right) = (k_\tau \cdot k_q) v_\tau$$

Therefore:
$$\hat{y} = \sum_{\tau=1}^t \left( \frac{k_q \cdot k_\tau}{k_q \cdot k_q} \right) v_\tau$$

---

## 3. The Interference & Cross-Key Leakage Theorem

### Theorem 1 (Exact Signal and Cross-Talk Decomposition)
Suppose demonstrations $(k_1, v_1), (k_2, v_2), \dots, (k_T, v_T)$ have been written into $S_T$.
When querying with key $k_a$ corresponding to demonstration $a \in \{1, \dots, T\}$:

$$\hat{y}_a = v_a + \sum_{b \neq a} \left( \frac{k_a \cdot k_b}{k_a \cdot k_a} \right) v_b$$

### Proof:
Expand the sum from Section 2 for $k_q = k_a$:
$$\hat{y}_a = \sum_{\tau=1}^T \left( \frac{k_a \cdot k_\tau}{k_a \cdot k_a} \right) v_\tau = \left( \frac{k_a \cdot k_a}{k_a \cdot k_a} \right) v_a + \sum_{b \neq a} \left( \frac{k_a \cdot k_b}{k_a \cdot k_a} \right) v_b$$

Since $k_a \neq \mathbf{0}$, $\frac{k_a \cdot k_a}{k_a \cdot k_a} = 1$, yielding:
$$\hat{y}_a = v_a + \sum_{b \neq a} \text{Interference}(k_a, k_b) \cdot v_b$$
where:
$$\text{Interference}(k_a, k_b) \triangleq \frac{k_a \cdot k_b}{k_a \cdot k_a} = \frac{k_a \cdot k_b}{\|k_a\|_2^2}$$
$\blacksquare$

### Corollary 1.1 (Unit-Norm Keys)
When all keys are normalized to unit Euclidean length ($\|k\|_2 = 1$):
$$\text{Interference}(k_a, k_b) = k_a \cdot k_b = \cos \theta_{a, b}$$
and:
$$\hat{y}_a = v_a + \sum_{b \neq a} (\cos \theta_{a, b}) v_b$$

---

## 4. Geometric Capacity & The Dimension Threshold

### Theorem 2 (Zero-Interference Capacity Bound)
In a linear state space $\mathbb{R}^{d \times d}$, exact, lossless associative retrieval of $N$ demonstrations ($\hat{y}_i = v_i$ for all $i \in \{1, \dots, N\}$) is guaranteed if and only if the key vectors $\{k_1, \dots, k_N\}$ are mutually orthogonal:
$$k_i \cdot k_j = 0 \quad \forall i \neq j$$

### Dimensional Consequence:
1. **Under-Capacity ($N \le d$):**
   By the Gram-Schmidt orthogonalization theorem or QR factorization, any set of $N \le d$ linearly independent vectors in $\mathbb{R}^d$ can be transformed into an orthonormal set:
   $$k_i \cdot k_j = \delta_{ij}$$
   Under this construction:
   $$\text{Interference}(k_i, k_j) = 0 \quad \forall i \neq j \implies \hat{y}_i = v_i$$
   The reconstruction error $\text{MSE} \equiv 0$ down to machine precision.

2. **Over-Capacity ($N > d$):**
   By the fundamental theorem of linear algebra, any set of $N > d$ vectors in $\mathbb{R}^d$ is linearly dependent. The maximum number of mutually orthogonal non-zero vectors in $\mathbb{R}^d$ is strictly $d$.
   Therefore, for any codebook with $N > d$, there exists at least one pair $(a, b)$ with $a \neq b$ such that:
   $$k_a \cdot k_b \neq 0$$
   Consequently, cross-key leakage is mathematically inevitable by fixed capacity, not a bug or scripted failure.

---

## 5. Scalar Carrier Encoding & Decoding

To represent scalar values $\alpha \in \mathbb{R}$ inside the vector space $\mathbb{R}^d$, TRACE uses a canonical unit carrier vector $c \in \mathbb{R}^d$ with $\|c\|_2 = 1$:

$$c = \frac{[1, 1, \dots, 1]^T}{\sqrt{d}}$$

- **Value Encoding:**
  $$v = \alpha \cdot c \in \mathbb{R}^d$$
- **Value Decoding:**
  $$\alpha = v \cdot c$$

Because $c \cdot c = \|c\|_2^2 = 1$, the recovery is exact:
$$( \alpha \cdot c ) \cdot c = \alpha ( c \cdot c ) = \alpha$$
When cross-talk occurs:
$$\hat{y}_a \cdot c = (v_a \cdot c) + \sum_{b \neq a} \left(\frac{k_a \cdot k_b}{k_a \cdot k_a}\right) (v_b \cdot c) = \alpha_a + \sum_{b \neq a} \text{Interference}(k_a, k_b) \alpha_b$$
This matches the exact numbers displayed in both the Python test suite, TypeScript twin, and interactive UI.
