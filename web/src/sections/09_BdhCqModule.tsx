import React from "react";

export const BdhCqModuleSection: React.FC = () => {
  return (
    <section id="section-09-bdh-cq" className="essay-section">
      <div className="section-eyebrow">09 / Direct Conceptual Parent</div>
      <h2 className="section-title">BDH-CQ: In-Context Learning via Recurrent State</h2>

      <div className="callout-card primary-border">
        <h4>Primary Paper Reference</h4>
        <p>
          <strong>Engdahl, Kosowski, Chorowski, Stamirowska et al. (2026)</strong>:{" "}
          <em>In-Context Learning in BDH Without Chain of Thought</em> (arXiv:2608.09888).
        </p>
        <p>
          In §3.2, the authors formalize demonstration adaptation as a recurrent state update:
        </p>
        <div className="math-proof">
          <code>{"S_t = U_θ(S_{t-1}, D_t)"}</code>
        </div>
        <p>
          and cite the additive special case <code>{"S_t = S_{t-1} + U_θ(D_t)"}</code> as the linear
          fast-weight / linear-attention representation of this process.
        </p>
      </div>

      <div className="prose-column" style={{ marginTop: "24px" }}>
        <h3>In-Context Demonstration Adaptation Without Written Chain-of-Thought</h3>
        <p>
          Most contemporary LLMs require producing thousands of explicit &quot;chain-of-thought&quot; (CoT)
          tokens to reason through novel demonstration tasks (e.g. ARC-AGI grids).
        </p>
        <p>
          <strong>BDH-CQ</strong> demonstrates that a recurrent state can absorb contextual demonstrations
          directly into its latent memory state $S$, allowing the network to solve complex visual and
          symbolic transformations without writing out reasoning steps into an expanding text context.
        </p>
      </div>

      <h3 style={{ marginTop: "32px", marginBottom: "16px" }}>Rigorous Architectural Comparison Table</h3>
      <div className="table-container">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Dimension</th>
              <th>BDH (Dragon Hatchling)</th>
              <th>BDH-CQ</th>
              <th>TRACE (Educational Toy Model)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Role</strong></td>
              <td>Base post-Transformer architecture</td>
              <td>Demonstration-adapted variant</td>
              <td>Toy instantiation of one named equation</td>
            </tr>
            <tr>
              <td><strong>Memory Mechanism</strong></td>
              <td>Synaptic strength, Hebbian writes</td>
              <td>Recurrent contextual state S_t = U_θ(S_{"{t-1}"}, D_t)</td>
              <td>Rank-1 outer-product S_t = S_{"{t-1}"} + v_t k_tᵀ</td>
            </tr>
            <tr>
              <td><strong>In-Context Adaptation</strong></td>
              <td>Trained synaptic weights</td>
              <td>Recurrent state, no weight updates at inference</td>
              <td>Recurrent state only</td>
            </tr>
            <tr>
              <td><strong>Inference-Time Parameter Updates</strong></td>
              <td>No</td>
              <td>No</td>
              <td>No</td>
            </tr>
            <tr>
              <td><strong>Recurrent State Structure</strong></td>
              <td>Yes (synapses)</td>
              <td>Yes ($S$)</td>
              <td>Yes (S ∈ ℝ^(d×d), dense matrix)</td>
            </tr>
            <tr>
              <td><strong>What It Does Not Capture</strong></td>
              <td>Sparsity, training, scale</td>
              <td>The actual proprietary $U_\theta$ function</td>
              <td>Non-linearity, learned structure, trained parameters</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="callout-card" style={{ marginTop: "24px" }}>
        <h4>What Our Demo Captures vs. What It Does Not</h4>
        <p>
          <strong>What our demo captures:</strong> The complete computation of our own educational toy
          model, which instantiates the additive special case named in BDH-CQ §3.2 (
          <code>{"S_t = S_{t-1} + U_θ(D_t)"}</code> where <code>{"U_θ(D_t) = v_t k_tᵀ"}</code>).
        </p>
        <p>
          <strong>What it does not capture:</strong> BDH-CQ’s learned $U_\theta$, its training procedure,
          deep architecture, sparsity, nonlinearities, scale, or empirical ARC-AGI performance.
          Our model is 100% transparent to us; BDH-CQ’s $U_\theta$ is proprietary.
        </p>
      </div>
    </section>
  );
};
