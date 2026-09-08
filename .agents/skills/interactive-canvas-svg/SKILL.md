---
name: interactive-canvas-svg
description: Standards for interactive scientific visualization using SVG and HTML5 Canvas. Covers coordinate mapping, mathematical state rendering, state-driven transitions, direct manipulation, and 60fps rendering.
---

# Interactive Canvas & SVG Visualization

## Core Philosophy
Scientific visualizations must be visually truthful, mathematically precise, and immediately responsive to direct user manipulation. Visual artifacts are not decorative illustrations—they are computational instruments.

## Principles & Rules
1. **Hybrid Rendering Strategy:**
   - **SVG:** Use for discrete mathematical elements, sharp vector axes, tick marks, labels, glyphs, and interactive handles that require DOM events or screen-reader accessibility.
   - **Canvas (2D / WebGL):** Use for dense continuous fields, matrix heatmaps, multi-particle state trajectories, and high-frequency real-time updates.

2. **Explicit Coordinate Transformations:**
   - Always maintain a clear separation between:
     - **Model Space:** Mathematical coordinates (e.g., continuous state space, normalized latent representations, $[-1, 1]$ or $[0, \infty)$).
     - **Screen Space:** Device pixel coordinates with high-DPI (Retina) scaling support (`window.devicePixelRatio`).
   - Pure transform functions: `toScreen(modelX, modelY)` and `toModel(screenX, screenY)`.

3. **Direct Manipulation & State Stepping:**
   - Provide interactive controls that allow users to explore the model dynamically: scrubbers, timeline sliders, interactive probe points, and parameter toggles.
   - User interactions must trigger predictable, deterministic state updates.

4. **Performance & Motion:**
   - Avoid DOM thrashing. Batch canvas updates within `requestAnimationFrame` loops.
   - Avoid generic, bouncy "marketing" animations. Use physically grounded transitions, dampening, or clear state interpolation that accurately reflects parameter trajectories.
