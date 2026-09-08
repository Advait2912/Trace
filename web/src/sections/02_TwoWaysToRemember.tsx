import React from "react";

export const TwoWaysToRememberSection: React.FC = () => {
  return (
    <section id="section-02-two-ways" className="essay-section">
      <div className="section-eyebrow">02 / Two Paradigms</div>
      <h2 className="section-title">Two Ways to Remember in Context</h2>

      <p className="lead-paragraph">
        When an AI adapts to demonstrations at runtime without updating its weights, where does the memory live?
      </p>

      <div className="comparison-panels">
        {/* Paradigm 1 */}
        <div className="paradigm-card">
          <div className="paradigm-tag">Paradigm A: Explicit KV Memory</div>
          <h3>Growing Context (Transformers)</h3>
          <p>
            The model appends every token to a growing key-value cache.
            Memory consumption scales linearly <em>O(T)</em> with sequence length.
          </p>

          <div className="diagram-illustration">
            <div className="diagram-label">Schematic Illustration (Tokens in Context)</div>
            <div className="token-list">
              <div className="token-item">Token 1: &quot;red&quot; → 1</div>
              <div className="token-item">Token 2: &quot;blue&quot; → 2</div>
              <div className="token-item">Token 3: &quot;green&quot; → 3</div>
              <div className="token-item future">Token 4: ...</div>
              <div className="token-item future">Token T: ... (Cache grows forever)</div>
            </div>
          </div>

          <ul className="paradigm-traits">
            <li><strong>Pros:</strong> Perfect recall; no compression interference.</li>
            <li><strong>Cons:</strong> Unbounded RAM; quadratic or linear attention compute overhead.</li>
          </ul>
        </div>

        {/* Paradigm 2 */}
        <div className="paradigm-card highlight-card">
          <div className="paradigm-tag primary">Paradigm B: Implicit Recurrent Memory</div>
          <h3>Evolving State (Fast Weights / BDH-CQ)</h3>
          <p>
            The model compresses every demonstration into a <strong>fixed-dimensional state tensor</strong>.
            Memory size remains strictly constant <em>O(d²)</em> regardless of sequence length <em>T</em>.
          </p>

          <div className="diagram-illustration">
            <div className="diagram-label">Schematic Illustration (Fixed Recurrent State)</div>
            <div className="matrix-illustration">
              <div className="static-matrix-preview">
                <span>S₀ (d×d)</span>
                <span className="arrow">→ +v₁k₁ᵀ →</span>
                <span>S₁ (d×d)</span>
                <span className="arrow">→ +v₂k₂ᵀ →</span>
                <span className="active-pill">S_t (d×d constant)</span>
              </div>
            </div>
          </div>

          <ul className="paradigm-traits">
            <li><strong>Pros:</strong> Constant memory footprint; instantaneous <em>O(d²)</em> inference.</li>
            <li><strong>Cons:</strong> Fixed geometric capacity forces non-orthogonal keys to overlap and leak.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
