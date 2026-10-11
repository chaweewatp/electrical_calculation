export type SystemType = "1ph" | "3ph";
export type ConductorMaterial = "copper" | "aluminum";

export interface ConductorSize {
  areaMm2: number;
  rOhmPerKm: number;
}

// IEC 60228 Class 2 conductor DC resistance at 20 °C (Ω/km)
export const CONDUCTOR_SIZES: Record<ConductorMaterial, ConductorSize[]> = {
  copper: [
    { areaMm2: 1.5, rOhmPerKm: 12.1 },
    { areaMm2: 2.5, rOhmPerKm: 7.41 },
    { areaMm2: 4, rOhmPerKm: 4.61 },
    { areaMm2: 6, rOhmPerKm: 3.08 },
    { areaMm2: 10, rOhmPerKm: 1.83 },
    { areaMm2: 16, rOhmPerKm: 1.15 },
    { areaMm2: 25, rOhmPerKm: 0.727 },
    { areaMm2: 35, rOhmPerKm: 0.524 },
    { areaMm2: 50, rOhmPerKm: 0.387 },
    { areaMm2: 70, rOhmPerKm: 0.268 },
    { areaMm2: 95, rOhmPerKm: 0.193 },
    { areaMm2: 120, rOhmPerKm: 0.153 },
    { areaMm2: 150, rOhmPerKm: 0.124 },
    { areaMm2: 185, rOhmPerKm: 0.0991 },
    { areaMm2: 240, rOhmPerKm: 0.0754 },
    { areaMm2: 300, rOhmPerKm: 0.0601 },
    { areaMm2: 400, rOhmPerKm: 0.047 },
    { areaMm2: 500, rOhmPerKm: 0.0366 },
  ],
  aluminum: [
    { areaMm2: 16, rOhmPerKm: 1.91 },
    { areaMm2: 25, rOhmPerKm: 1.2 },
    { areaMm2: 35, rOhmPerKm: 0.868 },
    { areaMm2: 50, rOhmPerKm: 0.641 },
    { areaMm2: 70, rOhmPerKm: 0.443 },
    { areaMm2: 95, rOhmPerKm: 0.32 },
    { areaMm2: 120, rOhmPerKm: 0.253 },
    { areaMm2: 150, rOhmPerKm: 0.206 },
    { areaMm2: 185, rOhmPerKm: 0.164 },
    { areaMm2: 240, rOhmPerKm: 0.125 },
    { areaMm2: 300, rOhmPerKm: 0.1 },
    { areaMm2: 400, rOhmPerKm: 0.0778 },
    { areaMm2: 500, rOhmPerKm: 0.0605 },
  ],
};

export type LoadInput =
  | { mode: "current"; current: number }
  | { mode: "power"; powerKw: number };

export interface VoltageDropInput {
  systemType: SystemType;
  nominalVoltage: number;
  material: ConductorMaterial;
  areaMm2: number;
  load: LoadInput;
  lengthM: number;
  powerFactor: number;
  reactanceOhmPerKm: number;
  limitPercent: number;
}

export interface VoltageDropResult {
  dropCoefficient: number;
  current: number;
  resistanceOhmPerKm: number;
  reactanceOhmPerKm: number;
  dropVolts: number;
  dropPercent: number;
  voltageAtLoad: number;
  limitPercent: number;
  isWithinLimit: boolean;
}

const DROP_COEFFICIENT: Record<SystemType, number> = {
  "1ph": 2,
  "3ph": Math.sqrt(3),
};

const POWER_COEFFICIENT: Record<SystemType, number> = {
  "1ph": 1,
  "3ph": Math.sqrt(3),
};

export function getConductorSize(
  material: ConductorMaterial,
  areaMm2: number,
): ConductorSize {
  return (
    CONDUCTOR_SIZES[material].find((s) => s.areaMm2 === areaMm2) ??
    CONDUCTOR_SIZES[material][0]
  );
}

export function voltageDrop({
  systemType,
  nominalVoltage,
  material,
  areaMm2,
  load,
  lengthM,
  powerFactor,
  reactanceOhmPerKm,
  limitPercent,
}: VoltageDropInput): VoltageDropResult {
  const pf = Math.min(1, Math.max(0, powerFactor));
  const sinPhi = Math.sqrt(1 - pf * pf);
  const kvd = DROP_COEFFICIENT[systemType];
  const kp = POWER_COEFFICIENT[systemType];

  const current =
    load.mode === "current"
      ? load.current
      : (load.powerKw * 1000) / (kp * nominalVoltage * pf || 1);

  const { rOhmPerKm } = getConductorSize(material, areaMm2);
  const dropVolts =
    kvd * current * (lengthM / 1000) * (rOhmPerKm * pf + reactanceOhmPerKm * sinPhi);
  const dropPercent =
    nominalVoltage > 0 ? (dropVolts / nominalVoltage) * 100 : 0;

  return {
    dropCoefficient: kvd,
    current,
    resistanceOhmPerKm: rOhmPerKm,
    reactanceOhmPerKm,
    dropVolts,
    dropPercent,
    voltageAtLoad: nominalVoltage - dropVolts,
    limitPercent,
    isWithinLimit: dropPercent <= limitPercent,
  };
}
