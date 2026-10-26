import installBase from "@/data/install-base.json";
import type { ServiceRow } from "@/lib/types";

export type InstallCell = {
  all: number;
  byProduct: Record<string, number>;
  complete: boolean;
};

type InstallFile = {
  formula: string;
  windowMonths: number;
  installSpan: [string, string];
  installRows: number;
  note: string;
  byMonth: Record<string, InstallCell>;
};

export const INSTALL_BASE = installBase as unknown as InstallFile;

export function installCell(month: string): InstallCell | null {
  return INSTALL_BASE.byMonth[month] ?? null;
}

/** پذیرش ماه ÷ نصب ۱۲ ماه قبل × ۱٬۰۰۰٬۰۰۰ */
export function ppmValue(visits: number, installed: number): number | null {
  if (!installed) return null;
  return (visits / installed) * 1_000_000;
}

export function exposureFor(month: string, product: string | null): { installed: number; complete: boolean } | null {
  const cell = installCell(month);
  if (!cell) return null;
  if (product) return { installed: cell.byProduct[product] ?? 0, complete: cell.complete };
  return { installed: cell.all, complete: cell.complete };
}

export type PpmPoint = {
  month: string;
  visits: number;
  installed: number;
  ppm: number | null;
  complete: boolean;
};

export function ppmSeries(rows: ServiceRow[], months: string[], product: string | null): PpmPoint[] {
  return months.map((month) => {
    const visits = rows.filter((r) => r.month === month).length;
    const exp = exposureFor(month, product);
    const installed = exp?.installed ?? 0;
    return {
      month,
      visits,
      installed,
      ppm: ppmValue(visits, installed),
      complete: exp?.complete ?? false,
    };
  });
}

export function ppmByProduct(rowsInMonth: ServiceRow[], month: string) {
  const cell = installCell(month);
  const counts = new Map<string, number>();
  for (const r of rowsInMonth) counts.set(r.product, (counts.get(r.product) ?? 0) + 1);
  const names = new Set<string>([...counts.keys(), ...Object.keys(cell?.byProduct ?? {})]);
  return [...names]
    .map((product) => {
      const visits = counts.get(product) ?? 0;
      const installed = cell?.byProduct[product] ?? 0;
      return {
        product,
        month,
        visits,
        installed,
        ppm: visits || installed ? ppmValue(visits, installed) : null,
        complete: cell?.complete ?? false,
      };
    })
    .filter((r) => r.visits > 0 || r.installed > 0)
    .sort((a, b) => (b.ppm ?? -1) - (a.ppm ?? -1));
}
