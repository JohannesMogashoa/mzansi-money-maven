export type PatternType =
	| "observation"
	| "opportunity"
	| "savings"
	| "achievement";

export interface PatternResult {
	title: string;
	description: string;
	type: PatternType;
	metadata?: any; // To store chart data or specific tx ids
}
