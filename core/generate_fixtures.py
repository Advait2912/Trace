"""
TRACE: Golden Fixtures Generator
Generates experiments/fixtures.json and experiments/expected_results.json
Frozen single source of truth for all tests and web app verification.
"""

import json
import os
import numpy as np
from core.linear_memory import LinearMemory, build_codebook


def generate_all_fixtures():
    os.makedirs("experiments", exist_ok=True)
    os.makedirs("fixtures", exist_ok=True)

    # -------------------------------------------------------------
    # 1. Hook / Orthonormal Demo (d=3)
    # -------------------------------------------------------------
    d_hook = 3
    symbols_hook = ["red", "blue", "green"]
    values_hook = {"red": 1.0, "blue": 2.0, "green": 3.0}
    codebook_hook = build_codebook(symbols_hook, d=d_hook, seed=42)

    mem_hook = LinearMemory(d=d_hook)
    states_hook = [mem_hook.state.tolist()]  # S_0

    for s in symbols_hook:
        k = np.array(codebook_hook[s])
        v = values_hook[s]
        mem_hook.write(k, v, label=s)
        states_hook.append(mem_hook.state.tolist())

    readout_green = mem_hook.read_scalar(np.array(codebook_hook["green"]))
    readout_red = mem_hook.read_scalar(np.array(codebook_hook["red"]))
    readout_blue = mem_hook.read_scalar(np.array(codebook_hook["blue"]))

    hook_fixture = {
        "d": d_hook,
        "symbols": symbols_hook,
        "values": values_hook,
        "codebook": codebook_hook,
        "states": states_hook,
        "queries": {
            "green": {"ground_truth": 3.0, "prediction": float(readout_green), "error": 0.0},
            "red": {"ground_truth": 1.0, "prediction": float(readout_red), "error": 0.0},
            "blue": {"ground_truth": 2.0, "prediction": float(readout_blue), "error": 0.0},
        },
        "interference_matrix": [
            [LinearMemory.interference_score(np.array(codebook_hook[s1]), np.array(codebook_hook[s2]))
             for s2 in symbols_hook]
            for s1 in symbols_hook
        ]
    }

    # -------------------------------------------------------------
    # 2. Interference: Overlapping Keys Demo (d=2)
    # -------------------------------------------------------------
    d_interf = 2
    # Two non-orthogonal keys
    key_a = [1.0, 0.0]
    key_b = [0.6, 0.8]  # unit vector, dot product with key_a = 0.6
    leak_ab = LinearMemory.interference_score(np.array(key_a), np.array(key_b))  # 0.6

    mem_interf = LinearMemory(d=d_interf)
    s0_interf = mem_interf.state.tolist()

    # Step 1: write key_A -> 1.0
    mem_interf.write(np.array(key_a), 1.0, label="key_A")
    s1_interf = mem_interf.state.tolist()

    # Readout after step 1
    pred_a_step1 = mem_interf.read_scalar(np.array(key_a))

    # Step 2: write key_B -> 9.0
    mem_interf.write(np.array(key_b), 9.0, label="key_B")
    s2_interf = mem_interf.state.tolist()

    # Readout after step 2 (blended output)
    pred_a_step2 = mem_interf.read_scalar(np.array(key_a))
    pred_b_step2 = mem_interf.read_scalar(np.array(key_b))

    interference_fixture = {
        "d": d_interf,
        "key_a": key_a,
        "key_b": key_b,
        "value_a": 1.0,
        "value_b": 9.0,
        "leak_coefficient": float(leak_ab),
        "states": [s0_interf, s1_interf, s2_interf],
        "step1": {
            "query_a": {"ground_truth": 1.0, "prediction": float(pred_a_step1), "leaked": 0.0}
        },
        "step2": {
            "query_a": {
                "ground_truth": 1.0,
                "prediction": float(pred_a_step2),
                "leaked_fraction_of_b": float(leak_ab * 9.0),
                "formula": "1.0 + leak_coeff * 9.0"
            },
            "query_b": {
                "ground_truth": 9.0,
                "prediction": float(pred_b_step2)
            }
        }
    }

    # -------------------------------------------------------------
    # 3. Capacity Sweep: d in [2, 3, 4, 5, 6] for 4 symbols
    # -------------------------------------------------------------
    symbols_sweep = ["red", "blue", "green", "yellow"]
    values_sweep = {"red": 1.0, "blue": 2.0, "green": 3.0, "yellow": 4.0}
    capacity_results = {}

    for d in [2, 3, 4, 5, 6]:
        cb = build_codebook(symbols_sweep, d=d, seed=100)
        mem = LinearMemory(d=d)
        for s in symbols_sweep:
            mem.write(np.array(cb[s]), values_sweep[s], label=s)

        preds = {s: float(mem.read_scalar(np.array(cb[s]))) for s in symbols_sweep}
        errors = {s: abs(preds[s] - values_sweep[s]) for s in symbols_sweep}
        mse = float(np.mean([err**2 for err in errors.values()]))

        # Max off-diagonal dot product
        max_overlap = 0.0
        for i in range(len(symbols_sweep)):
            for j in range(i + 1, len(symbols_sweep)):
                dot_prod = abs(float(np.dot(cb[symbols_sweep[i]], cb[symbols_sweep[j]])))
                if dot_prod > max_overlap:
                    max_overlap = dot_prod

        capacity_results[str(d)] = {
            "d": d,
            "can_be_orthonormal": d >= len(symbols_sweep),
            "max_cross_key_overlap": float(max_overlap),
            "predictions": preds,
            "mean_squared_error": float(mse)
        }

    # -------------------------------------------------------------
    # Combine into artifacts
    # -------------------------------------------------------------
    fixtures_data = {
        "description": "TRACE Golden Fixtures for In-Context Learning with Recurrent Memory",
        "spec": "Linear associative memory S_t = S_{t-1} + v_t k_t^T",
        "hook_demo": hook_fixture,
        "interference_demo": interference_fixture,
        "capacity_sweep": capacity_results,
    }

    expected_results_data = {
        "hook_green_prediction": hook_fixture["queries"]["green"]["prediction"],
        "hook_green_ground_truth": 3.0,
        "interference_leak_coefficient": interference_fixture["leak_coefficient"],
        "interference_blended_prediction": interference_fixture["step2"]["query_a"]["prediction"],
        "interference_expected_blend": 1.0 + 0.6 * 9.0,
        "capacity_mse_d2": capacity_results["2"]["mean_squared_error"],
        "capacity_mse_d4": capacity_results["4"]["mean_squared_error"],
        "is_d4_zero_error": capacity_results["4"]["mean_squared_error"] < 1e-12,
    }

    with open("experiments/fixtures.json", "w") as f:
        json.dump(fixtures_data, f, indent=2)
    with open("fixtures/fixtures.json", "w") as f:
        json.dump(fixtures_data, f, indent=2)

    with open("experiments/expected_results.json", "w") as f:
        json.dump(expected_results_data, f, indent=2)
    with open("fixtures/expected_results.json", "w") as f:
        json.dump(expected_results_data, f, indent=2)

    print("Successfully generated experiments/fixtures.json and expected_results.json")


if __name__ == "__main__":
    generate_all_fixtures()
