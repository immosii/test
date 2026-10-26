import { C as toFaDigits, n as MONTH_NAMES } from "./store-sknedTTk.mjs";
import { l as formatPctPlain } from "./page-header-Dj3IWVVq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cohort-6y_7tnhQ.js
function formatRate(rate, digits = 2) {
	if (rate == null) return "—";
	if (rate === 0) return "۰٪";
	return formatPctPlain(rate * 100, digits);
}
function ratePct(rate) {
	if (rate == null) return void 0;
	return Number((rate * 100).toFixed(4));
}
function slashMonthLabel(key) {
	const [y, m] = key.split("/");
	return `${MONTH_NAMES[Number(m) - 1] ?? key} ${toFaDigits(String(y ?? "").slice(2))}`;
}
function productsOf(rows) {
	return Array.from(new Set(rows.map((r) => r.product)));
}
function actionTone(result) {
	if (result.includes("بهبود")) return "good";
	if (result.includes("اقدام")) return "warn";
	return "muted";
}
//#endregion
export { slashMonthLabel as a, ratePct as i, formatRate as n, productsOf as r, actionTone as t };
