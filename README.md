# TRACE: Memory in Motion
## In-Context Learning with Recurrent Memory
**DataForge 2026 × Pathway Track — Problem Statement 1 Submission**

[![Tests](https://img.shields.io/badge/tests-10%2F10%20Python%20%7C%204%2F4%20TS-brightgreen)]()
[![Status](https://img.shields.io/badge/architecture-frozen%20%26%20verified-blue)]()
[![License](https://img.shields.io/badge/license-MIT-purple)]()

> **The Central Falsifiable Claim:**
> A fixed-size recurrent state can absorb an unbounded number of key–value demonstrations without growing in size, but when two demonstrations share overlapping (non-orthogonal) keys, the readout for one leaks the value of the other — a measurable, reproducible form of forgetting caused by fixed capacity, not a scripted failure. In our controlled experiment, increasing the state dimension allows construction of more mutually orthogonal keys and therefore reduces the interference we observe.

---

## 1. Explicit Non-Claim & Scientific Scope

This project is an **educational toy model** that instantiates the additive special case described in §3.2 of the BDH-CQ technical report ($S_t = S_{t-1} + U_\theta(D_t)$ with $U_\theta(D_t) = v_t k_t^T$). 

**It is NOT an implementation or reproduction of BDH or BDH-CQ.** BDH-CQ's $U_\theta$ function is trained, deep, non-linear, and proprietary. BDH's synaptic activations are sparse (~5% active) and non-negative. TRACE uses an untrained, dense linear matrix to make the underlying mathematical mechanics and geometric capacity transparent, verifiable, and solvable by hand.

---

## 2. Architecture & Dual-Engine Parity

```text
fixtures/ (frozen JSON)
       │
       ├───► Python Core (core/linear_memory.py) ────► Jupyter (notebook/)
       │             │ (contract parity test)
       └───► TypeScript Twin (web/src/memory/) ──────► Interactive Web App (web/)
```

- **Single Mathematical Spec:**
  - **State:** $S \in \mathbb{R}^{d \times d}, \quad S_0 = \mathbf{0}_{d \times d}$ (invariant $d^2$ size).
  - **Update:** $S_t = S_{t-1} + v_t k_t^T$ (rank-1 outer product write).
  - **Readout:** $\hat{y} = \frac{S_t \cdot k_q}{k_q \cdot k_q}$.
  - **Derived Leakage:** $\hat{y}_a = v_a + \sum_{b \neq a} \left(\frac{k_a \cdot k_b}{k_a \cdot k_a}\right) v_b$.
- **Two Implementations, One Spec:**
  1. `core/linear_memory.py` — Canonical Python reference implementation.
  2. `web/src/memory/linear_memory.ts` — TypeScript twin for sub-millisecond client-side interactivity.
  3. Tested equivalent against `experiments/expected_results.json` to $< 10^{-9}$ floating-point tolerance.

---

## 3. Directory Layout

```text
TRACE/
├── core/
│   ├── linear_memory.py          # Frozen Python computational core
│   └── generate_fixtures.py      # Golden fixture generator
├── tests/
│   ├── test_linear_memory.py      # 10 comprehensive Python unit tests
│   └── test_ts_parity.mjs         # TypeScript twin contract test
├── experiments/
│   ├── fixtures.json              # Codebook & demonstration sequences
│   └── expected_results.json      # Single source of truth for all numbers
├── web/                          # React + TypeScript + Vite single-page explainer
│   ├── src/
│   │   ├── memory/linear_memory.ts # TS engine
│   │   ├── sections/             # 10 guided interactive sections
│   │   └── components/StateGrid.tsx # Real d×d matrix visualization
├── notebook/
│   └── recurrent_memory.ipynb     # Reproducible experiments importing core/
├── research/
│   ├── references.bib            # Verifiable BibTeX bibliography
│   ├── primary_literature_analysis.md # Breakdown of BDH-CQ, Dragon Hatchling, Mamba
│   └── mathematical_derivations.md    # Formal proofs for recurrence, readout & interference
├── docs/
│   ├── one-page-summary.md        # Evaluated 1-page summary
│   ├── one-page-summary.pdf       # Compiled single-page PDF deliverable
│   └── MATH_SPEC.md              # Derivations and formal proofs
├── SOURCES.md                    # Primary literature citations & verification
├── AI_DISCLOSURE.md              # Provenance & tool disclosure
├── SUBMISSION_CHECKLIST.md       # Acceptance criteria checklist
└── package.json                  # Root runner scripts
```

---

## 4. Quick Start & Verification

### Run the Full Test Suite
```bash
# Runs both 10/10 Python tests and 4/4 TypeScript contract tests
npm test
```

### Run Python Tests Individually
```bash
.venv/bin/python3 -m pytest tests/test_linear_memory.py
```

### Run TypeScript Parity Tests Individually
```bash
node --test tests/test_ts_parity.mjs
```

### Run the Interactive Web Explainer Locally
```bash
cd web
npm install
npm run dev
# Open http://localhost:5173
```

### Build the Static Web Production Bundle
```bash
cd web
npm run build
# Outputs optimized static bundle to web/dist/
```

---

## 5. Literature Grounding

### Primary Sources (2022–2026)
1. **BDH-CQ Technical Report (2026):** Engdahl, S., Kosowski, A., Chorowski, J., Stamirowska, Z., et al. *In-Context Learning in BDH Without Chain of Thought*. `arXiv:2608.09888`. §3.2 defines the general update $S_t = U_\theta(S_{t-1}, D_t)$ and notes its additive special case $S_t = S_{t-1} + U_\theta(D_t)$.
2. **The Dragon Hatchling (2025):** Kosowski, A., Uznański, P., Chorowski, J., Stamirowska, Z., & Bartoszkiewicz, M. *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain*. `arXiv:2509.26507`. Provides foundational biological motivation for fast synaptic memory state.
3. **Mamba (2023):** Gu, A., & Dao, T. *Mamba: Linear-Time Sequence Modeling with Selective State Spaces*. `arXiv:2312.00752`. Theoretical analysis of fixed-capacity recurrent state and sequential compression limits.

### Foundational Mechanism Grounding (Pre-2022 Background)
- **Fast Weight Programmers (2021):** Schlag, I., Irie, K., & Schmidhuber, J. *Linear Transformers Are Secretly Fast Weight Programmers*. ICML 2021. Formally proves equivalence of linear attention and outer product memory updates ($v_t k_t^T$).
- **Linear Transformers (2020):** Katharopoulos, A., et al. *Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention*. ICML 2020. $O(1)$ constant recurrent step complexity.
