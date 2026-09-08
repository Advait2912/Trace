---
name: academic-research-citations
description: Standards for academic literature verification, primary source ground-truthing, and strict mathematical nomenclature alignment for BDH, BDH-CQ, and related research papers.
---

# Academic Research & Citation Verification

## Core Philosophy
Scientific explainers derive their authority from rigorous fidelity to primary literature. 
**Zero tolerance for LLM-manufactured citations, phantom papers, or invented mathematical notation.** 
Every equation, claim, and algorithmic step must be grounded in primary sources.

## Principles & Rules
1. **Primary Source Grounding:**
   - Anchor all model definitions in the 3 designated recent primary papers and the foundational BDH / BDH-CQ literature.
   - Maintain a structured research catalog in `research/` with validated titles, authors, arXiv IDs / DOIs, and direct references to key equations, definitions, lemmas, and figures.

2. **Mathematical Nomenclature Consistency:**
   - Use the exact variable names, index notation, tensor dimensions, and operator symbols established in the primary BDH / BDH-CQ literature.
   - If notation between papers differs, document an explicit mapping table in `docs/notation.md` before writing code.

3. **Theoretical Guarantees vs. Empirical Observations:**
   - Clearly delineate between what has been mathematically proven in the papers and what is an empirical or heuristic observation from simulation.
   - Never extrapolate theoretical bounds without stating the required assumptions.

4. **Citation Integrity:**
   - All references in `README.md`, notebooks, and explainer essays must include complete, verifiable bibliographic details (BibTeX formatted in `research/references.bib`).
