import { AnalyticsTransaction } from "@/types/analytics-transaction";
import { format } from "date-fns";

export function aggregateByCategory(txs: AnalyticsTransaction[]) {
	return txs.reduce<Record<string, number>>((acc, tx) => {
		if (tx.amount >= 0) return acc;
		acc[tx.category] = (acc[tx.category] ?? 0) + Math.abs(tx.amount);
		return acc;
	}, {});
}

export function aggregateByMerchant(txs: AnalyticsTransaction[]) {
	return txs.reduce<Record<string, number>>((acc, tx) => {
		if (tx.amount >= 0) return acc;
		acc[tx.normalizedMerchant] =
			(acc[tx.normalizedMerchant] ?? 0) + Math.abs(tx.amount);
		return acc;
	}, {});
}

export function groupByMonth(txs: AnalyticsTransaction[]) {
	return txs.reduce<Record<string, AnalyticsTransaction[]>>((acc, tx) => {
		const key = format(new Date(tx.date), "yyyy-MM");
		acc[key] ??= [];
		acc[key].push(tx);
		return acc;
	}, {});
}

export function monthlyCategoryTotals(txs: AnalyticsTransaction[]) {
	return txs.reduce<Record<string, Record<string, number>>>((acc, tx) => {
		if (tx.amount >= 0) return acc;

		const month = tx.date.slice(0, 7);
		acc[month] ??= {};
		acc[month][tx.category] =
			(acc[month][tx.category] ?? 0) + Math.abs(tx.amount);

		return acc;
	}, {});
}

export function recurringMerchants(
	txs: AnalyticsTransaction[],
	minOccurrences = 5
) {
	const counts: Record<string, number> = {};

	for (const tx of txs) {
		if (tx.amount >= 0) continue;
		counts[tx.normalizedMerchant] =
			(counts[tx.normalizedMerchant] ?? 0) + 1;
	}

	return Object.entries(counts)
		.filter(([, count]) => count >= minOccurrences)
		.sort((a, b) => b[1] - a[1]);
}
