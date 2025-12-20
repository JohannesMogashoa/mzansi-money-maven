export type PersonalizedTipsResponse = {
	title: string;
	tips: PersonalizedTip[];
};

export type PersonalizedTip = {
	title: string;
	category: TipCategory;
	description: string;
	impactLabel: string;
	confidence: TipConfidence;
};

export type TipCategory =
	| "BUDGETING"
	| "SAVINGS"
	| "AUTOMATION"
	| "REWARDS"
	| "AWARENESS"
	| "RISK";

export type TipConfidence = "LOW" | "MEDIUM" | "HIGH";

export type TipIcon = "savings" | "food" | "automation" | "warning" | "rewards";

export type PersonalizedTipUI = PersonalizedTip & {
	highlight?: boolean;
	icon?: TipIcon;
};

export type PersonalizedTipsResponseUI = {
	title: string;
	tips: PersonalizedTipUI[];
};
