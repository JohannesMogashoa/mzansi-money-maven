"use client";

import { buildCategoryBreakdown } from "@/utils/ui/build-category-breakdown";
import { useInvestec } from "@/contexts/investec-context";

const CategorySpendingCard = () => {
	const { analytics } = useInvestec();
	return (
		<div>
			{buildCategoryBreakdown(analytics.byCategory).map((category, i) => (
				<div className="mb-2 last:mb-0" key={i}>
					<div className="flex justify-between items-center mb-2">
						<p className="text-sm font-medium text-foreground">
							{category.label}
						</p>
						<p className="text-sm font-semibold text-muted-foreground">
							{category.amount}
						</p>
					</div>
					<div className="w-full bg-background/50 rounded-full h-2">
						<div
							className={`${category.color} h-2 rounded-full`}
							style={{ width: `${category.percent}%` }}
						/>
					</div>
				</div>
			))}
		</div>
	);
};

export default CategorySpendingCard;
