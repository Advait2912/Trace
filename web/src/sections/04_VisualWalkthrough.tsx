import React, { useState } from "react";
import { StateGrid } from "../components/StateGrid";

interface VisualWalkthroughProps {
  fixtures: any;
}

export const VisualWalkthroughSection: React.FC<VisualWalkthroughProps> = ({ fixtures }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const hook = fixtures?.hook_demo;
  if (!hook) return null;

  const states: number[][][] = hook.states; // [S0, S1, S2, S3]
  const stepsInfo = [
    {
      title: "State S₀: Blank Initialization",
      desc: "Before any demonstration arrives, all 9 matrix entries are zero.",
      write: null,
    },
    {
      title: "State S₁: Absorbing Demonstration 1",
      desc: "Demonstration 'red → 1' is written via v₁ ⊗ k_redᵀ.",
      write: "red → 1.0",
    },
    {
      title: "State S₂: Absorbing Demonstration 2",
      desc: "Demonstration 'blue → 2' is accumulated into S₁.",
      write: "blue → 2.0",
    },
    {
      title: "State S₃: Absorbing Demonstration 3",
      desc: "Demonstration 'green → 3' is accumulated into S₂. Memory is now fully populated.",
      write: "green → 3.0",
    },
  ];

  // Compute delta from previous step
  const delta =
    currentStep > 0
      ? states[currentStep].map((row, r) =>
          row.map((val, c) => val - states[currentStep - 1][r][c])
        )
      : undefined;

  return (
    <section id="section-04-walkthrough" className="essay-section">
      <div className="section-eyebrow">04 / Visual Walkthrough</div>
      <h2 className="section-title">Watch It Learn: Step by Step</h2>

      <p className="lead-paragraph">
        This is not a pre-recorded animation. Each step renders the actual mathematical matrix
        computed by the recurrent model during sequential demonstration absorption.
      </p>

      {/* Stepper Timeline */}
      <div className="walkthrough-timeline">
        {stepsInfo.map((step, idx) => (
          <button
            key={idx}
            className={`timeline-step-btn ${currentStep === idx ? "active" : ""}`}
            onClick={() => setCurrentStep(idx)}
          >
            <span className="step-num">Step {idx}</span>
            <span className="step-title">{idx === 0 ? "S₀" : step.write}</span>
          </button>
        ))}
      </div>

      <div className="grid-2-col" style={{ marginTop: "20px" }}>
        <div className="prose-column">
          <div className="step-card">
            <h3>{stepsInfo[currentStep].title}</h3>
            <p>{stepsInfo[currentStep].desc}</p>
            {stepsInfo[currentStep].write && (
              <div className="step-badge">
                Demonstration Written: <strong>{stepsInfo[currentStep].write}</strong>
              </div>
            )}
          </div>

          <div className="callout-card" style={{ marginTop: "16px" }}>
            <h4>Invariant Check</h4>
            <p>
              Notice that the total dimensions of the matrix remain strictly <strong>3 × 3</strong>.
              Whether 1, 3, or 100 demonstrations arrive, the state never grows in memory.
            </p>
          </div>

          <div className="timeline-nav-buttons" style={{ marginTop: "20px" }}>
            <button
              className="btn secondary"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            >
              ← Previous Step
            </button>
            <button
              className="btn primary"
              disabled={currentStep === stepsInfo.length - 1}
              onClick={() => setCurrentStep((prev) => Math.min(stepsInfo.length - 1, prev + 1))}
            >
              Next Step →
            </button>
          </div>
        </div>

        <div className="visual-column">
          <StateGrid
            state={states[currentStep]}
            label={`Recurrent State S_${currentStep}`}
            sublabel={
              currentStep === 0
                ? "Initial empty memory state"
                : `Accumulated after step ${currentStep} (${stepsInfo[currentStep].write})`
            }
            delta={delta}
          />
        </div>
      </div>
    </section>
  );
};
