import { Category } from "@/types/category";

export const CATEGORY_RULES: {
	category: Category;
	keywords: string[];
}[] = [
	// GROCERIES
	{
		category: "groceries",
		keywords: [
			"checkers",
			"spar",
			"superspar",
			"kwikspar",
			"pick n pay",
			"pnp",
			"shoprite",
			"makro",
			"woolworths",
			"freshx",
		],
	},

	// EATING OUT
	{
		category: "eating_out",
		keywords: [
			"kfc",
			"mcdonald",
			"steers",
			"roman",
			"pizza",
			"restaurant",
			"cafe",
			"sushi",
			"fish and chips",
			"bootlegger",
		],
	},

	// FUEL
	{
		category: "fuel",
		keywords: ["engen", "shell", "bp", "caltex", "total", "sasols"],
	},

	// SHOPPING
	{
		category: "shopping",
		keywords: [
			"takealot",
			"pep",
			"ackermans",
			"clicks",
			"dis-chem",
			"dischem",
			"toys r us",
			"mrph",
			"woolworths clothing",
		],
	},

	// ENTERTAINMENT
	{
		category: "entertainment",
		keywords: ["bowling", "arena", "cinema", "events", "shoot", "sports"],
	},

	// SUBSCRIPTIONS
	{
		category: "subscriptions",
		keywords: ["netflix", "spotify", "afrihost"],
	},

	// HEALTH
	{
		category: "health",
		keywords: [
			"dis-chem",
			"doctor",
			"drs",
			"practice",
			"clinic",
			"pharmacy",
			"hospice",
		],
	},
];
