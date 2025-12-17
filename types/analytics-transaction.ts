import { Category } from "./category";

export interface AnalyticsTransaction {
	id: string;
	accountId: string;
	description: string;
	amount: number; // Absolute value
	type: "DEBIT" | "CREDIT";
	date: string;
	category: Category;
	normalizedMerchant: string;
	transactionType: string;
}
