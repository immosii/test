import { writeFileSync } from "node:fs";
import pkg from "xlsx";

const XLSX = pkg.default ?? pkg;

function norm(s) {
  return String(s ?? "")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/‌/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function familyOf(raw) {
  const s = norm(raw).toLowerCase();
  if (!s) return "";
  if (s.includes("ظرف")) return "ماشین ظرفشویی";
  if (s.includes("لباس")) return "ماشین لباسشویی";
  if (s.includes("مینی") || s.includes("mini")) return "یخچال مینی";
  if (s.includes("تلویزیون") || s.includes("ال ای دی") || /\bctv\b/.test(s)) return "تلویزیون";
  if (s.includes("ساید") || s.includes("فریزر") || s.includes("یخچال")) return "یخچال سایدبای‌ساید";
  return norm(raw);
}

function monthKeyFromSlash(d) {
  const m = String(d ?? "").match(/^(\d{4})[\/.-](\d{1,2})/);
  if (!m) return "";
  return `${m[1]}-${String(m[2]).padStart(2, "0")}`;
}

function isoDate(d) {
  const m = String(d ?? "").match(/^(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})/);
  if (!m) return "";
  return `${m[1]}-${String(m[2]).padStart(2, "0")}-${String(m[3]).padStart(2, "0")}`;
}

function num(v) {
  const n = Number(String(v ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function ymIndex(key) {
  const [y, m] = key.split("-").map(Number);
  return y * 12 + (m - 1);
}

function indexYm(i) {
  const y = Math.floor(i / 12);
  const m = (i % 12) + 1;
  return `${y}-${String(m).padStart(2, "0")}`;
}

const installWb = XLSX.readFile("/workspace/attachments/نصب-2.XLSX");
const installRows = XLSX.utils.sheet_to_json(installWb.Sheets[installWb.SheetNames[0]], { defval: "" });

/** month -> family -> Set(serialKey) */
const buckets = new Map();
let anon = 0;
let installKept = 0;
for (const r of installRows) {
  const op = norm(r["نوع_عملیات"] || r["نوع_عمليات"]);
  if (!op.includes("نصب")) continue;
  const month = monthKeyFromSlash(r["تاریخ_شمسی_پذیرش"] || r["تاريخ_شمسي_پذيرش"]);
  const product = familyOf(r["نوع_دستگاه"]);
  if (!month || !product) continue;
  let serial = norm(r["شماره_سریال_دستگاه"] || r["شماره_سريال_دستگاه"]);
  if (!serial || serial === "-" || serial === "ندارد") {
    anon += 1;
    serial = `__row${anon}`;
  }
  if (!buckets.has(month)) buckets.set(month, new Map());
  const fam = buckets.get(month);
  if (!fam.has(product)) fam.set(product, new Set());
  fam.get(product).add(serial);
  installKept += 1;
}

const monthsSorted = [...buckets.keys()].sort();
const first = monthsSorted[0];
const last = monthsSorted[monthsSorted.length - 1];

function windowInstalled(target) {
  const end = ymIndex(target);
  const byProduct = {};
  const all = new Set();
  let complete = true;
  for (let i = end - 12; i < end; i++) {
    const key = indexYm(i);
    if (key < first || key > last || !buckets.has(key)) {
      if (key < first || key > last) complete = false;
    }
    const fam = buckets.get(key);
    if (!fam) continue;
    for (const [product, set] of fam) {
      if (!byProduct[product]) byProduct[product] = new Set();
      for (const s of set) {
        byProduct[product].add(s);
        all.add(`${product}::${s}`);
      }
    }
  }
  const counts = {};
  for (const [p, set] of Object.entries(byProduct)) counts[p] = set.size;
  return { all: all.size, byProduct: counts, complete };
}

const serviceWb = XLSX.readFile("/workspace/attachments/خدمات 6 ماهه - بدون ردیف تکرار-2.xlsx");
const serviceRows = XLSX.utils.sheet_to_json(serviceWb.Sheets["داده خام"], { defval: "" });

const MONTH_NAMES = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];

const records = [];
serviceRows.forEach((r, i) => {
  const ticket = norm(r["شماره پذیرش"]);
  if (!ticket) return;
  const product = familyOf(r["نوع محصول"]) || "نامشخص";
  const acceptDate = isoDate(r["تاریخ پذیرش"]);
  const month = /^\d{4}-\d{2}$/.test(norm(r["کد ماه"])) ? norm(r["کد ماه"]) : monthKeyFromSlash(r["تاریخ پذیرش"]);
  const mm = Number(month.slice(5, 7));
  const repeatRaw = norm(r["مراجعه تکراری"]);
  const part = norm(r["قطعه تعویضی"]);
  records.push({
    id: `${ticket}-${i}`,
    ticket,
    monthName: MONTH_NAMES[mm - 1] || norm(r["ماه"]),
    month,
    product,
    model: norm(r["مدل"]) || "—",
    serial: norm(r["شماره سریال"]),
    complaint: norm(r["اظهار مشتری"]),
    failure: norm(r["شرح خرابی"]),
    acceptDate,
    produceDate: isoDate(r["تاریخ تولید"]),
    installDate: isoDate(r["تاریخ نصب"]),
    ageMonths: num(r["مدت مصرف (ماه)"]),
    cause: norm(r["دسته علت خرابی"]) || "سایر",
    part: part === "*" || part === "—" || part === "---" || part === "-" ? "" : part,
    travelPayer: "",
    partCost: 0,
    laborCost: 0,
    totalCost: 0,
    repeat: /بله|تکرار/.test(repeatRaw),
    repeatCost: 0,
  });
});

const serviceMonths = [...new Set(records.map((r) => r.month))].sort();
const byMonth = {};
for (const m of serviceMonths) byMonth[m] = windowInstalled(m);

const visits = {};
for (const r of records) {
  if (!visits[r.month]) visits[r.month] = {};
  visits[r.month][r.product] = (visits[r.month][r.product] || 0) + 1;
}

const audit = serviceMonths.map((m) => {
  const base = byMonth[m];
  const v = Object.values(visits[m] || {}).reduce((a, b) => a + b, 0);
  const ppm = base.all ? Math.round((v / base.all) * 1_000_000) : null;
  const products = Object.keys(visits[m] || {}).sort().map((p) => {
    const inst = base.byProduct[p] || 0;
    const c = visits[m][p];
    return { product: p, visits: c, installed: inst, ppm: inst ? Math.round((c / inst) * 1_000_000) : null };
  });
  return { month: m, visits: v, installed: base.all, complete: base.complete, ppm, products };
});

const base = {
  formula: "PPM = (پذیرش‌های همان ماه / دستگاه‌های نصب‌شده در ۱۲ ماه شمسی قبل از آن ماه) × 1,000,000",
  windowMonths: 12,
  installSpan: [first, last],
  installRows: installKept,
  note: "مخرج، تعداد سریال یکتا در پنجره است. سریال خالی به‌صورت ردیف جدا شمرده شده. پنجره ماه جاری را شامل نمی‌شود.",
  byMonth,
};

writeFileSync("/workspace/src/data/arta-records.json", JSON.stringify(records));
writeFileSync("/workspace/src/data/install-base.json", JSON.stringify(base));
writeFileSync("/workspace/artifacts/ppm-audit.json", JSON.stringify(audit, null, 2));
console.log(JSON.stringify({ records: records.length, installKept, anon, first, last, audit }, null, 2));
