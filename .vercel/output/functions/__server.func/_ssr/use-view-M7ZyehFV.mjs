import { T as useReportStore, a as applyFilters, g as inMonth } from "./store-sknedTTk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-view-M7ZyehFV.js
function useView() {
	const rowsAll = useReportStore((s) => s.rows);
	const filters = useReportStore((s) => s.filters);
	const month = useReportStore((s) => s.selectedMonth);
	const setMonth = useReportStore((s) => s.setMonth);
	const filtered = applyFilters(rowsAll, filters);
	return {
		rowsAll,
		filtered,
		rows: inMonth(filtered, month),
		month,
		setMonth,
		filters
	};
}
//#endregion
export { useView as t };
