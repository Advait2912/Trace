# TRACE: Memory in Motion
## In-Context Learning with Recurrent Memory
**Authoritative Concept Summary & Technical Briefing | DataForge 2026 × Pathway Track (PS1)**

---

### 1. The Central Falsifiable Claim
> **A fixed-size recurrent state can absorb an unbounded sequence of key–value demonstrations without growing in memory footprint. However, when demonstrations share overlapping (non-orthogonal) keys, the readout for one leaks the value of the other — a deterministic form of forgetting caused by bounded geometric capacity, not an arbitrary failure. Increasing the state dimension $d$ expands the orthogonal basis, directly eliminating interference.**

---

### 2. Motivation: The Transformer Context Bottleneck
Standard Transformer LLMs process in-context demonstrations by appending representations to an uncompressed Key-Value (KV) cache. This creates severe design pressures:
1. **Unbounded Memory & Latency:** KV memory scales linearly $O(T)$ with sequence length, exhausting GPU SRAM/HBM limits and increasing generation cost per token.
2. **Externalized Reasoning:** Transformers cannot compress demonstrations into persistent internal state; they must emit long "Chain-of-Thought" (CoT) text tokens to perform multi-step deduction.

**The Alternative Paradigm:** Recurrent fast weights and state-space models compress demonstrations into an evolving internal state matrix of invariant size ($S \in \mathbb{R}^{d \times d}$). Memory footprint and per-step inference compute remain strictly $O(1)$ with respect to sequence length $T$.

---

### 3. The Computational Substrate
TRACE implements the canonical formulation of recurrent associative fast weights:
- **Recurrent State:** $S_t \in \mathbb{R}^{d \times d}$, initialized to $S_0 = \mathbf{0}_{d \times d}$. Footprint is strictly $d^2$ scalars, independent of demonstration count $T$.
- **Demonstration Update:** For key $k_t \in \mathbb{R}^d$ and value carrier $v_t \in \mathbb{R}^d$, the state updates via a rank-1 outer product:
  $$S_t = S_{t-1} + v_t k_t^T$$
- **Normalized Readout:** Given query key $k_q \in \mathbb{R}^d$, the scalar prediction projects $S_t$ onto $k_q$:
  $$\hat{y} = \frac{S_t k_q}{k_q \cdot k_q}$$
- **Derived Interference Theorem:** Decomposing $S_T = \sum_{i=1}^T v_i k_i^T$, querying demonstration key $k_a$ yields:
  $$\hat{y}_a = v_a + \sum_{b \neq a} \left(\frac{k_a \cdot k_b}{k_a \cdot k_a}\right) v_b$$
  When keys are mutually orthogonal ($k_a \cdot k_b = 0$), cross-talk is zero. When keys overlap ($k_a \cdot k_b \neq 0$), memory leakage is governed entirely by the cosine projection, proving that forgetting is geometric rather than stochastic.

---

### 4. Architectural Comparison

| Dimension | Standard Transformer (KV Cache) | Linear Transformers / Fast Weights | BDH-CQ (Demonstration Variant) | TRACE (Educational Toy Model) |
| :--- | :--- | :--- | :--- | :--- |
| **Inference State** | Expanding $O(T)$ tokens | Constant $O(d^2)$ matrix | Constant $O(d^2)$ state $S$ | Constant $O(d^2)$ matrix |
| **Read Cost / Step** | $O(T)$ attention | $O(d^2)$ matrix-vector product | $O(d^2)$ recurrent update | $O(d^2)$ matrix-vector product |
| **Adaptation Rule** | Context concatenation | Linear associative sum | Learned $S_t = U_\theta(S_{t-1}, D_t)$ | Rank-1 write $S_t = S_{t-1} + v_t k_t^T$ |
| **Capacity** | Bounded by GPU RAM | Bounded by dimension $d$ | Bounded by state & gating | Bounded by dimension $d$ ($\le d$ orthogonal keys) |
| **Interference** | Zero (exact dictionary) | Linear geometric overlap | Controlled via forget gates | Exact leakage: $\sum_{b \neq a} \frac{k_a \cdot k_b}{k_a \cdot k_a} v_b$ |
| **Interpretability** | Attention token weights | Associative matrix | Black-box learned $U_\theta$ | 100% transparent linear algebra |

---

### 5. Grounding in Primary Literature & Honest Scope Boundary
1. **BDH-CQ (Engdahl, Kosowski, Chorowski, Stamirowska et al., 2026 — `arXiv:2608.09888`):** In §3.2, the authors formalize demonstration adaptation as a recurrent state update $S_t = U_\theta(S_{t-1}, D_t)$, citing the additive special case $S_t = S_{t-1} + U_\theta(D_t)$ as the linear fast-weight representation. BDH-CQ proves that recurrent state can solve symbolic reasoning benchmarks (e.g. ARC-AGI) without written chain-of-thought tokens.
2. **The Dragon Hatchling / BDH (Kosowski et al., 2025 — `arXiv:2509.26507`):** Formulates self-attention as fast Hebbian synaptic plasticity, treating inference memory as an active biological conductance state.
3. **Mamba / State Spaces (Gu & Dao, 2023 — `arXiv:2312.00752`):** Analyzes theoretical sequence compression limits within fixed recurrent state dimensions.
4. **Foundations (Pre-2022):** Schlag et al. (ICML 2021) and Katharopoulos et al. (ICML 2020) established outer-product fast weight programming and recurrent linear attention.

> **Explicit Non-Claim:** TRACE is an educational toy model instantiating the additive special case named in BDH-CQ §3.2. TRACE does *not* replicate BDH-CQ's proprietary learned $U_\theta$, deep non-linear gating, ~5% biological activation sparsity, or ARC-AGI benchmark weights.

---

### 6. Empirical Verification & Evidence
- **Lossless Recall ($d=3$):** Absorbing `red→1.0, blue→2.0, green→3.0` into $S_3 \in \mathbb{R}^{3 \times 3}$. Constructing orthonormal keys via QR decomposition ($k_i \cdot k_j = 0$) guarantees zero cross-talk; query `green` returns **$3.000$** with **$0.000$ error**.
- **Geometric Interference ($d=2$):** Demonstrating $(k_A \to 1.0)$ and $(k_B \to 9.0)$ with overlap $k_A \cdot k_B = 0.60$. Readout $\hat{y}_A = 1.0 + 0.60 \times 9.0 = \mathbf{6.400}$, matching theoretical leakage ($+5.400$) to float64 machine precision.
- **Capacity Phase Transition ($d \in [2, 6]$):** For $N=4$ demonstrations, error is substantial at $d=2$ ($\text{MSE} = 3.13$), but drops to machine precision ($1.26 \times 10^{-31}$) at $d \ge 4$ as an orthogonal basis becomes available.
- **Dual-Engine Parity:** Python (`core/linear_memory.py`) and TypeScript twin (`web/src/memory/linear_memory.ts`) match with $< 10^{-9}$ tolerance across 10 Python pytest tests and 4 Node.js parity tests.
- **Reproducibility:** `notebook/recurrent_memory.ipynb` reproduces all experimental matrices top-to-bottom.

---

### 7. Limitations & Open Research Questions
- **Geometric Capacity Limit:** A linear matrix in $\mathbb{R}^{d \times d}$ stores at most $d$ orthogonal keys. When $T > d$, interference is unavoidable.
- **Absence of Learned Gating:** Production models (Mamba, BDH-CQ) mitigate capacity limits via input/forget gates that overwrite stale memories.
- **The Unanswered Question:** In biological models like BDH, does extreme activation sparsity (~5% active) provide near-lossless pseudo-orthogonal capacity in high dimensions without explicit QR orthogonalization?
