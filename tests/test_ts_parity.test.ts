import { describe, it, expect } from "vitest";
import { LinearMemory } from "../web/src/memory/linear_memory";
import * as fs from "fs";
import * as path from "path";

describe("Root test_ts_parity contract test", () => {
  const expectedPath = path.resolve(__dirname, "../experiments/expected_results.json");
  const fixturesPath = path.resolve(__dirname, "../experiments/fixtures.json");
  const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));
  const fixtures = JSON.parse(fs.readFileSync(fixturesPath, "utf-8"));

  it("ensures TS twin matches Python expected_results.json", () => {
    const hook = fixtures.hook_demo;
    const mem = new LinearMemory(hook.d);

    for (let i = 0; i < hook.symbols.length; i++) {
      const sym = hook.symbols[i];
      mem.write(hook.codebook[sym], hook.values[sym], sym);
    }

    const predGreen = mem.readScalar(hook.codebook["green"]);
    expect(predGreen).toBeCloseTo(expected.hook_green_prediction, 9);
    expect(predGreen).toBeCloseTo(3.0, 9);

    const interf = fixtures.interference_demo;
    const memInterf = new LinearMemory(interf.d);
    memInterf.write(interf.key_a, interf.value_a);
    memInterf.write(interf.key_b, interf.value_b);

    const predA = memInterf.readScalar(interf.key_a);
    expect(predA).toBeCloseTo(expected.interference_blended_prediction, 9);
    expect(predA).toBeCloseTo(6.4, 9);
  });
});
