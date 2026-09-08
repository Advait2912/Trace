---
name: test-driven-development
description: Enforces strict Test-Driven Development (TDD) for computational models. Prioritizes locked fixtures, numerical stability, pure logic isolation, and deterministic contracts before writing implementation or UI code.
---

# Test-Driven Development & Deterministic Core Testing

## Core Philosophy
In computational research and explorable scientific artifacts, tests are the primary defense against agent hallucination and floating-point drift. 
**No computational logic or visual component may be implemented without prior locked fixtures and failing tests.**

## Principles & Rules
1. **Fixtures First (The Source of Truth):**
   - Every computational model must have pre-computed, analytically verified, or literature-grounded golden fixtures stored under `fixtures/`.
   - Fixtures must include explicit parameters, initial states, RNG seeds, and expected outputs at specified checkpoints or iterations.
   - Do not allow fuzzy or dynamic fixture generation during test execution.

2. **Red-Green-Refactor Discipline:**
   - **Red:** Write unit and contract tests in `tests/` that assert against golden fixtures. Run the test suite and verify that tests fail for the right reason (missing function, wrong output).
   - **Green:** Implement the minimum numerical/computational logic in `core/` to satisfy the tests.
   - **Refactor:** Optimize mathematical performance and clean code without breaking the fixture assertions.

3. **Pure Logic Isolation:**
   - The computational core (`core/`) must remain pure: zero DOM references, zero browser dependencies, zero presentation logic.
   - Core functions must take explicit input parameters and return deterministic output data structures.

4. **Floating-Point & Numerical Assertions:**
   - Assert exact integers and discrete states with strict equality (`==`).
   - Assert floating-point arrays and matrices with calibrated numerical tolerances (`np.allclose(actual, expected, rtol=1e-5, atol=1e-8)`), explicitly documenting why the chosen tolerance is physically/mathematically sound.

5. **Pyodide Contract Verification:**
   - Tests must verify that core outputs are cleanly serializable (e.g., standard Python dicts/lists or typed buffers) for seamless ingestion across the Pyodide WebAssembly boundary.
