# TRACE

> A research explainer and interactive scientific artifact with a live computational core for BDH / BDH-CQ architectures.

## Architecture

```text
fixtures + tests
       │
       ▼
Python computational core
       │
       ├──────────► Jupyter experiments
       │
       └──────────► Pyodide
                         │
                         ▼
                    React/TS web app
                         │
                         ▼
                 Editorial explainer
```

- **Computational Source of Truth:** Python core (`core/`) verified against locked analytical and empirical fixtures (`fixtures/`) via TDD (`tests/`).
- **Web Artifact:** React + TypeScript web application (`web/`) communicating with the Python core via Pyodide in WebAssembly.
- **Exploration & Research:** Reproducible Jupyter notebooks (`notebook/`) and literature ground-truth citations (`research/`).

## Project Structure

```text
TRACE/
├── .agents/
│   └── skills/
├── core/
├── tests/
├── fixtures/
├── web/
├── notebook/
├── research/
├── docs/
└── README.md
```
