import test from "node:test";
import assert from "node:assert/strict";
import { bridgeRectifier } from "./rectifier.ts";

const close = (a: number, b: number, eps = 1e-3) =>
  assert.ok(Math.abs(a - b) < eps, `expected ${a} ≈ ${b}`);

test("bridge rectifier 12 Vrms, 0.7 V drop, 1 A, 50 Hz, 1000 uF", () => {
  const r = bridgeRectifier({
    vrms: 12,
    diodeDrop: 0.7,
    loadCurrent: 1,
    frequency: 50,
    capacitance: 1000e-6,
  });
  close(r.peakVoltage, 16.9706);
  close(r.peakAfterDiodes, 15.5706);
  close(r.dcNoFilter, 9.9128);
  close(r.rippleFrequency, 100);
  close(r.ripplePkPk, 10);
  close(r.dcWithFilter, 10.5706);
  close(r.piv, 16.2706);
});

test("no capacitor means no smoothing", () => {
  const r = bridgeRectifier({
    vrms: 12,
    diodeDrop: 0.7,
    loadCurrent: 1,
    frequency: 50,
    capacitance: 0,
  });
  close(r.ripplePkPk, 0);
  close(r.dcWithFilter, r.dcNoFilter);
});
