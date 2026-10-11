import test from "node:test";
import assert from "node:assert/strict";
import { voltageDrop } from "./voltage-drop.ts";

const close = (a: number, b: number, eps = 1e-3) =>
  assert.ok(Math.abs(a - b) < eps, `expected ${a} ≈ ${b}`);

test("single-phase 220 V, 20 A, 30 m, Cu 6 mm², pf = 1", () => {
  const r = voltageDrop({
    systemType: "1ph",
    nominalVoltage: 220,
    material: "copper",
    areaMm2: 6,
    load: { mode: "current", current: 20 },
    lengthM: 30,
    powerFactor: 1,
    reactanceOhmPerKm: 0.08,
    limitPercent: 5,
  });
  close(r.dropCoefficient, 2);
  close(r.resistanceOhmPerKm, 3.08);
  close(r.dropVolts, 3.696);
  close(r.dropPercent, 1.68);
  close(r.voltageAtLoad, 216.304);
  assert.equal(r.isWithinLimit, true);
});

test("three-phase 380 V, 100 A, 50 m, Cu 25 mm², pf = 1", () => {
  const r = voltageDrop({
    systemType: "3ph",
    nominalVoltage: 380,
    material: "copper",
    areaMm2: 25,
    load: { mode: "current", current: 100 },
    lengthM: 50,
    powerFactor: 1,
    reactanceOhmPerKm: 0.08,
    limitPercent: 5,
  });
  close(r.dropCoefficient, Math.sqrt(3));
  close(r.dropVolts, 6.296, 1e-2);
  close(r.dropPercent, 1.657, 1e-2);
  assert.equal(r.isWithinLimit, true);
});

test("power input converts to current (3ph, 50 kW, 380 V, pf 0.8)", () => {
  const r = voltageDrop({
    systemType: "3ph",
    nominalVoltage: 380,
    material: "copper",
    areaMm2: 25,
    load: { mode: "power", powerKw: 50 },
    lengthM: 50,
    powerFactor: 0.8,
    reactanceOhmPerKm: 0.08,
    limitPercent: 5,
  });
  close(r.current, 94.958, 1e-2);
});

test("reports failure when drop exceeds the limit", () => {
  const r = voltageDrop({
    systemType: "1ph",
    nominalVoltage: 220,
    material: "copper",
    areaMm2: 4,
    load: { mode: "current", current: 60 },
    lengthM: 100,
    powerFactor: 0.8,
    reactanceOhmPerKm: 0.08,
    limitPercent: 5,
  });
  close(r.dropPercent, 20.4, 0.2);
  assert.equal(r.isWithinLimit, false);
});
