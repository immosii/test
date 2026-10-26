import { c as cn } from "./store-sknedTTk.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { l as formatPctPlain, s as faNum } from "./page-header-Dj3IWVVq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ppm-BzDt1QUc.js
var import_jsx_runtime = require_jsx_runtime();
function RankTable({ rows, nameLabel = "عنوان" }) {
	const max = Math.max(1, ...rows.map((r) => r.count));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[18rem] text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "text-xs text-fg-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "pb-2 text-right font-medium",
						children: nameLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "pb-2 text-left font-medium",
						children: "تعداد"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "w-[28%] pb-2 font-medium" })
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r, i) => {
				const v = r.count;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "py-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-fg-subtle tabular",
									children: [i + 1, "."]
								}),
								" ",
								r.name,
								r.share != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mr-2 text-[11px] text-fg-subtle",
									children: formatPctPlain(r.share, 0)
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2.5 text-left tabular",
							children: faNum(v, 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 overflow-hidden rounded-full bg-bg-subtle",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("h-full rounded-full bg-primary"),
									style: { width: `${Math.max(4, v / max * 100)}%` }
								})
							})
						})
					]
				}, r.name);
			}) })]
		})
	});
}
var INSTALL_BASE = {
	formula: "PPM = (پذیرش‌های همان ماه / دستگاه‌های نصب‌شده در ۱۲ ماه شمسی قبل از آن ماه) × 1,000,000",
	windowMonths: 12,
	installSpan: ["1404-01", "1405-06"],
	installRows: 23687,
	note: "مخرج، تعداد سریال یکتا در پنجره است. سریال خالی به‌صورت ردیف جدا شمرده شده. پنجره ماه جاری را شامل نمی‌شود.",
	byMonth: {
		"1405-01": {
			"all": 18292,
			"byProduct": {
				"ماشین لباسشویی": 6572,
				"ماشین ظرفشویی": 8666,
				"یخچال سایدبای‌ساید": 767,
				"یخچال مینی": 1323,
				"تلویزیون": 964
			},
			"complete": true
		},
		"1405-02": {
			"all": 17996,
			"byProduct": {
				"ماشین ظرفشویی": 8376,
				"ماشین لباسشویی": 6667,
				"یخچال مینی": 1325,
				"یخچال سایدبای‌ساید": 740,
				"تلویزیون": 888
			},
			"complete": true
		},
		"1405-03": {
			"all": 17891,
			"byProduct": {
				"ماشین ظرفشویی": 8236,
				"ماشین لباسشویی": 6713,
				"یخچال سایدبای‌ساید": 691,
				"یخچال مینی": 1434,
				"تلویزیون": 817
			},
			"complete": true
		},
		"1405-04": {
			"all": 17350,
			"byProduct": {
				"ماشین ظرفشویی": 7981,
				"ماشین لباسشویی": 6557,
				"یخچال مینی": 1518,
				"یخچال سایدبای‌ساید": 585,
				"تلویزیون": 709
			},
			"complete": true
		},
		"1405-05": {
			"all": 16952,
			"byProduct": {
				"ماشین لباسشویی": 6426,
				"ماشین ظرفشویی": 7792,
				"یخچال سایدبای‌ساید": 420,
				"یخچال مینی": 1647,
				"تلویزیون": 667
			},
			"complete": true
		},
		"1405-06": {
			"all": 15853,
			"byProduct": {
				"ماشین لباسشویی": 5903,
				"یخچال مینی": 1810,
				"ماشین ظرفشویی": 7218,
				"یخچال سایدبای‌ساید": 307,
				"تلویزیون": 615
			},
			"complete": true
		}
	}
};
function installCell(month) {
	return INSTALL_BASE.byMonth[month] ?? null;
}
/** پذیرش ماه ÷ نصب ۱۲ ماه قبل × ۱٬۰۰۰٬۰۰۰ */
function ppmValue(visits, installed) {
	if (!installed) return null;
	return visits / installed * 1e6;
}
function exposureFor(month, product) {
	const cell = installCell(month);
	if (!cell) return null;
	if (product) return {
		installed: cell.byProduct[product] ?? 0,
		complete: cell.complete
	};
	return {
		installed: cell.all,
		complete: cell.complete
	};
}
function ppmSeries(rows, months, product) {
	return months.map((month) => {
		const visits = rows.filter((r) => r.month === month).length;
		const exp = exposureFor(month, product);
		const installed = exp?.installed ?? 0;
		return {
			month,
			visits,
			installed,
			ppm: ppmValue(visits, installed),
			complete: exp?.complete ?? false
		};
	});
}
function ppmByProduct(rowsInMonth, month) {
	const cell = installCell(month);
	const counts = /* @__PURE__ */ new Map();
	for (const r of rowsInMonth) counts.set(r.product, (counts.get(r.product) ?? 0) + 1);
	return [.../* @__PURE__ */ new Set([...counts.keys(), ...Object.keys(cell?.byProduct ?? {})])].map((product) => {
		const visits = counts.get(product) ?? 0;
		const installed = cell?.byProduct[product] ?? 0;
		return {
			product,
			month,
			visits,
			installed,
			ppm: visits || installed ? ppmValue(visits, installed) : null,
			complete: cell?.complete ?? false
		};
	}).filter((r) => r.visits > 0 || r.installed > 0).sort((a, b) => (b.ppm ?? -1) - (a.ppm ?? -1));
}
//#endregion
export { ppmSeries as a, ppmByProduct as i, RankTable as n, ppmValue as o, exposureFor as r, INSTALL_BASE as t };
