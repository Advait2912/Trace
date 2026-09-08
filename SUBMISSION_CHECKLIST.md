# TRACE: Submission Acceptance Checklist

DataForge 2026 × Pathway Track — Problem Statement 1

Every item below has been verified against the running codebase and frozen test suite:

- [x] **Educational:** A reader can restate the central claim after the visual walkthrough (§04).
- [x] **Computational:** Adding, modifying, or removing a demonstration in the UI (§06) immediately recomputes the state matrix $S$ in real-time (<1ms).
- [x] **Memory Capacity:** Adjusting dimension $d$ (from 2 to 6) in the sandbox directly controls whether keys can be allocated orthogonally or are forced to overlap.
- [x] **Failure Case:** The two-non-orthogonal-key interference demo (§07) reproduces the exact analytical leak coefficient $\frac{k_A \cdot k_B}{k_A \cdot k_A} = 0.60$ and blended readout $6.400$. It is visibly distinguished from a same-key overwrite.
- [x] **Ground Truth:** Every prediction displayed across all sections has an explicit, labeled ground truth value shown side-by-side.
- [x] **State Grid Fidelity:** Every cell in the $d \times d$ StateGrid corresponds to a real scalar entry in matrix $S$. No decorative or simulated visualizations.
- [x] **Reproducibility:** `notebook/recurrent_memory.ipynb` runs top-to-bottom and reproduces `experiments/expected_results.json` to $10^{-9}$ tolerance.
- [x] **Literature Grounding:** Primary citations to BDH-CQ (2026), Dragon Hatchling (2025), and Mamba (2023), plus pre-2022 foundational linear attention mechanisms, verified across UI, README, and `SOURCES.md`.
- [x] **Honesty & Disclosures:** Clear non-claim banners appear in the UI, README, and `AI_DISCLOSURE.md` confirming this is an educational toy model, not a reproduction of BDH-CQ.
- [x] **Fast Performance:** All interactive controls respond in <1s (pure client-side TS twin execution).
- [x] **Production Bundle:** Vite static build compiles cleanly (`npm run build` in `web/`).
