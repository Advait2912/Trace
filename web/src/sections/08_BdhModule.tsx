import React from "react";

export const BdhModuleSection: React.FC = () => {
  return (
    <section id="section-08-bdh" className="essay-section">
      <div className="section-eyebrow">08 / Conceptual Foundations</div>
      <h2 className="section-title">BDH: Baby Dragon Hatchling & Synaptic Memory</h2>

      <div className="callout-card boundary-card">
        <div className="badge warning">Honesty & Scope Boundary</div>
        <p>
          <strong>Explicit Non-Claim:</strong> Our educational toy model is <em>not</em> an
          implementation or reproduction of the official BDH architecture. BDH uses trained, sparse
          (~5% active), non-negative synaptic parameters. Our toy model uses a dense, untrained linear
          matrix to illustrate the fundamental physics of recurrent state accumulation.
        </p>
      </div>

      <div className="grid-2-col" style={{ marginTop: "24px" }}>
        <div className="prose-column">
          <h3>Memory as a Computational Fabric</h3>
          <p>
            In standard Transformer architectures, computation and memory are strictly separated:
            weights are frozen at inference, and memory is offloaded to a growing external sequence of
            KV activations.
          </p>
          <p>
            <strong>Baby Dragon Hatchling (BDH)</strong> reformulates this paradigm. Inspired by biological
            synaptic plasticity, BDH incorporates fast-updating synaptic weights that evolve as the model
            processes text. Reasoning and memory share a unified physical substrate: reading an input
            physically adjusts internal connection strengths via Hebbian-like mechanisms.
          </p>
          <p>
            Our project’s update rule:
          </p>
          <div className="math-proof">
            <code>S<sub>t</sub> = S<sub>t-1</sub> + v<sub>t</sub> k<sub>t</sub>ᵀ</code>
          </div>
          <p>
            is the canonical, minimal linear realization of this concept: writing to memory is an
            accumulative modification of internal synaptic conductance.
          </p>
        </div>

        <div className="visual-column">
          <div className="conceptual-contrast-card">
            <h4>BDH Architecture vs. Standard Transformer</h4>
            <div className="feature-comparison-list">
              <div className="feature-item">
                <span className="feat-name">Context Handling:</span>
                <span className="feat-val">
                  Synaptic state updates in-session rather than unbounded token caching.
                </span>
              </div>
              <div className="feature-item">
                <span className="feat-name">Biological Analogue:</span>
                <span className="feat-val">
                  Fast Hebbian plasticity (co-activated units strengthen pathways).
                </span>
              </div>
              <div className="feature-item">
                <span className="feat-name">Sparsity Profile:</span>
                <span className="feat-val">
                  Extremely sparse activations (~5% active), restricting interference across memory tracks.
                </span>
              </div>
              <div className="feature-item">
                <span className="feat-name">Our Toy Analogue:</span>
                <span className="feat-val">
                  Instantiates dense rank-1 updates to make interference mathematically transparent and solvable by hand.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
