import React, { useState } from "react";
import { LinearMemory } from "../memory/linear_memory";

interface PredictCompareProps {
  fixtures: any;
}

export const PredictThenCompareSection: React.FC<PredictCompareProps> = ({ fixtures }) => {
  const hook = fixtures?.hook_demo;
  const [selectedSymbol, setSelectedSymbol] = useState<string>("green");
  const [userGuess, setUserGuess] = useState<string>("");
  const [revealed, setRevealed] = useState<boolean>(false);

  if (!hook) return null;

  // Build memory from hook data
  const mem = new LinearMemory(hook.d);
  for (const s of hook.symbols) {
    mem.write(hook.codebook[s], hook.values[s], s);
  }

  const handleQuery = () => {
    setRevealed(true);
  };

  const keyVector = hook.codebook[selectedSymbol];
  const modelPrediction = mem.readScalar(keyVector);
  const groundTruth = hook.values[selectedSymbol];
  const userGuessNum = parseFloat(userGuess);
  const userDelta = !isNaN(userGuessNum) ? Math.abs(userGuessNum - modelPrediction) : null;

  return (
    <section id="section-05-predict" className="essay-section">
      <div className="section-eyebrow">05 / Active Learning</div>
      <h2 className="section-title">Predict, Then Compare</h2>

      <p className="lead-paragraph">
        Cognitive science confirms that prediction before observation primes deep understanding.
        Select a demonstration key, enter what you expect the recurrent memory to output, and test it.
      </p>

      <div className="predict-card">
        <div className="predict-input-group">
          <div className="field">
            <label>1. Select Query Key:</label>
            <div className="symbol-selector">
              {hook.symbols.map((sym: string) => (
                <button
                  key={sym}
                  className={`sym-btn ${selectedSymbol === sym ? "active" : ""}`}
                  onClick={() => {
                    setSelectedSymbol(sym);
                    setRevealed(false);
                  }}
                >
                  {sym} (wrote {hook.values[sym]})
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>2. Your Expected Output Guess:</label>
            <input
              type="number"
              className="input-number"
              placeholder="e.g. 3.0"
              value={userGuess}
              onChange={(e) => {
                setUserGuess(e.target.value);
                setRevealed(false);
              }}
            />
          </div>

          <button className="btn primary" onClick={handleQuery}>
            Evaluate Prediction Stack
          </button>
        </div>

        {revealed && (
          <div className="comparison-stack-card">
            <h4>Evaluation Stack</h4>
            <div className="stack-grid">
              <div className="stack-item">
                <span className="stack-label">YOUR EXPECTATION</span>
                <span className="stack-val">
                  {userGuess !== "" ? userGuess : "None provided"}
                </span>
                {userDelta !== null && (
                  <span
                    className={`stack-sub ${
                      userDelta < 0.05 ? "success" : "warning"
                    }`}
                  >
                    {userDelta < 0.05 ? "Exact match!" : `Off by ${userDelta.toFixed(2)}`}
                  </span>
                )}
              </div>

              <div className="stack-item">
                <span className="stack-label">ACTUAL STATE RECALL</span>
                <span className="stack-val primary">{modelPrediction.toFixed(2)}</span>
                <span className="stack-sub">Computed via (S<sub>3</sub> &middot; k<sub>{selectedSymbol}</sub>)</span>
              </div>

              <div className="stack-item">
                <span className="stack-label">GROUND TRUTH</span>
                <span className="stack-val success">{groundTruth.toFixed(2)}</span>
                <span className="stack-sub">Original demonstration value</span>
              </div>

              <div className="stack-item">
                <span className="stack-label">RESIDUAL ERROR</span>
                <span className="stack-val neutral">
                  {Math.abs(modelPrediction - groundTruth).toFixed(4)}
                </span>
                <span className="stack-sub">Zero cross-key interference</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
