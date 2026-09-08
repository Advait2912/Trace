---
name: scientific-python-jupyter
description: Standards for scientific computing with Python and reproducible Jupyter notebooks. Enforces deterministic RNG, clean numerical pipelines, Pyodide compatibility, and automated fixture export.
---

# Scientific Python & Reproducible Jupyter

## Core Philosophy
Scientific code must be fully reproducible, strictly deterministic, and self-documenting. Experiments run in Jupyter notebooks must produce identical results to the production core and generate the golden fixtures used by tests and the web app.

## Principles & Rules
1. **Determinism & Seed Locking:**
   - Never rely on implicit global random states.
   - Always instantiate and pass explicit RNG instances (e.g. `np.random.default_rng(seed)`).
   - Document the specific seed used in every experiment and fixture.

2. **Pyodide & WASM Compatibility:**
   - Keep the core dependencies lightweight and standard (e.g., pure Python, `numpy`, and standard library modules supported out of the box by Pyodide).
   - Avoid heavy C-extensions or external platform-specific binaries in `core/` that cannot be compiled or loaded into WebAssembly.

3. **Jupyter Notebook Hygiene (`notebook/`):**
   - Notebooks must be fully runnable from top to bottom without hidden cell states or out-of-order execution.
   - Separate narrative exploration and exploratory parameter sweeps from core library definitions.
   - Import algorithms from `core/` rather than defining core functions directly in notebook cells.

4. **Fixture Export Pipeline:**
   - Build reproducible scripts or notebook cells that execute validated computational runs and export serialized JSON files to `fixtures/`.
   - Include metadata in exported fixtures: parameter values, model version, timestamp, RNG seed, and precision format.
