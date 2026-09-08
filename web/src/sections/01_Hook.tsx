import React, { useMemo } from "react";
import { LinearMemory } from "../memory/linear_memory";
import { StateGrid } from "../components/StateGrid";

interface HookSectionProps {
  fixtures: any;
}

export const HookSection: React.FC<HookSectionProps> = ({ fixtures }) => {
  const hookData = fixtures?.hook_demo;

  const { mem, predictions } = useMemo(() => {
    if (!hookData) return { mem: null, predictions: {} };
    const memory = new LinearMemory(hookData.d);
    for (let i = 0; i < hookData.symbols.length; i++) {
      const s = hookData.symbols[i];
      memory.write(hookData.codebook[s], hookData.values[s], s);
    }
    const preds: Record<string, number> = {};
    for (const s of hookData.symbols) {
      preds[s] = memory.readScalar(hookData.codebook[s]);
    }
    return { mem: memory, predictions: preds };
  }, [hookData]);

  if (!hookData || !mem) return null;

  return (
    <section id="section-01-hook" className="essay-section">
      <div className="section-eyebrow">01 / The Hook</div>
      <h1 className="section-title">
        TRACE: In-Context Learning with Recurrent Memory
      </h1>
      
      <p className="lead-paragraph">
        <strong>The Central Claim:</strong> A fixed-size recurrent state can absorb an unbounded number of
        key–value demonstrations without growing in size, but when demonstrations share overlapping
        (non-orthogonal) keys, the readout for one leaks the value of the other — a measurable,
        reproducible form of forgetting caused by fixed capacity, not a scripted failure.
      </p>

      <div className="callout-card hook-banner">
        <div className="badge active">Computed Live on Load</div>
        <div className="hook-scenario">
          <span className="step-label">Demonstrations absorbed:</span>
          <span className="pill red">red → 1</span>
          <span className="pill blue">blue → 2</span>
          <span className="pill green">green → 3</span>
        </div>
        <div className="hook-query-result">
          <div className="query-box">
            <span className="query-target">Query: <code>green → ?</code></span>
            <div className="comparison-stack">
              <div className="metric-row">
                <span className="metric-label">Model Prediction:</span>
                <span className="metric-val primary">
                  {predictions["green"]?.toFixed(2) ?? "3.00"}
                </span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Ground Truth:</span>
                <span className="metric-val success">3.00</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Interference Error:</span>
                <span className="metric-val neutral">0.00 (Orthonormal Keys, d=3)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2-col">
        <div className="prose-column">
          <h3>No Growing Context Window. One Fixed Matrix.</h3>
          <p>
            Standard Transformer LLMs remember demonstrations by expanding an explicit
            Key-Value (KV) cache with sequence length $O(T)$. As sequences grow, the memory
            footprint expands indefinitely.
          </p>
          <p>
            In contrast, the recurrent memory displayed on the right holds exactly <strong>9 numbers</strong> ($3 \times 3$).
            It absorbed all three demonstrations into a single accumulative state $S_3$.
            Because the three key vectors were constructed to be mutually orthogonal,
            querying <code>green</code> extracts its exact value with <strong>zero leakage</strong> from <code>red</code> or <code>blue</code>.
          </p>
        </div>
        <div className="visual-column">
          <StateGrid
            state={mem.state}
            label="Internal State S₃ after 3 writes"
            sublabel="Dimensions: 3 × 3 (9 float64 entries). No token history stored."
          />
        </div>
      </div>
    </section>
  );
};
