import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClientChart } from "@/components/charts/client-chart";
import { CHART, tooltipStyle } from "@/components/charts/theme";
import { KpiCard } from "@/components/kpi-card";
import { MonthRail } from "@/components/month-rail";
import { PageHeader } from "@/components/page-header";
import { RankTable } from "@/components/rank-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardHint, CardTitle } from "@/components/ui/card";
import {
  buildInsights,
  computeKpis,
  groupBy,
  monthlySeries,
  monthsOf,
} from "@/lib/analytics";
import { COMPANY } from "@/lib/company";
import { faNum, formatPctPlain } from "@/lib/format";
import { formatMonth, formatMonthShort } from "@/lib/jalali";
import { INSTALL_BASE, ppmByProduct, ppmSeries } from "@/lib/ppm";
import { compareMonthOf } from "@/lib/store";
import { ALL_MONTHS } from "@/lib/types";
import { useView } from "@/lib/use-view";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { filtered, rows, month, setMonth, filters } = useView();
  const months = monthsOf(filtered);
  const k = computeKpis(filtered, month, compareMonthOf(month));
  const insights = buildInsights(rows);
  const series = monthlySeries(filtered);
  const products = groupBy(rows, (r) => r.product);
  const causes = groupBy(rows, (r) => r.cause).slice(0, 8);
  const topProduct = products[0];
  const showDelta = month !== ALL_MONTHS;
  const productFilter = filters.product;
  const ppmMonths = monthsOf(filtered);
  const seriesPpm = ppmSeries(filtered, ppmMonths, productFilter);
  const activePpm =
    month === ALL_MONTHS ? seriesPpm[seriesPpm.length - 1] : seriesPpm.find((p) => p.month === month);
  const prevKey = month === ALL_MONTHS ? seriesPpm.at(-2)?.month : compareMonthOf(month);
  const prevPpm = seriesPpm.find((p) => p.month === prevKey)?.ppm ?? null;
  const ppmDelta =
    activePpm?.ppm != null && prevPpm != null && prevPpm !== 0
      ? ((activePpm.ppm - prevPpm) / prevPpm) * 100
      : undefined;
  const productPpm = month === ALL_MONTHS ? [] : ppmByProduct(filtered.filter((r) => r.month === month), month);

  return (
    <div>
      <PageHeader kicker="میز فرمان گارانتی" title="خلاصه خدمات پس از فروش">
        <p className="max-w-sm text-xs leading-relaxed text-fg-muted">
          {COMPANY.legal} · {month === ALL_MONTHS ? COMPANY.periodLabel : formatMonth(month)} ·{" "}
          {faNum(rows.length, 0)} رکورد تعمیر · نرخ = پذیرش ماه ÷ نصب ۱۲ ماه قبل × ۱٬۰۰۰٬۰۰۰
        </p>
      </PageHeader>

      <MonthRail months={months} selected={month} onSelect={setMonth} />

      <section className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard
          label="کل مراجعات"
          value={faNum(k.visits, 0)}
          delta={showDelta ? k.visitDelta : undefined}
          hint={`${faNum(k.products, 0)} نوع دستگاه / ${faNum(k.models, 0)} مدل`}
        />
        <KpiCard
          label="مراجعه تکراری"
          value={faNum(k.repeats, 0)}
          hint={`سهم ${formatPctPlain(k.repeatShare, 0)} از کل`}
        />
        <KpiCard
          label="پرتکرارترین دستگاه"
          value={topProduct?.name ?? "—"}
          hint={topProduct ? `${faNum(topProduct.count, 0)} مورد — ${formatPctPlain(topProduct.share, 0)}` : undefined}
        />
        <KpiCard
          label={month === ALL_MONTHS ? "PPM آخرین ماه" : "PPM ماه"}
          value={activePpm?.ppm != null ? faNum(activePpm.ppm, 0) : "—"}
          delta={ppmDelta}
          invert
          hint={
            activePpm
              ? `${faNum(activePpm.visits, 0)} پذیرش / ${faNum(activePpm.installed, 0)} نصب ۱۲ماه قبل`
              : "پنجره نصب موجود نیست"
          }
        />
      </section>

      <section className="mt-5 grid gap-3 lg:grid-cols-2">
        {insights.map((ins) => (
          <article
            key={ins.title}
            className="rounded-lg bg-bg-elevated p-4 shadow-[var(--shadow-border)]"
          >
            <div className="mb-2 flex items-center gap-2">
              <Badge
                tone={
                  ins.tone === "good"
                    ? "good"
                    : ins.tone === "bad"
                      ? "bad"
                      : ins.tone === "warn"
                        ? "warn"
                        : "muted"
                }
              >
                {ins.tone === "good"
                  ? "مثبت"
                  : ins.tone === "bad"
                    ? "هشدار"
                    : ins.tone === "warn"
                      ? "توجه"
                      : "یادداشت"}
              </Badge>
              <h2 className="text-sm font-medium">{ins.title}</h2>
            </div>
            <p className="text-sm leading-7 text-fg-muted">{ins.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-3 xl:grid-cols-5">
        <Card className="rounded-lg p-4 xl:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>نرخ خرابی ماهانه (PPM)</CardTitle>
              <CardHint>پذیرش ماه تقسیم بر نصب ۱۲ ماه قبل، ضربدر یک میلیون</CardHint>
            </div>
          </CardHeader>
          <ClientChart>
            <div className="h-[260px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={seriesPpm}>
                  <CartesianGrid stroke={CHART.grid} vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={formatMonthShort}
                    tick={{ fill: CHART.tick, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis yAxisId="p" tick={{ fill: CHART.tick, fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v, name) => [
                      faNum(Number(v), 0),
                      name === "ppm" ? "PPM" : name === "visits" ? "پذیرش" : "نصب",
                    ]}
                    labelFormatter={(l) => formatMonth(String(l))}
                  />
                  <Bar yAxisId="p" dataKey="ppm" fill={CHART[1]} radius={[3, 3, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ClientChart>
        </Card>
        <Card className="rounded-lg p-4 xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>PPM به تفکیک محصول</CardTitle>
              <CardHint>
                {month === ALL_MONTHS ? "یک ماه را انتخاب کنید" : formatMonth(month)}
              </CardHint>
            </div>
          </CardHeader>
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-fg-muted">
                <tr>
                  <th className="py-1 text-right font-medium">محصول</th>
                  <th className="py-1 text-left font-medium">پذیرش</th>
                  <th className="py-1 text-left font-medium">نصب</th>
                  <th className="py-1 text-left font-medium">PPM</th>
                </tr>
              </thead>
              <tbody>
                {productPpm.map((p) => (
                  <tr key={p.product} className="border-t border-border">
                    <td className="py-1.5">{p.product}</td>
                    <td className="py-1.5 text-left tabular">{faNum(p.visits, 0)}</td>
                    <td className="py-1.5 text-left tabular">{faNum(p.installed, 0)}</td>
                    <td className="py-1.5 text-left tabular">{p.ppm == null ? "—" : faNum(p.ppm, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] leading-5 text-fg-subtle">{INSTALL_BASE.note}</p>
        </Card>
      </section>

      <section className="mt-5 grid gap-3 xl:grid-cols-5">
        <Card className="rounded-lg p-4 xl:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>روند ماهانه مراجعات</CardTitle>
              <CardHint>تعداد پذیرش در هر ماه شمسی</CardHint>
            </div>
          </CardHeader>
          <ClientChart>
            <div className="h-[260px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series}>
                  <CartesianGrid stroke={CHART.grid} vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={formatMonthShort}
                    tick={{ fill: CHART.tick, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fill: CHART.tick, fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v, name) => [
                      faNum(Number(v), 0),
                      name === "visits" ? "مراجعه" : "تکراری",
                    ]}
                    labelFormatter={(l) => formatMonth(String(l))}
                  />
                  <Bar dataKey="visits" fill={CHART[1]} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ClientChart>
        </Card>
        <Card className="rounded-lg p-4 xl:col-span-2">
          <CardHeader>
            <CardTitle>توزیع دستگاه</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/devices">جزئیات</Link>
            </Button>
          </CardHeader>
          <RankTable rows={products} nameLabel="دستگاه" />
        </Card>
      </section>

      <Card className="mt-5 rounded-lg p-4">
        <CardHeader>
          <CardTitle>علت‌های پرتکرار</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/causes">همه علت‌ها</Link>
          </Button>
        </CardHeader>
        <RankTable rows={causes} nameLabel="دسته علت" />
      </Card>
    </div>
  );
}
