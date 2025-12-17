import { AccountTransaction } from "investec-pb-api";
import { CATEGORY_RULES } from "@/data/category-rules";
import { Category } from "@/types/category";

export function categorizeInvestecTransaction(
	tx: AccountTransaction
): Category {
	const description = tx.description.toLowerCase();

	if (tx.type === "CREDIT") {
		return "income";
	}

	// 2. TransactionType-based overrides
	if (tx.transactionType === "ATMWithdrawals") return "cash";
	if (tx.transactionType === "FeesAndInterest") return "fees";

	// 3. Keyword rules (using our previous list)
	for (const rule of CATEGORY_RULES) {
		if (rule.keywords.some((k) => description.includes(k))) {
			return rule.category;
		}
	}

	return "uncategorized";
}
