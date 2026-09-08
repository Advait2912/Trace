import React from "react";

interface StateGridProps {
  state: number[][];
  label?: string;
  sublabel?: string;
  delta?: number[][];
  highlightedIndices?: [number, number][];
  onCellClick?: (row: number, col: number, val: number) => void;
  interactive?: boolean;
}

export const StateGrid: React.FC<StateGridProps> = ({
  state,
  label = "Recurrent State Matrix S",
  sublabel,
  delta,
  highlightedIndices = [],
  onCellClick,
  interactive = true,
}) => {
  const d = state.length;

  // Compute max absolute value for dynamic color scaling
  let maxAbs = 0.0001;
  for (let r = 0; r < d; r++) {
    for (let c = 0; c < d; c++) {
      const absVal = Math.abs(state[r][c]);
      if (absVal > maxAbs) maxAbs = absVal;
    }
  }

  const getCellBackground = (val: number) => {
    if (Math.abs(val) < 1e-9) return "#1e242b"; // neutral dark
    const normalized = Math.min(Math.abs(val) / maxAbs, 1.0);
    if (val > 0) {
      // Warm amber/gold for positive values
      return `rgba(235, 140, 52, ${0.15 + normalized * 0.75})`;
    } else {
      // Cool cyan/blue for negative values
      return `rgba(56, 161, 243, ${0.15 + normalized * 0.75})`;
    }
  };

  return (
    <div className="state-grid-container">
      <div className="state-grid-header">
        <span className="state-grid-title">{label}</span>
        <span className="state-grid-dimension">
          Dimension: {d} × {d} ({d * d} scalars)
        </span>
      </div>
      {sublabel && <div className="state-grid-sublabel">{sublabel}</div>}

      <div
        className="state-grid"
        style={{
          gridTemplateColumns: `repeat(${d}, minmax(48px, 1fr))`,
        }}
      >
        {state.map((row, r) =>
          row.map((val, c) => {
            const isHighlighted = highlightedIndices.some(
              ([hr, hc]) => hr === r && hc === c
            );
            const deltaVal = delta ? delta[r][c] : undefined;

            return (
              <div
                key={`${r}-${c}`}
                className={`state-cell ${isHighlighted ? "highlighted" : ""}`}
                style={{
                  backgroundColor: getCellBackground(val),
                }}
                onClick={() => onCellClick?.(r, c, val)}
                title={`S[${r},${c}] = ${val.toFixed(4)}${
                  deltaVal !== undefined
                    ? ` (Δ: ${deltaVal >= 0 ? "+" : ""}${deltaVal.toFixed(4)})`
                    : ""
                }`}
              >
                <div className="cell-coords">
                  {r},{c}
                </div>
                <div className="cell-value">{val.toFixed(2)}</div>
                {deltaVal !== undefined && Math.abs(deltaVal) > 1e-6 && (
                  <div
                    className={`cell-delta ${
                      deltaVal > 0 ? "positive" : "negative"
                    }`}
                  >
                    {deltaVal > 0 ? "+" : ""}
                    {deltaVal.toFixed(2)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="state-grid-footer">
        <div className="legend">
          <span className="legend-chip neg">Negative</span>
          <span className="legend-chip zero">0.00</span>
          <span className="legend-chip pos">Positive</span>
        </div>
        <div className="norm-info">
          Frobenius Norm: ||S||_F ={" "}
          {Math.hypot(...state.flat()).toFixed(3)}
        </div>
      </div>
    </div>
  );
};
