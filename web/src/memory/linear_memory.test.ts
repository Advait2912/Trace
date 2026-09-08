import { describe, it, expect } from "vitest";
import { LinearMemory } from "./linear_memory";
import * as fs from "fs";
import * as path from "path";

describe("LinearMemory TypeScript Twin Parity Test", () => {
  const fixturesPath = path.resolve(__dirname, "../../../experiments/fixtures.json");
  const expectedPath = path.resolve(__dirname, "../../../experiments/expected_results.json");

  const fixtures = JSON.parse(fs.readFileSync(fixturesPath, "utf-8"));
  const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));

  it("reproduces Hook Demo exact state snapshots and green prediction", () => {
    const hook = fixtures.hook_demo;
    const mem = new LinearMemory(hook.d);

    // Initial state S_0
    expect(mem.state).toEqual(hook.states[0]);

    for (let i = 0; i < hook.symbols.length; i++) {
      const sym = hook.symbols[i];
      const key = hook.codebook[sym];
      const val = hook.values[sym];
      const stateAfter = mem.write(key, val, sym);

      // Verify element-by-element match with Python golden state snapshot
      const goldenState = hook.states[i + 1];
      for (let r = 0; r < hook.d; r++) {
        for (let c = 0; c < hook.d; c++) {
          expect(stateAfter[r][c]).toBeCloseTo(goldenState[r][c], 9);
        }
      }
    }

    // Readout green
    const predGreen = mem.readScalar(hook.codebook["green"]);
    expect(predGreen).toBeCloseTo(expected.hook_green_prediction, 9);
    expect(predGreen).toBeCloseTo(expected.hook_green_ground_truth, 9);
  });

  it("reproduces Interference Overlapping Keys Demo leak and blended output", () => {
    const interf = fixtures.interference_demo;
    const mem = new LinearMemory(interf.d);

    const leakScore = LinearMemory.interferenceScore(interf.key_a, interf.key_b);
    expect(leakScore).toBeCloseTo(expected.interference_leak_coefficient, 9);

    // Step 1: Write A
    mem.write(interf.key_a, interf.value_a, "key_A");
    const predA1 = mem.readScalar(interf.key_a);
    expect(predA1).toBeCloseTo(interf.step1.query_a.prediction, 9);

    // Step 2: Write B
    mem.write(interf.key_b, interf.value_b, "key_B");
    const predA2 = mem.readScalar(interf.key_a);
    expect(predA2).toBeCloseTo(expected.interference_blended_prediction, 9);
    expect(predA2).toBeCloseTo(expected.interference_expected_blend, 9);
  });

  it("verifies contract: analytical leak formula matches empirical blend", () => {
    const interf = fixtures.interference_demo;
    const leak = expected.interference_leak_coefficient;
    const theoreticalBlend = interf.value_a + leak * interf.value_b;
    expect(expected.interference_blended_prediction).toBeCloseTo(theoreticalBlend, 9);
  });
});
