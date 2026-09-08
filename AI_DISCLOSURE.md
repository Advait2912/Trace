# TRACE: AI Assistance & Provenance Disclosure

**DataForge 2026 × Pathway Track — PS1 Submission**

---

## 1. Human Direction & Architectural Control
- **System Architecture & Math Specification:** The mathematical derivations, state normalizer equations, and central claim formulation were authored and reviewed under human supervision.
- **Verification of Primary Sources:** All primary paper claims and equations (specifically BDH-CQ §3.2 and Dragon Hatchling citations) were explicitly cross-checked against the published arXiv preprints.

---

## 2. Agentic Coding Assistance
- **AI Tool Used:** Antigravity IDE (Google DeepMind agentic pair programmer).
- **Tasks Delegated to AI:**
  - Scaffolding the repository file structure.
  - Porting the verified Python core (`core/linear_memory.py`) into the TypeScript twin (`web/src/memory/linear_memory.ts`).
  - Writing the automated contract test suite (`tests/test_linear_memory.py` and `tests/test_ts_parity.mjs`).
  - Generating standard CSS tokens and React component scaffolding.
- **Tasks Prohibited from AI Delegation:**
  - No synthetic literature, citations, or academic claims were accepted without primary source grounding.
  - No hand-waving or simulated numbers: every number displayed in the UI is computed live by the verified linear memory engine.

---

## 3. Explicit Model Boundary & Non-Claims
- **Educational Toy Status:** TRACE is an educational computational artifact illustrating the additive special case named in BDH-CQ §3.2 ($S_t = S_{t-1} + U_\theta(D_t)$ with $U_\theta(D_t) = v_t k_t^T$).
- **No Reproduction Claim:** TRACE does not implement or reproduce BDH or BDH-CQ. BDH-CQ's $U_\theta$ function is deep, trained, and proprietary; BDH's synaptic activations are sparse (~5% active) and non-negative.
