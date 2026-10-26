import { C as toFaDigits, c as cn, f as formatMonth, l as compareMonthOf, m as groupBy, o as buildInsights, p as formatMonthShort, t as COMPANY, u as computeKpis, v as monthlySeries, x as parseMonthKey, y as monthsOf } from "./store-sknedTTk.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as ClientChart, r as tooltipStyle, t as CHART } from "./theme-DZ3tRnO9.mjs";
import { t as Badge } from "./badge-CzT068hg.mjs";
import { a as PageHeader, i as CardTitle, l as formatPctPlain, n as CardHeader, r as CardHint, s as faNum, t as Card } from "./page-header-Dj3IWVVq.mjs";
import { t as KpiCard } from "./kpi-card-CDjl66Ef.mjs";
import { a as XAxis, c as Bar, i as YAxis, l as ResponsiveContainer, n as BarChart, s as CartesianGrid, t as ComposedChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
import { t as useView } from "./use-view-M7ZyehFV.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Button } from "./router-CKR6ibDD.mjs";
import { a as ppmSeries, i as ppmByProduct, n as RankTable, t as INSTALL_BASE } from "./ppm-BzDt1QUc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bqi94df_.js
var import_jsx_runtime = require_jsx_runtime();
function MonthRail({ months, selected, onSelect }) {
	const items = ["all", ...months];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-1 overflow-x-auto pb-1",
		children: items.map((m) => {
			const active = m === selected;
			if (m === "all") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onSelect(m),
				className: cn("flex h-14 min-w-[4.8rem] shrink-0 flex-col items-center justify-center rounded-md px-2 text-center transition-colors duration-150", active ? "bg-bg-ink text-fg-on-ink" : "bg-bg-elevated text-fg-muted shadow-[var(--shadow-border)] hover:text-fg"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-medium",
					children: "کل دوره"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[10px] opacity-70",
					children: [toFaDigits(months.length), " ماه"]
				})]
			}, m);
			const { year } = parseMonthKey(m);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onSelect(m),
				className: cn("flex h-14 min-w-[4.4rem] shrink-0 flex-col items-center justify-center rounded-md px-2 text-center transition-colors duration-150", active ? "bg-bg-ink text-fg-on-ink" : "bg-bg-elevated text-fg-muted shadow-[var(--shadow-border)] hover:text-fg"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-medium",
					children: formatMonthShort(m)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] opacity-70 tabular",
					children: toFaDigits(year)
				})]
			}, m);
		})
	});
}
function Home() {
	const { filtered, rows, month, setMonth, filters } = useView();
	const months = monthsOf(filtered);
	const k = computeKpis(filtered, month, compareMonthOf(month));
	const insights = buildInsights(rows);
	const series = monthlySeries(filtered);
	const products = groupBy(rows, (r) => r.product);
	const causes = groupBy(rows, (r) => r.cause).slice(0, 8);
	const topProduct = products[0];
	const showDelta = month !== "all";
	const productFilter = filters.product;
	const ppmMonths = monthsOf(filtered);
	const seriesPpm = ppmSeries(filtered, ppmMonths, productFilter);
	const activePpm = month === "all" ? seriesPpm[seriesPpm.length - 1] : seriesPpm.find((p) => p.month === month);
	const prevKey = month === "all" ? seriesPpm.at(-2)?.month : compareMonthOf(month);
	const prevPpm = seriesPpm.find((p) => p.month === prevKey)?.ppm ?? null;
	const ppmDelta = activePpm?.ppm != null && prevPpm != null && prevPpm !== 0 ? (activePpm.ppm - prevPpm) / prevPpm * 100 : void 0;
	const productPpm = month === "all" ? [] : ppmByProduct(filtered.filter((r) => r.month === month), month);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "میز فرمان گارانتی",
			title: "خلاصه خدمات پس از فروش",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "max-w-sm text-xs leading-relaxed text-fg-muted",
				children: [
					COMPANY.legal,
					" · ",
					month === "all" ? COMPANY.periodLabel : formatMonth(month),
					" ·",
					" ",
					faNum(rows.length, 0),
					" رکورد تعمیر · نرخ = پذیرش ماه ÷ نصب ۱۲ ماه قبل × ۱٬۰۰۰٬۰۰۰"
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthRail, {
			months,
			selected: month,
			onSelect: setMonth
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "کل مراجعات",
					value: faNum(k.visits, 0),
					delta: showDelta ? k.visitDelta : void 0,
					hint: `${faNum(k.products, 0)} نوع دستگاه / ${faNum(k.models, 0)} مدل`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "مراجعه تکراری",
					value: faNum(k.repeats, 0),
					hint: `سهم ${formatPctPlain(k.repeatShare, 0)} از کل`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "پرتکرارترین دستگاه",
					value: topProduct?.name ?? "—",
					hint: topProduct ? `${faNum(topProduct.count, 0)} مورد — ${formatPctPlain(topProduct.share, 0)}` : void 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: month === "all" ? "PPM آخرین ماه" : "PPM ماه",
					value: activePpm?.ppm != null ? faNum(activePpm.ppm, 0) : "—",
					delta: ppmDelta,
					invert: true,
					hint: activePpm ? `${faNum(activePpm.visits, 0)} پذیرش / ${faNum(activePpm.installed, 0)} نصب ۱۲ماه قبل` : "پنجره نصب موجود نیست"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mt-5 grid gap-3 lg:grid-cols-2",
			children: insights.map((ins) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-lg bg-bg-elevated p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: ins.tone === "good" ? "good" : ins.tone === "bad" ? "bad" : ins.tone === "warn" ? "warn" : "muted",
						children: ins.tone === "good" ? "مثبت" : ins.tone === "bad" ? "هشدار" : ins.tone === "warn" ? "توجه" : "یادداشت"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: ins.title
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-7 text-fg-muted",
					children: ins.body
				})]
			}, ins.title))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-5 grid gap-3 xl:grid-cols-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-lg p-4 xl:col-span-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "نرخ خرابی ماهانه (PPM)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHint, { children: "پذیرش ماه تقسیم بر نصب ۱۲ ماه قبل، ضربدر یک میلیون" })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientChart, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[260px] w-full",
					dir: "ltr",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
							data: seriesPpm,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: CHART.grid,
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									tickFormatter: formatMonthShort,
									tick: {
										fill: CHART.tick,
										fontSize: 11
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									yAxisId: "p",
									tick: {
										fill: CHART.tick,
										fontSize: 11
									},
									axisLine: false,
									tickLine: false,
									width: 36
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: tooltipStyle,
									formatter: (v, name) => [faNum(Number(v), 0), name === "ppm" ? "PPM" : name === "visits" ? "پذیرش" : "نصب"],
									labelFormatter: (l) => formatMonth(String(l))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									yAxisId: "p",
									dataKey: "ppm",
									fill: CHART[1],
									radius: [
										3,
										3,
										0,
										0
									]
								})
							]
						})
					})
				}) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-lg p-4 xl:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "PPM به تفکیک محصول" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHint, { children: month === "all" ? "یک ماه را انتخاب کنید" : formatMonth(month) })] }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-64 overflow-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-xs text-fg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 text-right font-medium",
										children: "محصول"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 text-left font-medium",
										children: "پذیرش"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 text-left font-medium",
										children: "نصب"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 text-left font-medium",
										children: "PPM"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: productPpm.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-1.5",
										children: p.product
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-1.5 text-left tabular",
										children: faNum(p.visits, 0)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-1.5 text-left tabular",
										children: faNum(p.installed, 0)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-1.5 text-left tabular",
										children: p.ppm == null ? "—" : faNum(p.ppm, 0)
									})
								]
							}, p.product)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[11px] leading-5 text-fg-subtle",
						children: INSTALL_BASE.note
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-5 grid gap-3 xl:grid-cols-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-lg p-4 xl:col-span-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "روند ماهانه مراجعات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHint, { children: "تعداد پذیرش در هر ماه شمسی" })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientChart, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[260px] w-full",
					dir: "ltr",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: series,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: CHART.grid,
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									tickFormatter: formatMonthShort,
									tick: {
										fill: CHART.tick,
										fontSize: 11
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: {
										fill: CHART.tick,
										fontSize: 11
									},
									axisLine: false,
									tickLine: false,
									width: 28
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: tooltipStyle,
									formatter: (v, name) => [faNum(Number(v), 0), name === "visits" ? "مراجعه" : "تکراری"],
									labelFormatter: (l) => formatMonth(String(l))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "visits",
									fill: CHART[1],
									radius: [
										3,
										3,
										0,
										0
									]
								})
							]
						})
					})
				}) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-lg p-4 xl:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "توزیع دستگاه" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/devices",
						children: "جزئیات"
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankTable, {
					rows: products,
					nameLabel: "دستگاه"
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-5 rounded-lg p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "علت‌های پرتکرار" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "ghost",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/causes",
					children: "همه علت‌ها"
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankTable, {
				rows: causes,
				nameLabel: "دسته علت"
			})]
		})
	] });
}
//#endregion
export { Home as component };
