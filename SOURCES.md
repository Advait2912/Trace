# TRACE: Academic Sources & Literature Grounding

Every citation in TRACE is verified against primary literature. No phantom papers, simulated authors, or invented equations are permitted.

---

## 1. Primary Sources (2022–2026)

### [1] BDH-CQ Technical Report (2026)
- **Citation:** Engdahl, S., Kosowski, A., Chorowski, J., Stamirowska, Z., et al. (2026). *In-Context Learning in BDH Without Chain of Thought*. arXiv:2608.09888.
- **Venue:** arXiv preprint.
- **Core Contribution:** Demonstrates that a recurrent state can absorb contextual task demonstrations directly without producing explicit written chain-of-thought tokens, solving novel symbolic ARC-AGI transformations.
- **Direct Citation in TRACE:**
  - §3.2, Equation 3: General update $S_t = U_\theta(S_{t-1}, D_t)$ and named additive special case $S_t = S_{t-1} + U_\theta(D_t)$.
- **Educational Boundary:** TRACE instantiates solely the named additive special case with $U_\theta(D_t) = v_t k_t^T$. TRACE does not reconstruct $U_\theta$, which is proprietary, deep, non-linear, and trained.

### [2] The Dragon Hatchling (2025)
- **Citation:** Kosowski, A., Uznański, P., Chorowski, J., Stamirowska, Z., & Bartoszkiewicz, M. (2025). *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain*. arXiv:2509.26507.
- **Venue:** arXiv preprint (Sept 30, 2025).
- **Core Contribution:** Reformulates self-attention mechanisms into fast Hebbian synaptic plasticity, unifying working memory and sequential inference.
- **Direct Citation in TRACE:**
  - Conceptual grounding for viewing recurrent memory as an evolving physical matrix/synaptic tensor rather than an external text context list.
- **Educational Boundary:** BDH employs high-dimensional non-negative sparsity (~5% active synapses) and trained routing. TRACE uses dense, unconstrained linear matrices for mathematical transparency.

### [3] Modern State Space & Linear Attention Capacity Analysis (2023)
- **Citation:** Gu, A., & Dao, T. (2023). *Mamba: Linear-Time Sequence Modeling with Selective State Spaces*. arXiv:2312.00752.
- **Core Contribution:** Analyzes the theoretical trade-off between fixed-size recurrent state capacity and selective input gating in continuous-time sequence representations.
- **Direct Citation in TRACE:**
  - Contextualizes why fixed-dimensional recurrent state inevitably suffers from information compression limits unless selective gating or dimension expansion is introduced.

---

## 2. Background Mechanism Sources (Pre-2022)

*(These are foundational background citations establishing the fast-weight outer-product convention, cited per the BDH-CQ report's own literature review).*

### [4] Linear Attention as Fast Weight Programmers (2021)
- **Citation:** Schlag, I., Irie, K., & Schmidhuber, J. (2021). *Linear Transformers Are Secretly Fast Weight Programmers*. ICML 2021.
- **Relevance:** Formally derives the outer product update $S_t = S_{t-1} + v_t k_t^T$ and normalized dot-product readout as associative memory.

### [5] Linear Transformers (2020)
- **Citation:** Katharopoulos, A., Vyas, A., Pappas, N., & Fleuret, F. (2020). *Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention*. ICML 2020.
- **Relevance:** Derives the linear attention formulation establishing $O(1)$ recurrent step complexity.
