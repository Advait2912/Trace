# Primary Literature Grounding & Theoretical Analysis

**Project:** TRACE: Memory in Motion &mdash; In-Context Learning with Recurrent Memory  
**Track:** DataForge 2026 &times; Pathway Track (Problem Statement 1)  
**Standard:** Verified against primary arXiv preprints and ICML proceedings. Zero phantom citations or manufactured claims.

---

## 1. Overview of Primary Sources (2022–2026)

| Paper | Authors & Year | Venue / arXiv ID | Role in TRACE |
| :--- | :--- | :--- | :--- |
| **BDH-CQ** | Engdahl, Kosowski, Chorowski, Stamirowska, et al. (2026) | `arXiv:2608.09888` | **Direct Mathematical Origin**: §3.2 specifies general recurrent update $S_t = U_\theta(S_{t-1}, D_t)$ and names the additive special case $S_t = S_{t-1} + U_\theta(D_t)$. |
| **The Dragon Hatchling** | Kosowski, Uznański, Chorowski, Stamirowska, & Bartoszkiewicz (2025) | `arXiv:2509.26507` | **Conceptual Grounding**: Reformulates self-attention into active Hebbian synaptic weights evolving during sequence processing. |
| **Mamba** | Gu & Dao (2023) | `arXiv:2312.00752` | **Capacity & Compression Analysis**: Formalizes why fixed-dimensional recurrent state inevitably bounds information retention. |

---

## 2. In-Depth Primary Paper Analysis

### [1] BDH-CQ Technical Report (2026)
- **Title:** *In-Context Learning in BDH Without Chain of Thought*
- **Authors:** Sterling Engdahl, Adrian Kosowski, Jan Chorowski, Zuzanna Stamirowska, Mateusz Bartoszkiewicz, Przemysław Uznański (Pathway Research).
- **Core Contribution:** Demonstrates that recurrent neural architectures equipped with internal dynamic memory states can absorb in-context demonstrations directly without generating intermediate written chain-of-thought tokens, outperforming larger causal language models on symbolic ARC-AGI reasoning tasks.
- **Section 3.2 Formal Analysis:**
  - BDH-CQ formulates recurrent in-context learning over sequence demonstrations $D_1, D_2, \dots, D_T$:
    $$S_t = U_\theta(S_{t-1}, D_t)$$
    where $S_t$ is the recurrent state and $U_\theta$ is a parameterized update function.
  - Section 3.2 explicitly discusses the relationship between this recurrence and linear attention, highlighting the additive special case:
    $$S_t = S_{t-1} + U_\theta(D_t)$$
  - When $U_\theta(D_t)$ decomposes into an associative outer-product $v_t k_t^T$, this reduces to the classical fast-weight associative update.
- **Explicit Non-Claim & Educational Scope Boundary:**
  - TRACE instantiates **only** this named additive outer-product special case ($U_\theta(D_t) = v_t k_t^T$).
  - TRACE does **not** reconstruct BDH-CQ's proprietary, deep, non-linear $U_\theta$ network, nor its trained model weights.
  - TRACE is an educational computational artifact designed to make memory capacity, state accumulation, and linear interference transparent and solvable by hand.

---

### [2] The Dragon Hatchling (2025)
- **Title:** *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain*
- **Authors:** Adrian Kosowski, Przemysław Uznański, Jan Chorowski, Zuzanna Stamirowska, Mateusz Bartoszkiewicz.
- **Date:** September 30, 2025 (`arXiv:2509.26507`).
- **Core Contribution:** Proposes a biological and algorithmic reconciliation between Transformer attention and synaptic plasticity. Rather than buffering past token vectors into an expanding Key-Value list, the model updates synaptic weights in real time via local Hebbian-style rules.
- **Relevance to TRACE:**
  - Provides the architectural justification for viewing memory as an active, in-place matrix $S \in \mathbb{R}^{d \times d}$ rather than an append-only token log.
  - Explains why demonstration ingestion corresponds to continuous weight modification in a fixed physical footprint ($O(1)$ memory growth with sequence length $T$).
- **Distinction from TRACE:**
  - The biological BDH architecture employs extreme activation sparsity (~5% active units) and non-negative synaptic activations.
  - TRACE uses dense, unconstrained real-valued matrices in $\mathbb{R}^{d \times d}$ to preserve elementary linear algebraic transparency.

---

### [3] Mamba: Selective State Spaces (2023)
- **Title:** *Mamba: Linear-Time Sequence Modeling with Selective State Spaces*
- **Authors:** Albert Gu, Tri Dao.
- **Venue:** `arXiv:2312.00752` (NeurIPS 2023 workshop / subsequent publication).
- **Core Contribution:** Investigates the fundamental trade-off between constant inference memory $O(1)$ in recurrent/state-space models versus full-context attention.
- **Relevance to TRACE:**
  - Proves that any fixed-dimensional recurrent state compression acts as an information bottleneck.
  - Contextualizes our central falsifiable claim: a recurrent state cannot absorb unlimited independent demonstrations without interference unless state dimension expands ($d \ge N$) or input-selective gating is introduced.

---

## 3. Foundational Mechanism Grounding (Pre-2022 Background)

These citations provide the historical and formal mathematical lineage of the outer-product update rule $S_t = S_{t-1} + v_t k_t^T$:

### [4] Linear Transformers Are Secretly Fast Weight Programmers (2021)
- **Authors:** Imanol Schlag, Kazuki Irie, Jürgen Schmidhuber.
- **Venue:** ICML 2021 (`PMLR 139:9355-9366`).
- **Formal Proof:** Establishes the exact algebraic equivalence between autoregressive linear attention with unnormalized kernels and fast weight programmers that store associative key-value bindings via outer products $\sum_\tau v_\tau \phi(k_\tau)^T$.

### [5] Transformers are RNNs: Fast Autoregressive Linear Attention (2020)
- **Authors:** Angelos Katharopoulos, Apoorv Vyas, Nikolaos Pappas, François Fleuret.
- **Venue:** ICML 2020 (`PMLR 119:5156-5165`).
- **Formal Proof:** Demonstrates that rewriting the softmax attention matrix via feature maps enables the associative property of matrix multiplication:
  $$(\phi(Q) \phi(K)^T) V = \phi(Q) (\phi(K)^T V)$$
  reducing inference step time and memory complexity from $O(T)$ to $O(1)$.
