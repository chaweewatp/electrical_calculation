"use client";

import { useState } from "react";
import Link from "next/link";
import { InputField } from "@pea-ds/react/input";
import { Select } from "@pea-ds/react/select";
import { Button } from "@pea-ds/react/button";
import { Badge } from "@pea-ds/react/badge";
import { ResultCard } from "@/components/result-card";
import {
  voltageDrop,
  getConductorSize,
  CONDUCTOR_SIZES,
  type ConductorMaterial,
  type SystemType,
  type VoltageDropResult,
} from "@/lib/voltage-drop";

type InputMode = "current" | "power";

interface FormValues {
  systemType: SystemType;
  nominalVoltage: string;
  material: ConductorMaterial;
  areaMm2: string;
  inputMode: InputMode;
  loadValue: string;
  lengthM: string;
  powerFactor: string;
  reactance: string;
  limitPercent: string;
}

const NOMINAL: Record<SystemType, string> = { "1ph": "220", "3ph": "380" };
const DEFAULT_AREA: Record<ConductorMaterial, string> = {
  copper: "6",
  aluminum: "16",
};

const DEFAULTS: FormValues = {
  systemType: "1ph",
  nominalVoltage: "220",
  material: "copper",
  areaMm2: "6",
  inputMode: "current",
  loadValue: "20",
  lengthM: "30",
  powerFactor: "1",
  reactance: "0.08",
  limitPercent: "5",
};

const num = (value: string) => {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

const volts = (n: number) => `${n.toFixed(3)} V`;

export default function VoltageDropPage() {
  const [form, setForm] = useState<FormValues>(DEFAULTS);
  const [result, setResult] = useState<VoltageDropResult | null>(null);

  const set = (key: keyof FormValues) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const sizes = CONDUCTOR_SIZES[form.material].map((s) => ({
    value: String(s.areaMm2),
    label: `${s.areaMm2} mm²`,
  }));

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setResult(
      voltageDrop({
        systemType: form.systemType,
        nominalVoltage: num(form.nominalVoltage),
        material: form.material,
        areaMm2: num(form.areaMm2),
        load:
          form.inputMode === "current"
            ? { mode: "current", current: num(form.loadValue) }
            : { mode: "power", powerKw: num(form.loadValue) },
        lengthM: num(form.lengthM),
        powerFactor: num(form.powerFactor),
        reactanceOhmPerKm: num(form.reactance),
        limitPercent: num(form.limitPercent),
      }),
    );
  };

  const r = result;
  const conductor = getConductorSize(form.material, num(form.areaMm2));
  const sinPhi = Math.sqrt(1 - Math.min(1, num(form.powerFactor)) ** 2);

  return (
    <div className="mx-auto w-full max-w-5xl px-[var(--pea-space-6)] py-[var(--pea-space-10)]">
      <nav className="mb-[var(--pea-space-6)] flex items-center gap-[var(--pea-space-2)] text-[length:var(--pea-font-size-text-sm)] text-[var(--pea-text-tertiary)]">
        <Link href="/power-system" className="hover:text-[var(--pea-text-brand-secondary)]">
          Power System
        </Link>
        <span className="icon chevron-right" />
        <span className="text-[var(--pea-text-secondary)]">Voltage Drop (LV)</span>
      </nav>

      <header className="mb-[var(--pea-space-8)]">
        <Badge type="badge-modern" color="brand" label="PEA Lumina" />
        <h1 className="mt-[var(--pea-space-3)] text-[length:var(--pea-font-size-display-xs)] font-[var(--pea-font-weight-bold)]">
          คำนวณแรงดันตกในระบบแรงต่ำ
        </h1>
        <p className="mt-[var(--pea-space-2)] text-[length:var(--pea-font-size-text-md)] text-[var(--pea-text-secondary)]">
          Voltage drop ของสายไฟฟ้าแรงต่ำ Vd = K × I × L × (R·cosφ + X·sinφ)
          พร้อมตรวจสอบเกณฑ์ไม่เกิน 5% ตามมาตรฐานการไฟฟ้าส่วนภูมิภาค
        </p>
      </header>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-[var(--pea-space-5)] md:grid-cols-2">
          <Select
            label="ระบบไฟฟ้า"
            size="md"
            value={form.systemType}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                systemType: value as SystemType,
                nominalVoltage: NOMINAL[value as SystemType],
              }))
            }
            options={[
              { value: "1ph", label: "1 เฟส 2 สาย (220 V)" },
              { value: "3ph", label: "3 เฟส 4 สาย (380 V)" },
            ]}
          />
          <InputField
            label="แรงดันพิกัด"
            hint="V (แก้ไขได้)"
            size="md"
            value={form.nominalVoltage}
            onChange={set("nominalVoltage")}
            inputMode="decimal"
          />
          <Select
            label="คำนวณจาก"
            size="md"
            value={form.inputMode}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                inputMode: value as InputMode,
                loadValue: value === "current" ? "20" : "10",
              }))
            }
            options={[
              { value: "current", label: "กระแส (A)" },
              { value: "power", label: "กำลังไฟฟ้า (kW)" },
            ]}
          />
          <InputField
            label={form.inputMode === "current" ? "กระแสโหลด" : "กำลังไฟฟ้าโหลด"}
            hint={form.inputMode === "current" ? "I (A)" : "P (kW)"}
            size="md"
            value={form.loadValue}
            onChange={set("loadValue")}
            inputMode="decimal"
          />
          <Select
            label="วัสดุตัวนำ"
            size="md"
            value={form.material}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                material: value as ConductorMaterial,
                areaMm2: DEFAULT_AREA[value as ConductorMaterial],
              }))
            }
            options={[
              { value: "copper", label: "ทองแดง (Cu)" },
              { value: "aluminum", label: "อะลูมิเนียม (Al)" },
            ]}
          />
          <Select
            label="ขนาดสายไฟฟ้า"
            size="md"
            value={form.areaMm2}
            onChange={set("areaMm2")}
            options={sizes}
          />
          <InputField
            label="ความยาวสาย"
            hint="L (m)"
            size="md"
            value={form.lengthM}
            onChange={set("lengthM")}
            inputMode="decimal"
          />
          <InputField
            label="ตัวประกอบกำลัง (power factor)"
            hint="cosφ (0-1)"
            size="md"
            value={form.powerFactor}
            onChange={set("powerFactor")}
            inputMode="decimal"
          />
          <InputField
            label="รีแอกแตนซ์สาย"
            hint="X (Ω/km) ค่าปกติ 0.08"
            size="md"
            value={form.reactance}
            onChange={set("reactance")}
            inputMode="decimal"
          />
          <Select
            label="เกณฑ์แรงดันตกที่ยอมรับได้"
            size="md"
            value={form.limitPercent}
            onChange={set("limitPercent")}
            options={[
              { value: "3", label: "3 %" },
              { value: "5", label: "5 % (มาตรฐาน กฟภ.)" },
            ]}
          />
        </div>

        <div className="mt-[var(--pea-space-6)] flex gap-[var(--pea-space-3)]">
          <Button type="submit" variant="primary" size="md">
            คำนวณ
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => {
              setForm(DEFAULTS);
              setResult(null);
            }}
          >
            ล้างค่า
          </Button>
        </div>
      </form>

      {r ? (
        <section className="mt-[var(--pea-space-10)]">
          <div className="mb-[var(--pea-space-4)] flex items-center gap-[var(--pea-space-3)]">
            <h2 className="text-[length:var(--pea-font-size-text-xl)] font-[var(--pea-font-weight-semibold)]">
              ผลลัพธ์
            </h2>
            <Badge
              type="badge-color"
              color={r.isWithinLimit ? "success" : "error"}
              label={r.isWithinLimit ? "ผ่านเกณฑ์" : "เกินเกณฑ์"}
            />
          </div>

          <div className="grid grid-cols-1 gap-[var(--pea-space-4)] sm:grid-cols-2 lg:grid-cols-3">
            <ResultCard
              label="แรงดันตก Vd"
              value={volts(r.dropVolts)}
              hint={`เทียบกับเกณฑ์ ${r.limitPercent}%`}
              highlight
            />
            <ResultCard
              label="แรงดันตก (%)"
              value={`${r.dropPercent.toFixed(2)} %`}
              hint="Vd / V × 100"
            />
            <ResultCard
              label="แรงดันที่ปลายสาย"
              value={volts(r.voltageAtLoad)}
              hint="V − Vd"
            />
            <ResultCard
              label="กระแสโหลด"
              value={`${r.current.toFixed(2)} A`}
              hint={form.inputMode === "power" ? "คำนวณจากกำลังไฟฟ้า" : "ค่าที่ป้อน"}
            />
            <ResultCard
              label="ความต้านทานตัวนำ R"
              value={`${r.resistanceOhmPerKm} Ω/km`}
              hint={`IEC 60228 @20°C · ${form.material === "copper" ? "Cu" : "Al"}`}
            />
            <ResultCard
              label="ค่า K ของระบบ"
              value={r.dropCoefficient === 2 ? "2" : "√3"}
              hint={form.systemType === "1ph" ? "1 เฟส 2 สาย" : "3 เฟส"}
            />
          </div>

          <h3 className="mb-[var(--pea-space-3)] mt-[var(--pea-space-8)] text-[length:var(--pea-font-size-text-lg)] font-[var(--pea-font-weight-semibold)]">
            ขั้นตอนการคำนวณ
          </h3>
          <ol className="list-decimal space-y-[var(--pea-space-2)] pl-[var(--pea-space-6)] text-[length:var(--pea-font-size-text-md)] text-[var(--pea-text-secondary)]">
            {form.inputMode === "power" ? (
              <li>
                I = P×1000 / ({form.systemType === "1ph" ? "1" : "√3"} ×{" "}
                {num(form.nominalVoltage)} × {num(form.powerFactor)}) ={" "}
                {r.current.toFixed(2)} A
              </li>
            ) : (
              <li>I = {num(form.loadValue)} A</li>
            )}
            <li>
              R = {r.resistanceOhmPerKm} Ω/km, X = {r.reactanceOhmPerKm} Ω/km,
              cosφ = {num(form.powerFactor)}, sinφ = {sinPhi.toFixed(3)}
            </li>
            <li>
              Vd = {r.dropCoefficient === 2 ? "2" : "√3"} ×{" "}
              {r.current.toFixed(2)} × ({num(form.lengthM)}/1000) × (
              {r.resistanceOhmPerKm}×{num(form.powerFactor)} +{" "}
              {r.reactanceOhmPerKm}×{sinPhi.toFixed(3)}) = {volts(r.dropVolts)}
            </li>
            <li>
              Vd% = {volts(r.dropVolts)} / {num(form.nominalVoltage)} × 100 ={" "}
              {r.dropPercent.toFixed(2)} %
            </li>
            <li>
              V(ปลายสาย) = {num(form.nominalVoltage)} − {volts(r.dropVolts)} ={" "}
              {volts(r.voltageAtLoad)}
            </li>
          </ol>
          <p className="mt-[var(--pea-space-4)] text-[length:var(--pea-font-size-text-xs)] text-[var(--pea-text-tertiary)]">
            หมายเหตุ: ค่า R อ้างอิง IEC 60228 ที่ 20°C ขนาดสายที่เลือก {conductor.areaMm2} mm²
            ยังไม่รวมการปรับค่าตามอุณหภูมิและโหลดแบบกระจาย
          </p>
        </section>
      ) : null}
    </div>
  );
}
