import { AccountTransaction } from "investec-pb-api";
import { AnalyticsTransaction } from "@/types/analytics-transaction";
import { categorizeInvestecTransaction } from "./categorize-transaction";
import { normalizeMerchant } from "./normalize-merchant";

export function processInvestecTransactions(
	transactions: AccountTransaction[]
): AnalyticsTransaction[] {
	return transactions.map((tx) => ({
		id: tx.uuid,
		accountId: tx.accountId,
		description: tx.description,
		amount: tx.amount,
		type: tx.type as "DEBIT" | "CREDIT", // 🔥 Carry this over
		date: tx.transactionDate,
		transactionType: tx.transactionType,
		category: categorizeInvestecTransaction(tx),
		normalizedMerchant: normalizeMerchant(tx.description),
	}));
}
