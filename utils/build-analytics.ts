import { AccountTransaction } from "investec-pb-api";
import { AnalyticsResponse } from "@/types/analytics-response";
import { processInvestecTransactions } from "./process-transactions";

export function buildAnalytics(raw: AccountTransaction[]): AnalyticsResponse {
	const txs = processInvestecTransactions(raw);

	let incomeRaw = 0;
	let spentRaw = 0;

	const byCategory: Record<string, number> = {};
	const merchantStats: Record<string, { count: number; total: number }> = {};
	const monthly: Record<
		string,
		{ totalSpent: number; byCategory: Record<string, number> }
	> = {};

	for (const tx of txs) {
		const month = tx.date.slice(0, 7);
		const amount = tx.amount;

		if (tx.type === "CREDIT") {
			incomeRaw += amount;
			// We usually don't categorize income for spend charts,
			// but you can if you want to track "Refunds" etc.
			continue;
		}

		// Logic for DEBITS (Spending)
		spentRaw += amount;

		// 1. Category totals
		byCategory[tx.category] = (byCategory[tx.category] ?? 0) + amount;

		// 2. Merchant stats
		merchantStats[tx.normalizedMerchant] ??= { count: 0, total: 0 };
		merchantStats[tx.normalizedMerchant].count += 1;
		merchantStats[tx.normalizedMerchant].total += amount;

		// 3. Monthly aggregation
		monthly[month] ??= { totalSpent: 0, byCategory: {} };
		monthly[month].totalSpent += amount;
		monthly[month].byCategory[tx.category] =
			(monthly[month].byCategory[tx.category] ?? 0) + amount;
	}

	// Helper to fix JS floating point issues (0.1 + 0.2 = 0.300000004)
	const money = (val: number) => Number(val.toFixed(2));

	return {
		summary: {
			totalSpent: money(spentRaw),
			totalIncome: money(incomeRaw),
			net: money(incomeRaw - spentRaw),
		},
		byCategory: Object.fromEntries(
			Object.entries(byCategory).map(([k, v]) => [k, money(v)])
		),
		byMerchant: Object.entries(merchantStats)
			.map(([merchant, data]) => ({
				merchant,
				count: data.count,
				total: money(data.total),
			}))
			.sort((a, b) => b.total - a.total),
		monthly: Object.fromEntries(
			Object.entries(monthly).map(([month, data]) => [
				month,
				{
					totalSpent: money(data.totalSpent),
					byCategory: Object.fromEntries(
						Object.entries(data.byCategory).map(([k, v]) => [
							k,
							money(v),
						])
					),
				},
			])
		),
		recurringMerchants: Object.entries(merchantStats)
			.filter(([, v]) => v.count >= 3) // Lowered to 3 for sandbox data visibility
			.map(([merchant, v]) => ({ merchant, count: v.count }))
			.sort((a, b) => b.count - a.count),
	};
}
