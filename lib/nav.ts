export interface NavLeaf {
  href: string;
  en: string;
  th: string;
}

export interface NavSection {
  href: string;
  icon: string;
  en: string;
  th: string;
  descEn: string;
  descTh: string;
  items?: NavLeaf[];
}

export const NAV: NavSection[] = [
  {
    href: "/electrical-circuit",
    icon: "zap",
    en: "Electrical Circuit",
    th: "วงจรไฟฟ้า",
    descEn: "DC and AC circuit calculations",
    descTh: "คำนวณวงจรไฟฟ้ากระแสตรงและสลับเบื้องต้น",
  },
  {
    href: "/electronics",
    icon: "cpu-chip-02",
    en: "Electronics",
    th: "อิเล็กทรอนิกส์",
    descEn: "Diode, rectifier and component calculations",
    descTh: "คำนวณไดโอด วงจรเรียงกระแส และอุปกรณ์อิเล็กทรอนิกส์",
    items: [
      {
        href: "/electronics/bridge-rectifier",
        en: "Bridge Rectifier",
        th: "บริดจ์เรกติไฟเออร์",
      },
    ],
  },
  {
    href: "/power-system",
    icon: "power-03",
    en: "Power System",
    th: "ระบบไฟฟ้ากำลัง",
    descEn: "Three-phase, transformer and load calculations",
    descTh: "คำนวณระบบ 3 เฟส หม้อแปลง และโหลด",
  },
];

export const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);
