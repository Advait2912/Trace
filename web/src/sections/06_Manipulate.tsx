import React, { useState, useMemo } from "react";
import { LinearMemory, buildCodebook } from "../memory/linear_memory";
import { StateGrid } from "../components/StateGrid";

interface Demonstration {
  id: string;
  symbol: string;
  value: number;
}

export const ManipulateSection: React.FC = () => {
  const [d, setD] = useState<number>(3);
  const [demos, setDemos] = useState<Demonstration[]>([
    { id: "1", symbol: "alpha", value: 1.5 },
    { id: "2", symbol: "beta", value: 3.0 },
    { id: "3", symbol: "gamma", value: 4.5 },
  ]);
  const [newSymbol, setNewSymbol] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [querySymbol, setQuerySymbol] = useState<string>("alpha");

  // Build deterministic codebook for current symbols and dimension d
  const { codebook, memory, predictions } = useMemo(() => {
    const symbols = demos.map((d) => d.symbol);
    const cb = buildCodebook(symbols, d, 42);

    const mem = new LinearMemory(d);
    for (const item of demos) {
      if (cb[item.symbol]) {
        mem.write(cb[item.symbol], item.value, item.symbol);
      }
    }

    const preds: Record<string, number> = {};
    for (const item of demos) {
      if (cb[item.symbol]) {
        preds[item.symbol] = mem.readScalar(cb[item.symbol]);
      }
    }

    return { codebook: cb, memory: mem, predictions: preds };
  }, [d, demos]);

  const handleAddDemo = () => {
    if (!newSymbol.trim() || isNaN(parseFloat(newValue))) return;
    const cleanSym = newSymbol.trim().toLowerCase();
    if (demos.some((d) => d.symbol === cleanSym)) return;

    setDemos((prev) => [
      ...prev,
      { id: Date.now().toString(), symbol: cleanSym, value: parseFloat(newValue) },
    ]);
    setNewSymbol("");
    setNewValue("");
  };

  const handleDeleteDemo = (id: string) => {
    setDemos((prev) => prev.filter((d) => d.id !== id));
  };

  const handleValueChange = (id: string, val: number) => {
    setDemos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: val } : item))
    );
  };

  const currentQueryKey = codebook[querySymbol];
  const queryPrediction = currentQueryKey ? memory.readScalar(currentQueryKey) : null;
  const currentDemo = demos.find((d) => d.symbol === querySymbol);
  const queryGroundTruth = currentDemo ? currentDemo.value : null;

  return (
    <section id="section-06-manipulate" className="essay-section">
      <div className="section-eyebrow">06 / Live Simulation Sandbox</div>
      <h2 className="section-title">Direct Manipulation: Capacity vs. Sequence Length</h2>

      <p className="lead-paragraph">
        Test the mathematical boundaries. Adjust the capacity dimension <em>d</em>, modify values,
        or add more demonstrations than dimensions to observe when interference begins.
      </p>

      {/* Control Panel */}
      <div className="controls-panel">
        <div className="control-group">
          <label className="control-label">
            State Dimension Capacity (<em>d</em>): <strong>{d}</strong>
          </label>
          <input
            type="range"
            min={2}
            max={6}
            value={d}
            onChange={(e) => setD(parseInt(e.target.value))}
            className="slider"
          />
          <span className="control-help">
            State matrix holds {d} × {d} = {d * d} float parameters.
            {demos.length > d ? (
              <span className="warning-text">
                {" "}⚠️ Demonstrations ({demos.length}) &gt; capacity ({d}): keys forced to overlap!
              </span>
            ) : (
              <span className="success-text">
                {" "}✓ Demonstrations ({demos.length}) ≤ capacity ({d}): orthogonal allocation possible.
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="grid-2-col" style={{ marginTop: "24px" }}>
        <div className="prose-column">
          <h3>Demonstration Sequence</h3>
          <div className="demo-list">
            {demos.map((demo) => {
              const pred = predictions[demo.symbol];
              const err = Math.abs(pred - demo.value);

              return (
                <div key={demo.id} className="demo-row-card">
                  <div className="demo-info">
                    <span className="demo-sym">{demo.symbol}</span>
                    <input
                      type="number"
                      step="0.5"
                      value={demo.value}
                      onChange={(e) =>
                        handleValueChange(demo.id, parseFloat(e.target.value) || 0)
                      }
                      className="inline-input"
                    />
                  </div>

                  <div className="demo-metrics">
                    <span className="metric-tag">
                      Pred: <strong>{pred !== undefined ? pred.toFixed(2) : "--"}</strong>
                    </span>
                    <span
                      className={`error-tag ${err > 0.05 ? "high-error" : "zero-error"}`}
                    >
                      Err: {err.toFixed(2)}
                    </span>
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDeleteDemo(demo.id)}
                      title="Remove demonstration"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="add-demo-row">
            <input
              type="text"
              placeholder="Key symbol (e.g. delta)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="input-text"
            />
            <input
              type="number"
              placeholder="Value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="input-number-small"
            />
            <button className="btn secondary" onClick={handleAddDemo}>
              + Add Write
            </button>
          </div>

          <div className="query-inspector-card" style={{ marginTop: "20px" }}>
            <h4>Query Live Probe</h4>
            <div className="selector-row">
              <label>Probe Symbol:</label>
              <select
                value={querySymbol}
                onChange={(e) => setQuerySymbol(e.target.value)}
                className="select-styled"
              >
                {demos.map((d) => (
                  <option key={d.symbol} value={d.symbol}>
                    {d.symbol}
                  </option>
                ))}
              </select>
            </div>

            {queryPrediction !== null && queryGroundTruth !== null && (
              <div className="probe-result-row">
                <span>
                  Prediction: <strong>{queryPrediction.toFixed(3)}</strong>
                </span>
                <span>
                  Ground Truth: <strong>{queryGroundTruth.toFixed(3)}</strong>
                </span>
                <span>
                  Residual:{" "}
                  <strong>{Math.abs(queryPrediction - queryGroundTruth).toFixed(3)}</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="visual-column">
          <StateGrid
            state={memory.state}
            label={`Live Recurrent State (${d} × ${d})`}
            sublabel={`Recomputed in real-time across ${demos.length} demonstration updates.`}
          />
        </div>
      </div>
    </section>
  );
};
