# TRACE: Memory in Motion
## In-Context Learning with Recurrent Memory
**DataForge 2026 × Pathway Track — Problem Statement 1 Submission**

---

### 1. The Central Falsifiable Claim
> **A fixed-size recurrent state can absorb an unbounded number of key–value demonstrations without growing in size, but when two demonstrations share overlapping (non-orthogonal) keys, the readout for one leaks the value of the other — a measurable, reproducible form of forgetting caused by fixed capacity, not a scripted failure. In our controlled experiment, increasing the state dimension allows construction of more mutually orthogonal keys and therefore reduces the interference we observe.**

---

### 2. The Computational Substrate
Standard Transformer LLMs require expanding $O(T)$ Key-Value caches to remember context. TRACE models recurrent in-context learning where memory is an evolving internal state matrix of invariant size:
- **Recurrent State:** $S \in \mathbb{R}^{d \times d}, \quad S_0 = \mathbf{0}_{d \times d}$ (exactly $d^2$ scalars, independent of sequence length $T$).
- **Demonstration Update:** $S_t = S_{t-1} + v_t k_t^T$ (rank-1 outer product write; standard fast-weight convention).
- **Normalized Readout:** $\hat{y} = \frac{S_t \cdot k_q}{k_q \cdot k_q}$.
- **Derived Interference / Leakage:**
  $$\hat{y}_a = v_a + \sum_{b \neq a} \left(\frac{k_a \cdot k_b}{k_a \cdot k_a}\right) v_b$$
  Leakage is proven by linear algebra, not simulated by arbitrary noise or scripted failure.

---

### 3. Key Experimental Findings (Frozen Fixtures)
1. **The Hook (Lossless Recall, $d=3$):** Absorbing `red→1, blue→2, green→3` into $S_3 \in \mathbb{R}^{3 \times 3}$. When keys are constructed to be orthonormal via QR decomposition ($k_i \cdot k_j = 0$), query `green` returns **$3.000$** with **$0.000$ error**.
2. **Interference from Overlapping Keys ($d=2$):** Demonstrating $(k_A \to 1.0)$ and $(k_B \to 9.0)$ with $k_A \cdot k_B = 0.60$. Querying $k_A$ yields **$6.400$** ($1.0 + 0.6 \times 9.0$). The leaked fraction matches the derived leak coefficient $\frac{k_A \cdot k_B}{k_A \cdot k_A} = 0.60$ to floating-point tolerance.
3. **Capacity Threshold ($d \in [2, 6]$):** With $N=4$ demonstration symbols, error is substantial at $d=2$ ($\text{MSE} \approx 3.13$), but drops to exact machine precision ($1.26 \times 10^{-31}$) when $d \ge 4$ because orthonormal basis allocation becomes geometrically possible.

---

### 4. Literature Grounding & Honest Scope Boundary
- **Primary Papers (2022–2026):**
  1. *BDH-CQ* (Engdahl, Kosowski, Chorowski, Stamirowska et al., 2026, `arXiv:2608.09888`), §3.2: General update $S_t = U_\theta(S_{t-1}, D_t)$ and named additive special case $S_t = S_{t-1} + U_\theta(D_t)$.
  2. *The Dragon Hatchling* (Kosowski, Uznański, Chorowski, Stamirowska, & Bartoszkiewicz, 2025, `arXiv:2509.26507`): Biological foundations of fast synaptic state.
  3. *Mamba* (Gu & Dao, 2023, `arXiv:2312.00752`): Theoretical analysis of fixed-capacity recurrent state and sequential compression limits.
- **Foundational Mechanism Grounding (Pre-2022):** Schlag et al. (2021) and Katharopoulos et al. (2020) — outer-product update ($v_t k_t^T$) and linear attention as recurrent associative memory.
- **Explicit Non-Claim:** TRACE is an educational toy model instantiating the linear additive special case described in BDH-CQ. It does *not* reconstruct BDH-CQ's proprietary, trained $U_\theta$ function, sparsity profile (~5% active), or ARC-AGI model weights.

---

### 5. Architectural Parity & Verification
- **Dual Engine Parity:** The Python core (`core/linear_memory.py`) and TypeScript twin (`web/src/memory/linear_memory.ts`) are contract-tested against `experiments/expected_results.json` and match to $< 10^{-9}$ float tolerance.
- **10/10 Python unit tests** pass via `pytest`.
- **Reproducible Jupyter Notebook** (`notebook/recurrent_memory.ipynb`) reproduces all experimental figures top-to-bottom.
