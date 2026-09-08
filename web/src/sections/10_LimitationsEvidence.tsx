import React from "react";

export const LimitationsEvidenceSection: React.FC = () => {
  return (
    <section id="section-10-limitations" className="essay-section">
      <div className="section-eyebrow">10 / Research Grounding & Limitations</div>
      <h2 className="section-title">Evidence, Primary Literature & Limitations</h2>

      <div className="research-papers-grid">
        {/* Paper 1 */}
        <div className="paper-card">
          <div className="paper-tag">Primary Source (2026)</div>
          <h4>In-Context Learning in BDH Without Chain of Thought</h4>
          <div className="paper-meta">
            Engdahl, Kosowski, Chorowski, Stamirowska et al. (2026) —{" "}
            <code>arXiv:2608.09888</code>
          </div>
          <p>
            <strong>Contribution:</strong> Demonstrates recurrent in-context demonstration learning
            without written chain-of-thought tokens on symbolic reasoning benchmarks.
          </p>
          <p>
            <strong>Relevance to TRACE:</strong> §3.2 directly names the general update rule{" "}
            <code>S<sub>t</sub> = U<sub>&theta;</sub>(S<sub>t-1</sub>, D<sub>t</sub>)</code> and its additive special case{" "}
            <code>S<sub>t</sub> = S<sub>t-1</sub> + U<sub>&theta;</sub>(D<sub>t</sub>)</code> that forms our computational core.
          </p>
        </div>

        {/* Paper 2 */}
        <div className="paper-card">
          <div className="paper-tag">Primary Source (2025)</div>
          <h4>The Dragon Hatchling: The Missing Link between the Transformer and Brain Models</h4>
          <div className="paper-meta">
            Kosowski, Uznański, Chorowski, Stamirowska, &amp; Bartoszkiewicz (2025) —{" "}
            <code>arXiv:2509.26507</code>
          </div>
          <p>
            <strong>Contribution:</strong> Reformulates self-attention mechanisms into fast Hebbian
            synaptic plasticity, unifying working memory and sequential inference.
          </p>
          <p>
            <strong>Relevance to TRACE:</strong> Provides the architectural rationale for treating
            memory as an active, in-place synaptic state that evolves during demonstration reading.
          </p>
        </div>

        {/* Paper 3 */}
        <div className="paper-card">
          <div className="paper-tag">Primary Source (2023)</div>
          <h4>Mamba: Linear-Time Sequence Modeling with Selective State Spaces</h4>
          <div className="paper-meta">
            Gu &amp; Dao (2023) — <code>arXiv:2312.00752</code>
          </div>
          <p>
            <strong>Contribution:</strong> Analyzes the fundamental trade-off between fixed-size recurrent
            state capacity and sequence modeling compression limits.
          </p>
          <p>
            <strong>Relevance to TRACE:</strong> Provides the theoretical context for why fixed-dimensional
            recurrent state inevitably exhibits interference unless dimension or selective gating expands.
          </p>
        </div>
      </div>

      <div className="callout-card" style={{ marginTop: "24px", background: "rgba(255, 255, 255, 0.02)" }}>
        <h4>Foundational Mechanism Grounding (Pre-2022 Background)</h4>
        <p style={{ margin: "6px 0 0 0", fontSize: "0.95rem", color: "var(--text-secondary)" }}>
          The outer-product update <code>v<sub>t</sub> k<sub>t</sub><sup>T</sup></code> and normalized linear readout trace back to:
          <br />
          • <strong>Schlag, Irie &amp; Schmidhuber (2021)</strong>: <em>Linear Transformers Are Secretly Fast Weight Programmers</em> (ICML 2021).
          <br />
          • <strong>Katharopoulos et al. (2020)</strong>: <em>Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention</em> (ICML 2020).
        </p>
      </div>

      <div className="callout-card warning-border" style={{ marginTop: "24px" }}>
        <h4>Honest Limitations of the Educational Model</h4>
        <ol className="limitations-list">
          <li>
            <strong>Capacity Bounded by Dimension:</strong> A linear matrix in &reals;<sup>d&times;d</sup>{" "}
            can hold at most <em>d</em> mutually orthogonal keys. When the number of demonstrations <em>T &gt; d</em>,{" "}
            interference is mathematically guaranteed by construction.
          </li>
          <li>
            <strong>No Learned Gating:</strong> Real architectures (such as BDH-CQ and Mamba) employ
            trained non-linear input and forget gates to selectively overwrite or protect memory slots.
          </li>
          <li>
            <strong>Single-Head Linear Subspace:</strong> Our model does not include multi-head routing
            or multi-layer recurrent stacking.
          </li>
        </ol>
      </div>

      <div className="callout-card" style={{ marginTop: "24px" }}>
        <h4>The Unresolved Research Question</h4>
        <p className="lead-quote">
          <em>
            &quot;In biologically inspired models like BDH, how does extreme activation sparsity (~5% active)
            interact with state capacity? Does high-dimensional pseudo-orthogonality offer near-lossless
            storage for realistic demonstration lengths without requiring explicit linear independence?&quot;
          </em>
        </p>
      </div>

      <div className="reproducibility-bar" style={{ marginTop: "28px" }}>
        <span>Explore the Code &amp; Reproducible Notebook:</span>
        <div className="button-group">
          <a
            href="#hero"
            className="btn secondary"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Back to Top
          </a>
          <a
            href="#notebook"
            className="btn primary"
            onClick={(e) => {
              e.preventDefault();
              alert("See notebook/recurrent_memory.ipynb in the repository for top-to-bottom reproducibility.");
            }}
          >
            Jupyter Notebook (recurrent_memory.ipynb)
          </a>
        </div>
      </div>
    </section>
  );
};
