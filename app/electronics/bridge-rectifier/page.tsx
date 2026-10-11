"use client";

import { useState } from "react";
import Link from "next/link";
import { InputField } from "@pea-ds/react/input";
import { Button } from "@pea-ds/react/button";
import { Badge } from "@pea-ds/react/badge";
import { ResultCard } from "@/components/result-card";
import { bridgeRectifier, type BridgeRectifierResult } from "@/lib/rectifier";

interface FormValues {
  vrms: string;
  diodeDrop: string;
  loadCurrent: string;
  frequency: string;
  capacitance: string;
}

const DEFAULTS: FormValues = {
  vrms: "12",
  diodeDrop: "0.7",
  loadCurrent: "1",
  frequency: "50",
  capacitance: "1000",
};

const num = (value: string) => {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

const volts = (n: number) => `${n.toFixed(3)} V`;

export default function BridgeRectifierPage() {
  const [form, setForm] = useState<FormValues>(DEFAULTS);
  const [result, setResult] = useState<BridgeRectifierResult | null>(null);

  const set = (key: keyof FormValues) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setResult(
      bridgeRectifier({
        vrms: num(form.vrms),
        diodeDrop: num(form.diodeDrop),
        loadCurrent: num(form.loadCurrent),
        frequency: num(form.frequency),
        capacitance: num(form.capacitance) * 1e-6,
      }),
    );
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-[var(--pea-space-6)] py-[var(--pea-space-10)]">
      <nav className="mb-[var(--pea-space-6)] flex items-center gap-[var(--pea-space-2)] text-[length:var(--pea-font-size-text-sm)] text-[var(--pea-text-tertiary)]">
        <Link href="/electronics" className="hover:text-[var(--pea-text-brand-secondary)]">
          Electronics
        </Link>
        <span className="icon chevron-right" />
        <span className="text-[var(--pea-text-secondary)]">Bridge Rectifier</span>
      </nav>

      <header className="mb-[var(--pea-space-8)]">
        <Badge type="badge-modern" color="brand" label="PEA Lumina" />
        <h1 className="mt-[var(--pea-space-3)] text-[length:var(--pea-font-size-display-xs)] font-[var(--pea-font-weight-bold)]">
          คำนวณแรงดันขาออกวงจรบริดจ์เรกติไฟเออร์
        </h1>
        <p className="mt-[var(--pea-space-2)] text-[length:var(--pea-font-size-text-md)] text-[var(--pea-text-secondary)]">
          วงจรเรียงกระแสเต็มคลื่นแบบบริดจ์ (full-wave bridge rectifier)
          ป้อนแรงดัน RMS ด้านทุติยภูมิ เพื่อหาค่าแรงดันดีซี ริปเปิล และ PIV
        </p>
      </header>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-[var(--pea-space-5)] md:grid-cols-2">
          <InputField
            label="แรงดัน RMS ด้านทุติยภูมิ"
            hint="Vrms (V)"
            size="md"
            value={form.vrms}
            onChange={set("vrms")}
            inputMode="decimal"
          />
          <InputField
            label="แรงดันตกคร่อมไดโอดต่อตัว"
            hint="Vf (V) ปกติ 0.7"
            size="md"
            value={form.diodeDrop}
            onChange={set("diodeDrop")}
            inputMode="decimal"
          />
          <InputField
            label="กระแสโหลด"
            hint="IL (A)"
            size="md"
            value={form.loadCurrent}
            onChange={set("loadCurrent")}
            inputMode="decimal"
          />
          <InputField
            label="ความถี่แหล่งจ่าย"
            hint="f (Hz)"
            size="md"
            value={form.frequency}
            onChange={set("frequency")}
            inputMode="decimal"
          />
          <InputField
            label="ตัวเก็บประจุฟิลเตอร์"
            hint="C (µF) ใส่ 0 ถ้าไม่มีตัวเก็บประจุ"
            size="md"
            value={form.capacitance}
            onChange={set("capacitance")}
            inputMode="decimal"
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

      {result ? (
        <section className="mt-[var(--pea-space-10)]">
          <h2 className="mb-[var(--pea-space-4)] text-[length:var(--pea-font-size-text-xl)] font-[var(--pea-font-weight-semibold)]">
            ผลลัพธ์
          </h2>
          <div className="grid grid-cols-1 gap-[var(--pea-space-4)] sm:grid-cols-2 lg:grid-cols-3">
            <ResultCard
              label="แรงดันสูงสุด Vpeak"
              value={volts(result.peakVoltage)}
              hint="√2 × Vrms"
            />
            <ResultCard
              label="Vpeak หลังหักไดโอด"
              value={volts(result.peakAfterDiodes)}
              hint="Vpeak − 2Vf"
            />
            <ResultCard
              label="Vdc เฉลี่ย (ไม่มี C)"
              value={volts(result.dcNoFilter)}
              hint="2 × Vpeak / π"
            />
            <ResultCard
              label="Vdc เฉลี่ย (มี C)"
              value={volts(result.dcWithFilter)}
              hint="Vpeak − Vripple/2"
              highlight
            />
            <ResultCard
              label="แรงดันริปเปิล Vpp"
              value={volts(result.ripplePkPk)}
              hint={`I / (2f·C), f_ripple = ${result.rippleFrequency} Hz`}
            />
            <ResultCard
              label="ริปเปิล RMS"
              value={volts(result.rmsRipple)}
              hint="Vpp / (2√3)"
            />
            <ResultCard
              label="เปอร์เซ็นต์ริปเปิล"
              value={`${result.ripplePercent.toFixed(2)} %`}
              hint="Vpp / Vdc × 100"
            />
            <ResultCard
              label="PIV ต่อไดโอด"
              value={volts(result.piv)}
              hint="แรงดันย้อนกลับสูงสุด Vpeak − Vf"
            />
          </div>

          <h3 className="mb-[var(--pea-space-3)] mt-[var(--pea-space-8)] text-[length:var(--pea-font-size-text-lg)] font-[var(--pea-font-weight-semibold)]">
            ขั้นตอนการคำนวณ
          </h3>
          <ol className="list-decimal space-y-[var(--pea-space-2)] pl-[var(--pea-space-6)] text-[length:var(--pea-font-size-text-md)] text-[var(--pea-text-secondary)]">
            <li>
              Vpeak = √2 × {num(form.vrms)} = {volts(result.peakVoltage)}
            </li>
            <li>
              Vpeak(โหลด) = {volts(result.peakVoltage)} − 2×
              {num(form.diodeDrop)} = {volts(result.peakAfterDiodes)}
            </li>
            <li>
              Vdc = 2 × {volts(result.peakAfterDiodes)} / π ={" "}
              {volts(result.dcNoFilter)}
            </li>
            <li>
              Vripple = {num(form.loadCurrent)} / (2 × {num(form.frequency)} ×{" "}
              {num(form.capacitance)}µF) = {volts(result.ripplePkPk)}
            </li>
            <li>
              Vdc(มี C) = {volts(result.peakAfterDiodes)} −{" "}
              {volts(result.ripplePkPk / 2)} = {volts(result.dcWithFilter)}
            </li>
          </ol>
        </section>
      ) : null}
    </div>
  );
}
