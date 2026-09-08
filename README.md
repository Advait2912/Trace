# TRACE: Memory in Motion
## In-Context Learning with Recurrent Memory
**DataForge 2026 × Pathway Track — Problem Statement 1 Submission**

[![Tests](https://img.shields.io/badge/tests-10%2F10%20Python%20%7C%204%2F4%20TS-brightgreen)]()
[![Status](https://img.shields.io/badge/architecture-frozen%20%26%20verified-blue)]()
[![License](https://img.shields.io/badge/license-MIT-purple)]()
[![Hosting](https://img.shields.io/badge/artifact-public%20%26%20no--auth-orange)](https://advait2912.github.io/TRACE/)

> **The Central Falsifiable Claim:**  
> A fixed-size recurrent state can absorb an unbounded number of key–value demonstrations without growing in size, but when two demonstrations share overlapping (non-orthogonal) keys, the readout for one leaks the value of the other — a measurable, reproducible form of forgetting caused by fixed capacity, not a scripted failure. In our controlled experiment, increasing the state dimension allows construction of more mutually orthogonal keys and therefore reduces the interference we observe.

---

## 1. Submission Package & Public Deliverables

| Deliverable | Location / URL | Description |
| :--- | :--- | :--- |
| **Public Artifact URL** | [https://advait2912.github.io/TRACE/](https://advait2912.github.io/TRACE/) | Interactive visual explainer web app (runs 100% client-side, zero sign-in). |
| **Public Source Repository** | [https://github.com/Advait2912/TRACE](https://github.com/Advait2912/TRACE) | Full source code, test suites, golden fixtures, and research documents. |
| **Full Visual Essay / Blog PDF** | [`docs/TRACE_Visual_Essay.pdf`](docs/TRACE_Visual_Essay.pdf) | Complete 4-page visual essay export formatted for print and offline review. |
| **Evaluated 1-Page Summary PDF** | [`docs/one-page-summary.pdf`](docs/one-page-summary.pdf) | Single-page executive summary deliverable. |
| **Reproducible Notebook** | [`notebook/recurrent_memory.ipynb`](notebook/recurrent_memory.ipynb) | Top-to-bottom scientific notebook reproducing all experimental figures. |

---

## 2. Explicit Non-Claim & Scientific Boundary

This project is an **educational toy model** instantiating the additive linear attention special case described in §3.2 of the BDH-CQ technical report ([*Engdahl et al., 2026*](https://arxiv.org/abs/2608.09888)):
$$S_t = S_{t-1} + U_\theta(D_t) \quad \text{with} \quad U_\theta(D_t) = v_t k_t^T$$

**It is NOT an implementation or reproduction of BDH or BDH-CQ.**
- BDH-CQ's $U_\theta$ function is trained, deep, non-linear, and proprietary.
- Biological BDH synaptic activations are high-dimensional, non-negative, and sparse (~5% active).
- TRACE uses an untrained, dense linear matrix $S \in \mathbb{R}^{d \times d}$ to isolate geometric memory capacity and make the mechanics solvable by hand.

---

## 3. Intended Learner & Prerequisites

- **Target Audience:** Undergraduate and graduate students in computer science, machine learning researchers, and engineers seeking mechanistic intuition for recurrent memory and state-space architectures (Mamba, RWKV, Linear Attention, BDH).
- **Mathematical Prerequisites:** Elementary undergraduate linear algebra:
  - Vector dot products ($k_a \cdot k_b$) and Euclidean norms ($\|k\|_2$).
  - Matrix-vector multiplication and rank-1 outer products ($v k^T$).
  - The concept of orthogonal vectors ($k_a \cdot k_b = 0$).
- **Technical Prerequisites:** Zero prior knowledge of PyTorch, CUDA, or deep learning frameworks is required. All core operations are implemented in pure standard Python/NumPy and vanilla TypeScript.

---

## 4. Learning Objectives

By exploring TRACE, the learner will be able to:
1. **Explain Constant Memory Footprint:** Contrast how Transformer Key-Value caching grows linearly with sequence length ($O(T)$ scalars) whereas recurrent state memory remains invariant ($O(1)$ footprint, exactly $d^2$ scalars).
2. **Derive Key Interference Analytically:** Prove that readout error from non-orthogonal demonstrations is governed by the inner-product fraction $\text{Interference}(k_a, k_b) = \frac{k_a \cdot k_b}{k_a \cdot k_a}$, rather than simulated noise or arbitrary decay.
3. **Identify the Geometric Capacity Threshold:** Demonstrate that exact lossless recall is possible if and only if demonstration count $N \le d$ (allowing orthonormal key allocation), while $N > d$ inevitably forces linear dependence and value cross-talk.
4. **Distinguish Fast Synaptic Plasticity from Text Context:** Understand the paradigm shift from maintaining an external token scratchpad to evolving an internal synaptic state tensor during inference.

---

## 5. Formal Proofs vs. Publicly Demonstrated Claims

To maintain research integrity and prevent overclaiming, every claim in TRACE is categorized:

| Claim | Type | Source & Justification |
| :--- | :--- | :--- |
| **Rank-1 State Accumulation:** $S_t = \sum_{\tau=1}^t v_\tau k_\tau^T$ | **Formal (Proven)** | Direct unrolling of recurrence $S_t = S_{t-1} + v_t k_t^T$ from base state $S_0 = \mathbf{0}_{d \times d}$ ([*Schlag et al., 2021*](http://proceedings.mlr.press/v139/schlag21a.html)). |
| **Signal & Cross-Talk Decomposition:** $\hat{y}_a = v_a + \sum_{b \ne a} \left(\frac{k_a \cdot k_b}{k_a \cdot k_a}\right) v_b$ | **Formal (Proven)** | Derived via associative expansion of normalized readout $\frac{S_t k_a}{k_a \cdot k_a}$ ([`research/mathematical_derivations.md`](research/mathematical_derivations.md)). |
| **Capacity Bound:** Orthonormal keys eliminate leakage if $N \le d$ | **Formal (Proven)** | Gram-Schmidt QR decomposition yields $k_i \cdot k_j = \delta_{ij}$; in $\mathbb{R}^d$, at most $d$ non-zero vectors can be mutually orthogonal. |
| **Recurrent In-Context Learning without CoT Tokens** | **Publicly Demonstrated** | Demonstrated on symbolic ARC-AGI benchmarks by BDH-CQ ([*Engdahl et al., 2026*](https://arxiv.org/abs/2608.09888), §3.2). |
| **Attention as Fast Synaptic Plasticity** | **Publicly Demonstrated** | Demonstrated theoretically and empirically in *The Dragon Hatchling* ([*Kosowski et al., 2025*](https://arxiv.org/abs/2509.26507)). |
| **Recurrent State Information Bottleneck** | **Publicly Demonstrated** | Proved for selective state space compression in *Mamba* ([*Gu & Dao, 2023*](https://arxiv.org/abs/2312.00752)). |
| **Dense Matrix Substrate $\mathbb{R}^{d \times d}$** | **Teaching Simplification** | Educational abstraction of BDH's high-dimensional sparse non-negative synaptic state. |

---

## 6. Execution Nature of Components

Every element in TRACE is explicitly labeled as live, precomputed, synthetic, or animated:

| Component | Execution Nature | Implementation Details |
| :--- | :--- | :--- |
| **State Matrix $S_t$ Computation** | **Live** | Evaluated in real time (<1ms) via TypeScript engine in `web/src/memory/` and Python core in `core/`. |
| **Direct Manipulation Sandbox (§06)** | **Live** | Adding/editing demonstrations, changing values, or adjusting dimension $d \in [2, 6]$ dynamically recomputes $S_t$ and readout predictions on every user input. |
| **Interference Angle Slider (§07)** | **Live** | Continuous rotation of key vector $k_B$ recalculates dot product and blended readout $\hat{y}_A = 1.0 + 9.0 \cos \theta$ in real time. |
| **Golden Fixtures (`fixtures.json`)** | **Precomputed** | Generated deterministically by `core/generate_fixtures.py` to establish an immutable contract for testing. |
| **Demonstration Symbols (`red`, `blue`, etc.)** | **Synthetic** | Synthetic symbolic associations used as clean, minimal probes to isolate geometry without linguistic confounders. |
| **State Grid Heatmap Transitions** | **Animated** | CSS transitions and pulse effects visualize rank-1 outer-product updates; animations are strictly coupled to live matrix values. |

---

## 7. Architecture & Dual-Engine Parity

```text
fixtures/ (frozen JSON source of truth)
       │
       ├───► Python Core (core/linear_memory.py) ────► Jupyter (notebook/recurrent_memory.ipynb)
       │             │ (strict contract parity test: < 10⁻⁹ tolerance)
       └───► TypeScript Twin (web/src/memory/) ──────► Interactive Web App (web/)
```

- **Two Implementations, One Specification:**
  1. `core/linear_memory.py` — Canonical Python reference engine.
  2. `web/src/memory/linear_memory.ts` — High-performance TypeScript twin executing entirely on the user's client.
- **Strict Parity:** Contract-tested against `experiments/expected_results.json` to $< 10^{-9}$ floating-point tolerance.

---

## 8. Role of Every Major Component

```text
TRACE/
├── core/
│   ├── linear_memory.py              # Frozen Python computational reference engine
│   └── generate_fixtures.py          # Deterministic golden fixture generator
├── tests/
│   ├── test_linear_memory.py          # 10 comprehensive pytest unit tests
│   └── test_ts_parity.mjs             # Node contract test enforcing Python-TS parity
├── experiments/
│   ├── fixtures.json                  # Immutable test sequences & codebooks
│   └── expected_results.json          # Single source of truth for golden numerical values
├── web/                              # Client-side React + TypeScript + Vite explainer
│   ├── src/
│   │   ├── memory/linear_memory.ts   # Client-side TypeScript twin engine
│   │   ├── sections/                 # 10 guided interactive visual sections
│   │   └── components/StateGrid.tsx   # Live d×d SVG/HTML matrix visualization
├── notebook/
│   └── recurrent_memory.ipynb         # Scientific notebook verifying top-to-bottom results
├── research/
│   ├── references.bib                # Complete verified BibTeX bibliography
│   ├── primary_literature_analysis.md # Detailed breakdown of BDH-CQ, Dragon Hatchling, Mamba
│   └── mathematical_derivations.md    # Formal mathematical proofs
├── docs/
│   ├── TRACE_Visual_Essay.pdf         # Complete 4-page visual essay export
│   ├── one-page-summary.pdf           # Evaluated single-page PDF deliverable
│   ├── one-page-summary.md            # Markdown source for summary
│   └── MATH_SPEC.md                  # Comprehensive mathematical spec
├── SOURCES.md                        # Primary literature grounding & citation matrix
├── AI_DISCLOSURE.md                  # Human supervision & AI tool provenance
├── SUBMISSION_CHECKLIST.md           # Completed acceptance criteria checklist
├── .github/workflows/deploy.yml       # Automated GitHub Pages CI/CD deployment
└── package.json                      # Root workspace scripts
```

---

## 9. Quick Start & Reproduction Instructions

### 1. Run Complete Test Suite
```bash
# Executes both 10/10 Python unit tests and 4/4 TypeScript parity tests
npm test
```

### 2. Run Python Unit Tests
```bash
# Requires Python 3.10+ and numpy/pytest
.venv/bin/python3 -m pytest tests/test_linear_memory.py
```

### 3. Run TypeScript Twin Parity Tests
```bash
# Verifies numerical parity to < 10⁻⁹ against expected_results.json
node --test tests/test_ts_parity.mjs
```

### 4. Run Headless Notebook Execution
```bash
cd notebook
python3 -c "import json; nb=json.load(open('recurrent_memory.ipynb')); env={}; [exec(''.join(c['source']), env) for c in nb['cells'] if c['cell_type']=='code']; print('Notebook verified!')"
```

### 5. Run Interactive Web Explainer Locally
```bash
cd web
npm install
npm run dev
# Explainer runs locally at http://localhost:5173
```

### 6. Build Static Production Bundle
```bash
cd web
npm run build
# Outputs optimized static bundle to web/dist/ (with base: "./")
```

---

## 10. Primary Literature Grounding (2022–2026)

Every technical claim in TRACE is grounded in primary literature:

1. **BDH-CQ Technical Report (2026):**  
   Engdahl, S., Kosowski, A., Chorowski, J., Stamirowska, Z., Bartoszkiewicz, M., & Uznański, P.  
   *In-Context Learning in BDH Without Chain of Thought*, [`arXiv:2608.09888`](https://arxiv.org/abs/2608.09888).  
   *Claim Grounded:* §3.2 specifies the general recurrent update $S_t = U_\theta(S_{t-1}, D_t)$ and notes its additive outer-product special case $S_t = S_{t-1} + U_\theta(D_t)$ with $U_\theta(D_t) = v_t k_t^T$.
2. **The Dragon Hatchling (2025):**  
   Kosowski, A., Uznański, P., Chorowski, J., Stamirowska, Z., & Bartoszkiewicz, M.  
   *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain*, [`arXiv:2509.26507`](https://arxiv.org/abs/2509.26507).  
   *Claim Grounded:* Provides the biological foundation for treating memory as fast Hebbian synaptic plasticity evolving during inference.
3. **Mamba: Selective State Spaces (2023):**  
   Gu, A., & Dao, T.  
   *Mamba: Linear-Time Sequence Modeling with Selective State Spaces*, [`arXiv:2312.00752`](https://arxiv.org/abs/2312.00752).  
   *Claim Grounded:* Analyzes the fundamental trade-off between fixed-size recurrent state capacity and sequential compression limits.

### Foundational Mechanism Lineage (Pre-2022 Background)
- **Fast Weight Programmers (2021):** Schlag, I., Irie, K., & Schmidhuber, J. *Linear Transformers Are Secretly Fast Weight Programmers*. ICML 2021. Formally proves equivalence between linear attention and outer-product memory updating ($v_t k_t^T$).
- **Linear Transformers (2020):** Katharopoulos, A., et al. *Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention*. ICML 2020. Establishes constant $O(1)$ recurrent step inference complexity.

---

## 11. Source and License Record

| Asset Category | Asset / Dependency | Source | License |
| :--- | :--- | :--- | :--- |
| **Code (Core & Tests)** | `core/`, `tests/` | Original code authored for TRACE | MIT License |
| **Code (Web Application)** | `web/src/` | React 18, TypeScript 5, Vite 5 | MIT License |
| **Visualizations & UI** | `StateGrid.tsx`, CSS tokens | Custom hand-crafted SVG/HTML/CSS components | MIT License |
| **Fonts** | System UI / Segoe UI / SFMono | Native operating system font stack | OS / System Fonts |
| **Data & Fixtures** | `experiments/fixtures.json` | Synthetic unit-norm keys generated deterministically | CC0 / Public Domain |
| **Model Weights** | N/A | None used (untrained linear associative memory) | N/A |
| **Literature & Citations** | `research/references.bib` | Published preprints (arXiv) & conference proceedings (ICML) | Academic fair use |

---

## 12. AI Assistance Disclosure

Full disclosure of AI assistance is recorded in [`AI_DISCLOSURE.md`](AI_DISCLOSURE.md):
- **Human Supervision:** System design, mathematical derivations, parameter choices, and paper verification were directed by the human author.
- **AI Tool:** Antigravity IDE (Google DeepMind agentic pair programmer).
- **Delegated Tasks:** Automated scaffolding, Python-to-TypeScript engine translation, parity test authoring, and CSS token layout.
- **Prohibited:** No synthetic citations, simulated numbers, or unverified claims were accepted. Every displayed value is computed live from the verified mathematical core.
