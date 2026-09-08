import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LinearMemory, buildCodebook } from "../web/src/memory/linear_memory.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.resolve(__dirname, "../experiments/fixtures.json");
const expectedPath = path.resolve(__dirname, "../experiments/expected_results.json");

const fixtures = JSON.parse(fs.readFileSync(fixturesPath, "utf-8"));
const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));

function assertClose(actual, expectedVal, tol = 1e-9, msg = "") {
  const diff = Math.abs(actual - expectedVal);
  assert.ok(
    diff <= tol,
    `${msg} Expected ${expectedVal}, got ${actual} (diff ${diff} > ${tol})`
  );
}

test("TypeScript Twin: Hook Demo exact reproduction", () => {
  const hook = fixtures.hook_demo;
  const mem = new LinearMemory(hook.d);

  // S_0
  assert.deepEqual(mem.state, hook.states[0]);

  for (let i = 0; i < hook.symbols.length; i++) {
    const sym = hook.symbols[i];
    const key = hook.codebook[sym];
    const val = hook.values[sym];
    const stateAfter = mem.write(key, val, sym);

    const goldenState = hook.states[i + 1];
    for (let r = 0; r < hook.d; r++) {
      for (let c = 0; c < hook.d; c++) {
        assertClose(stateAfter[r][c], goldenState[r][c], 1e-9, `State [${r},${c}] after step ${sym}`);
      }
    }
  }

  const predGreen = mem.readScalar(hook.codebook["green"]);
  assertClose(predGreen, expected.hook_green_prediction, 1e-9, "Hook green prediction");
  assertClose(predGreen, 3.0, 1e-9, "Hook green ground truth");
});

test("TypeScript Twin: Interference Demo exact reproduction", () => {
  const interf = fixtures.interference_demo;
  const mem = new LinearMemory(interf.d);

  const leak = LinearMemory.interferenceScore(interf.key_a, interf.key_b);
  assertClose(leak, expected.interference_leak_coefficient, 1e-9, "Leak coefficient");

  mem.write(interf.key_a, interf.value_a, "key_A");
  const predA1 = mem.readScalar(interf.key_a);
  assertClose(predA1, interf.step1.query_a.prediction, 1e-9, "Query A after step 1");

  mem.write(interf.key_b, interf.value_b, "key_B");
  const predA2 = mem.readScalar(interf.key_a);
  assertClose(predA2, expected.interference_blended_prediction, 1e-9, "Query A blended prediction");
  assertClose(predA2, 6.4, 1e-9, "Query A theoretical blend");
});

test("TypeScript Twin: Contract verification against expected_results.json", () => {
  assert.equal(expected.is_d4_zero_error, true);
  assert.ok(expected.capacity_mse_d4 < 1e-12);
  assert.ok(expected.capacity_mse_d2 > 1.0);
});

test("TypeScript Twin: buildCodebook constructs orthonormal keys when N <= d", () => {
  const symbols = ["k1", "k2", "k3"];
  const d = 3;
  const cb = buildCodebook(symbols, d, 42);

  // Check unit norm
  for (const sym of symbols) {
    const vec = cb[sym];
    assert.equal(vec.length, d);
    const norm = Math.hypot(...vec);
    assertClose(norm, 1.0, 1e-9, `Unit norm for ${sym}`);
  }

  // Check mutual orthogonality
  for (let i = 0; i < symbols.length; i++) {
    for (let j = i + 1; j < symbols.length; j++) {
      const v1 = cb[symbols[i]];
      const v2 = cb[symbols[j]];
      const dot = v1.reduce((acc, val, idx) => acc + val * v2[idx], 0);
      assertClose(dot, 0.0, 1e-9, `Orthogonality between ${symbols[i]} and ${symbols[j]}`);
    }
  }
});

