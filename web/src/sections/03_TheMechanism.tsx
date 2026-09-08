import React, { useState } from "react";
import { StateGrid } from "../components/StateGrid";

export const TheMechanismSection: React.FC = () => {
  const [step, setStep] = useState<number>(0);

  // d = 3 demonstration step
  // v = [0.577, 0.577, 0.577] * 2.0 (for value 2.0)
  // k = [0.0, 1.0, 0.0]
  const d = 3;
  const val = 2.0;
  const carrier = 1 / Math.sqrt(3); // ~0.577
  const v = [val * carrier, val * carrier, val * carrier];
  const k = [0.0, 1.0, 0.0]; // unit key for 'blue'

  // Outer product v k^T
  const deltaS: number[][] = [
    [0.0, v[0] * k[1], 0.0],
    [0.0, v[1] * k[1], 0.0],
    [0.0, v[2] * k[1], 0.0],
  ];

  // Prior state S_0 (after red -> 1 write)
  const vRed = 1.0 * carrier;
  const kRed = [1.0, 0.0, 0.0];
  const S_prev: number[][] = [
    [vRed, 0.0, 0.0],
    [vRed, 0.0, 0.0],
    [vRed, 0.0, 0.0],
  ];

  // S_curr = S_prev + deltaS
  const S_curr: number[][] = [
    [vRed, deltaS[0][1], 0.0],
    [vRed, deltaS[1][1], 0.0],
    [vRed, deltaS[2][1], 0.0],
  ];

  const displayedState = step === 0 ? S_prev : S_curr;

  return (
    <section id="section-03-mechanism" className="essay-section">
      <div className="section-eyebrow">03 / The Mathematical Mechanism</div>
      <h2 className="section-title">Outer-Product Memory Updates</h2>

      <div className="math-callout">
        <div className="equation-block">
          <div className="eq-line">
            <span className="eq-sym">State:</span>
            <code>S ∈ ℝ^(d×d), S₀ = 0</code>
          </div>
          <div className="eq-line highlight">
            <span className="eq-sym">Update:</span>
            <code>S<sub>t</sub> = S<sub>t-1</sub> + v<sub>t</sub> k<sub>t</sub>ᵀ</code>
            <span className="annotation">(rank-1 outer product write)</span>
          </div>
          <div className="eq-line">
            <span className="eq-sym">Readout:</span>
            <code>ŷ = (S_t · k_query) / (k_query · k_query)</code>
            <span className="annotation">(normalized projection)</span>
          </div>
          <div className="eq-line">
            <span className="eq-sym">Leakage:</span>
            <code>Interference(k_a, k_b) = (k_a · k_b) / (k_a · k_a)</code>
          </div>
        </div>
      </div>

      <div className="interactive-step-controls">
        <span className="controls-label">Interactive Step Animation:</span>
        <button
          className={`btn-step ${step === 0 ? "active" : ""}`}
          onClick={() => setStep(0)}
        >
          1. Prior State (S₁)
        </button>
        <button
          className={`btn-step ${step === 1 ? "active" : ""}`}
          onClick={() => setStep(1)}
        >
          2. Apply Write: blue → 2.0 (+v₂ k₂ᵀ)
        </button>
      </div>

      <div className="grid-3-col mechanism-flow">
        <div className="vector-box">
          <div className="box-title">Value Vector v₂ ∈ ℝ³</div>
          <div className="vector-display">
            {v.map((x, i) => (
              <div key={i} className="vec-elem">
                v[{i}] = {x.toFixed(3)}
              </div>
            ))}
          </div>
          <div className="vector-note">Value 2.0 encoded along carrier</div>
        </div>

        <div className="operator-symbol">⊗</div>

        <div className="vector-box">
          <div className="box-title">Key Vector k₂ᵀ ∈ ℝ³</div>
          <div className="vector-display horizontal">
            {k.map((x, i) => (
              <div key={i} className="vec-elem">
                k[{i}] = {x.toFixed(1)}
              </div>
            ))}
          </div>
          <div className="vector-note">Orthonormal key for &quot;blue&quot;</div>
        </div>
      </div>

      <div className="grid-2-col" style={{ marginTop: "24px" }}>
        <div>
          <h3>Why Normalization Matters</h3>
          <p>
            Notice the denominator <code>(k_query · k_query)</code> in the readout formula.
            When querying the memory, matrix multiplication yields:
          </p>
          <div className="math-proof">
            <code>S_t · k_a = (∑ᵢ vᵢ kᵢᵀ) k_a = ∑ᵢ vᵢ (kᵢ · k_a)</code>
          </div>
          <p>
            Dividing by <code>(k_a · k_a)</code> isolates <code>v_a</code> cleanly whenever all other
            keys are orthogonal (<code>k_i · k_a = 0</code> for <em>i &ne; a</em>).
          </p>
        </div>
        <div>
          <StateGrid
            state={displayedState}
            label={step === 0 ? "S₁ (Before 'blue' write)" : "S₂ (After 'blue' write)"}
            sublabel={
              step === 1
                ? "Column 1 received the outer product contribution v₂ k₂ᵀ"
                : "Only Column 0 is populated from the first demonstration"
            }
            delta={step === 1 ? deltaS : undefined}
          />
        </div>
      </div>
    </section>
  );
};
