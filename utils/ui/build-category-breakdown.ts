type ByCategory = Record<string, number>;

type CategoryBreakdown = {
	category: string;
	label: string;
	amount: string;
	percent: number;
	color: string;
};

const CATEGORY_COLORS: string[] = [
	"bg-primary",
	"bg-accent",
	"bg-blue-500",
	"bg-green-500",
	"bg-orange-500",
	"bg-purple-500",
	"bg-red-500",
	"bg-yellow-500",
	"bg-indigo-500",
	"bg-gray-500",
];

function beautifyCategoryText(category: string): string {
	return (
		category
			// replace underscores & dashes with spaces
			.replace(/[_-]+/g, " ")
			// trim extra whitespace
			.trim()
			// title case each word
			.split(" ")
			.map((word) =>
				word.length > 0
					? word[0].toUpperCase() + word.slice(1).toLowerCase()
					: word
			)
			.join(" ")
	);
}

export function buildCategoryBreakdown(
	byCategory: ByCategory
): CategoryBreakdown[] {
	const entries = Object.entries(byCategory);

	const total = entries.reduce((sum, [, value]) => sum + value, 0);

	if (total === 0) return [];

	// Step 1: calculate raw percentages
	const withRaw = entries.map(([category, value], index) => ({
		category,
		value,
		rawPercent: (value / total) * 100,
		floorPercent: Math.floor((value / total) * 100),
		remainder: ((value / total) * 100) % 1,
		color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
	}));

	// Step 2: distribute remaining percentage points
	let remaining = 100 - withRaw.reduce((sum, i) => sum + i.floorPercent, 0);

	withRaw
		.sort((a, b) => b.remainder - a.remainder)
		.forEach((item) => {
			if (remaining > 0) {
				item.floorPercent += 1;
				remaining--;
			}
		});

	// Step 3: map to UI shape
	return withRaw.map((item) => ({
		category: item.category,
		label: beautifyCategoryText(item.category),
		amount: `R ${item.value.toLocaleString("en-ZA", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})}`,
		percent: item.floorPercent,
		color: item.color,
	}));
}
