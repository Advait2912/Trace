---
name: editorial-explainer
description: Standards for scientific editorial design, explorable explanations, and information-dense layouts inspired by Distill.pub, Edward Tufte, and Bret Victor. Focuses on typography, scrollytelling, and visual hierarchy.
---

# Editorial Explainer & Scientific UI/UX

## Core Philosophy
This project is an interactive research explainer with a live computational core, not a commercial SaaS startup. 
The interface must embody the aesthetic rigor, typography, and density of high-end scientific journalism (such as Distill.pub, Quanta Magazine, and Bret Victor's explorable explanations).

## Principles & Rules
1. **Visual Hierarchy & Information Density:**
   - Design for high information density without visual clutter or unnecessary padding.
   - Utilize multi-column layouts with dedicated marginalia (Tufte-style sidenotes, equation callouts, and miniature interactive sub-figures aligned with the narrative text).
   - Structural elements (rules, dividers, subtle column guidelines, numeric indicators) must encode actual structure, not serve as meaningless decoration.

2. **Typographic Rigor:**
   - Establish a deliberate typographic scale adhering to *The Elements of Typographic Style*.
   - Use high-quality editorial type pairings (e.g., a modern geometric or transitional serif for headings/essay body, paired with an ultra-legible monospace for computational variables, tensor shapes, and state vectors).
   - Render mathematical expressions cleanly with KaTeX, ensuring formulas share baseline alignment and optical balance with accompanying prose.

3. **Explorable Explanations & Scrollytelling:**
   - Integrate the essay seamlessly with the simulation: text mentions a parameter $\to$ the adjacent visualization highlights that exact parameter or opens a scrubber control.
   - Support stepped progression: introduce concepts incrementally from intuition $\to$ visual mechanism $\to$ mathematical formalization $\to$ unconstrained interactive sandbox.

4. **Micro-Interactions & Anti-Slop Guidelines:**
   - **Banned Aesthetics:** No generic AI-generated purple gradients, floating glassmorphic cards with glowing neon borders, gratuitous bouncy entrance animations, or marketing badges.
   - **Polished Feedback:** Interactive scrubbers, coordinate probes, and parameter sliders must have immediate tactile feedback, crisp hover states, and clear numerical readouts.
   - Ensure complete responsiveness across viewports, adapting multi-column margin layouts gracefully to tablet and mobile screens.
