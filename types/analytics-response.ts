export interface AnalyticsResponse {
	summary: {
		totalSpent: number;
		totalIncome: number;
		net: number;
	};

	byCategory: Record<string, number>;
	byMerchant: {
		merchant: string;
		count: number;
		total: number;
	}[];

	monthly: Record<
		string,
		{
			totalSpent: number;
			byCategory: Record<string, number>;
		}
	>;

	recurringMerchants: {
		merchant: string;
		count: number;
	}[];
}
