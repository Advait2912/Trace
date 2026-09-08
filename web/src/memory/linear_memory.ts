/**
 * TRACE: Linear Recurrent Memory Core (TypeScript Twin)
 * ====================================================
 * 
 * Verified exact equivalent of core/linear_memory.py.
 * Single mathematical contract tested against experiments/expected_results.json.
 * 
 * Primary Source:
 * BDH-CQ (Engdahl, Kosowski, Chorowski, Stamirowska et al., 2026, arXiv:2608.09888), §3.2:
 * Instantiates the additive special case S_t = S_{t-1} + v_t k_t^T.
 * 
 * Explicit Non-Claim:
 * This educational toy model does not reconstruct BDH-CQ's proprietary U_θ function.
 */

export interface WriteStep {
  label: string;
  scalarValue: number;
  key: number[];
  stateSnapshot: number[][];
}

export class LinearMemory {
  readonly d: number;
  state: number[][];
  carrier: number[];
  writeHistory: WriteStep[] = [];

  constructor(d: number, carrier?: number[]) {
    if (d < 1) {
      throw new Error(`Dimension d must be >= 1, got ${d}`);
    }
    this.d = d;
    this.state = Array.from({ length: d }, () => Array(d).fill(0));

    if (carrier && carrier.length === d) {
      const norm = Math.hypot(...carrier);
      this.carrier = carrier.map((x) => x / norm);
    } else {
      const c = Array(d).fill(1);
      const norm = Math.hypot(...c);
      this.carrier = c.map((x) => x / norm);
    }
  }

  reset(): void {
    this.state = Array.from({ length: this.d }, () => Array(this.d).fill(0));
    this.writeHistory = [];
  }

  encodeScalarValue(val: number): number[] {
    return this.carrier.map((c) => c * val);
  }

  decodeScalarValue(vec: number[]): number {
    return vec.reduce((sum, v, i) => sum + v * this.carrier[i], 0);
  }

  write(key: number[], value: number | number[], label?: string): number[][] {
    if (key.length !== this.d) {
      throw new Error(`Key dimension ${key.length} does not match state dimension ${this.d}`);
    }

    let v: number[];
    let scalarVal: number;

    if (typeof value === "number") {
      v = this.encodeScalarValue(value);
      scalarVal = value;
    } else {
      if (value.length !== this.d) {
        throw new Error(`Value dimension ${value.length} does not match state dimension ${this.d}`);
      }
      v = value;
      scalarVal = this.decodeScalarValue(v);
    }

    // Outer product update: S_t = S_{t-1} + v k^T
    for (let r = 0; r < this.d; r++) {
      for (let c = 0; c < this.d; c++) {
        this.state[r][c] += v[r] * key[c];
      }
    }

    this.writeHistory.push({
      label: label || `step_${this.writeHistory.length}`,
      scalarValue: scalarVal,
      key: [...key],
      stateSnapshot: this.state.map((row) => [...row]),
    });

    return this.state.map((row) => [...row]);
  }

  read(kQuery: number[]): number[] {
    if (kQuery.length !== this.d) {
      throw new Error(`Query key dimension ${kQuery.length} does not match state dimension ${this.d}`);
    }

    let denom = 0;
    for (let i = 0; i < this.d; i++) {
      denom += kQuery[i] * kQuery[i];
    }
    if (denom === 0) {
      throw new Error("Query key norm is zero.");
    }

    // S * kQuery
    const numer: number[] = Array(this.d).fill(0);
    for (let r = 0; r < this.d; r++) {
      let sum = 0;
      for (let c = 0; c < this.d; c++) {
        sum += this.state[r][c] * kQuery[c];
      }
      numer[r] = sum;
    }

    return numer.map((val) => val / denom);
  }

  readScalar(kQuery: number[]): number {
    const vec = this.read(kQuery);
    return this.decodeScalarValue(vec);
  }

  static interferenceScore(kTarget: number[], kInterferer: number[]): number {
    let dot = 0;
    let denom = 0;
    for (let i = 0; i < kTarget.length; i++) {
      dot += kTarget[i] * kInterferer[i];
      denom += kTarget[i] * kTarget[i];
    }
    if (denom === 0) {
      throw new Error("Target key norm is zero.");
    }
    return dot / denom;
  }
}

/**
 * Deterministic PRNG (Mulberry32)
 */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Standard Normal N(0, 1) generator via Box-Muller transform
 */
function nextGaussian(rng: () => number): number {
  let u1 = 0;
  let u2 = 0;
  while (u1 === 0) u1 = rng();
  while (u2 === 0) u2 = rng();
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

/**
 * Constructs a codebook mapping symbols to unit key vectors in R^d:
 * - If symbols.length <= d: constructs an orthonormal codebook via Gram-Schmidt QR decomposition.
 *   Zero cross-key interference by construction (k_i · k_j = 0 for all i != j).
 * - If symbols.length > d: constructs random unit vectors on S^(d-1).
 *   Vectors are forced to overlap because exact orthogonality is impossible in R^d.
 */
export function buildCodebook(
  symbols: string[],
  d: number,
  seed: number = 42
): Record<string, number[]> {
  const numSymbols = symbols.length;
  const rng = mulberry32(seed);
  const codebook: Record<string, number[]> = {};

  if (numSymbols <= d) {
    // Generate d linearly independent gaussian column vectors in R^d
    const rawCols: number[][] = [];
    for (let c = 0; c < d; c++) {
      const col: number[] = [];
      for (let r = 0; r < d; r++) {
        col.push(nextGaussian(rng));
      }
      rawCols.push(col);
    }

    // Gram-Schmidt orthonormalization
    const qCols: number[][] = [];
    for (let c = 0; c < d; c++) {
      const v = [...rawCols[c]];
      for (let prev = 0; prev < c; prev++) {
        const dot = v.reduce((sum, val, idx) => sum + val * qCols[prev][idx], 0);
        for (let r = 0; r < d; r++) {
          v[r] -= dot * qCols[prev][r];
        }
      }
      const norm = Math.hypot(...v);
      const qCol = v.map((val) => val / (norm || 1));
      qCols.push(qCol);
    }

    for (let i = 0; i < numSymbols; i++) {
      codebook[symbols[i]] = qCols[i];
    }
  } else {
    // Over capacity: random unit vectors on S^(d-1)
    for (let i = 0; i < numSymbols; i++) {
      const raw: number[] = [];
      for (let r = 0; r < d; r++) {
        raw.push(nextGaussian(rng));
      }
      const norm = Math.hypot(...raw);
      codebook[symbols[i]] = raw.map((val) => val / (norm || 1));
    }
  }

  return codebook;
}
