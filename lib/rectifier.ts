export interface BridgeRectifierInput {
  vrms: number;
  diodeDrop: number;
  loadCurrent: number;
  frequency: number;
  capacitance: number;
}

export interface BridgeRectifierResult {
  peakVoltage: number;
  peakAfterDiodes: number;
  dcNoFilter: number;
  rippleFrequency: number;
  ripplePkPk: number;
  rmsRipple: number;
  dcWithFilter: number;
  ripplePercent: number;
  piv: number;
}

export function bridgeRectifier({
  vrms,
  diodeDrop,
  loadCurrent,
  frequency,
  capacitance,
}: BridgeRectifierInput): BridgeRectifierResult {
  const peakVoltage = Math.SQRT2 * vrms;
  const peakAfterDiodes = Math.max(0, peakVoltage - 2 * diodeDrop);
  const dcNoFilter = (2 * peakAfterDiodes) / Math.PI;
  const rippleFrequency = 2 * frequency;
  const ripplePkPk =
    capacitance > 0 ? loadCurrent / (rippleFrequency * capacitance) : 0;
  const rmsRipple = ripplePkPk / (2 * Math.sqrt(3));
  const dcWithFilter =
    capacitance > 0
      ? Math.max(0, peakAfterDiodes - ripplePkPk / 2)
      : dcNoFilter;
  const ripplePercent = dcWithFilter > 0 ? (ripplePkPk / dcWithFilter) * 100 : 0;
  const piv = Math.max(0, peakVoltage - diodeDrop);

  return {
    peakVoltage,
    peakAfterDiodes,
    dcNoFilter,
    rippleFrequency,
    ripplePkPk,
    rmsRipple,
    dcWithFilter,
    ripplePercent,
    piv,
  };
}
