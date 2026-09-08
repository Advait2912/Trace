import React, { useState } from "react";
import { LinearMemory } from "../memory/linear_memory";
import { StateGrid } from "../components/StateGrid";

interface InterferenceSectionProps {
  fixtures: any;
}

export const InterferenceOverlappingKeysSection: React.FC<InterferenceSectionProps> = ({
  fixtures,
}) => {
  const interf = fixtures?.interference_demo;
  const [dotProduct, setDotProduct] = useState<number>(0.6);

  // Compute key_b based on user-adjusted dot product with key_a = [1, 0]
  // k_b = [dot, sqrt(1 - dot^2)]
  const clampedDot = Math.min(Math.max(dotProduct, -0.999), 0.999);
  const keyA = [1.0, 0.0];
  const keyB = [clampedDot, Math.sqrt(1 - clampedDot * clampedDot)];

  const valA = 1.0;
  const valB = 9.0;

  // Run two-step memory update
  const mem = new LinearMemory(2);
  mem.write(keyA, valA, "key_A");
  const stateAfterA = mem.state.map((r) => [...r]);

  mem.write(keyB, valB, "key_B");
  const stateAfterB = mem.state.map((r) => [...r]);

  const predA = mem.readScalar(keyA);
  const leakCoeff = LinearMemory.interferenceScore(keyA, keyB);
  const theoreticalBlend = valA + leakCoeff * valB;

  return (
    <section id="section-07-interference" className="essay-section">
      <div className="section-eyebrow">07 / The Failure Case</div>
      <h2 className="section-title">Interference: Overlapping Keys</h2>

      {/* Critical Conceptual Distinction Banner */}
      <div className="callout-card distinction-banner">
        <h4>Critical Distinction: Conflicting Overwrite vs. Geometric Interference</h4>
        <p>
          Writing <code>red → 9</code> after <code>red → 1</code> with the <em>identical key</em> is merely
          an overwrite. It does not test memory compression.
        </p>
        <p>
          <strong>True representational interference</strong> occurs when two <em>distinct</em> keys
          share an overlapping subspace ($k_A \cdot k_B \neq 0$). Because the recurrent state $S$ is an
          additive accumulator, reading out one demonstration inevitably captures a projection of the other.
        </p>
      </div>

      <div className="interference-experiment-panel">
        <div className="panel-controls">
          <label>
            Geometric Overlap ($k_A \cdot k_B$): <strong>{dotProduct.toFixed(2)}</strong>
            <span className="sub-label">
              ({(Math.acos(clampedDot) * (180 / Math.PI)).toFixed(1)}° angle between key vectors)
            </span>
          </label>
          <input
            type="range"
            min="0.0"
            max="0.95"
            step="0.05"
            value={dotProduct}
            onChange={(e) => setDotProduct(parseFloat(e.target.value))}
            className="slider"
          />
        </div>

        <div className="leak-equation-box">
          <div className="eq-lead">Derived Leakage Equation:</div>
          <div className="eq-formula">
            <code>
              {"ŷ_A = (S₂ · k_A) / (k_A · k_A) = v_A + [(k_A · k_B) / (k_A · k_A)] v_B"}
            </code>
          </div>
          <div className="eq-substitution">
            <code>
              ŷ_A = {valA.toFixed(1)} + ({leakCoeff.toFixed(2)}) × {valB.toFixed(1)} ={" "}
              <strong>{theoreticalBlend.toFixed(2)}</strong>
            </code>
          </div>
        </div>
      </div>

      <div className="grid-2-col" style={{ marginTop: "24px" }}>
        <div className="prose-column">
          <div className="metric-comparison-card">
            <h4>Live Readout of key_A (Target: {valA.toFixed(1)})</h4>
            <div className="metric-row">
              <span className="metric-label">Actual Model Output:</span>
              <span className="metric-val warning">{predA.toFixed(3)}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Intended Ground Truth (v_A):</span>
              <span className="metric-val success">{valA.toFixed(3)}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Leaked Fraction of key_B (v_B=9.0):</span>
              <span className="metric-val danger">
                +{(leakCoeff * valB).toFixed(3)} (leak coeff = {leakCoeff.toFixed(3)})
              </span>
            </div>
          </div>

          <p style={{ marginTop: "16px" }}>
            When the dot product is exactly <code>0.00</code> (keys are orthogonal), leakage vanishes
            and readout returns <code>1.00</code>.
          </p>
          <p>
            As overlap increases, the fixed 2×2 state cannot untangle the linear combinations,
            producing a blended superposition.
          </p>
        </div>

        <div className="visual-column">
          <StateGrid
            state={stateAfterB}
            label="Superposed State S₂ after writing key_B"
            sublabel="Both rank-1 outer products now inhabit the same 2×2 coordinate space."
          />
        </div>
      </div>
    </section>
  );
};
