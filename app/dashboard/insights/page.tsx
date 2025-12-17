"use client";

import { ArrowLeft, PieChart, TrendingUp } from "lucide-react";

import AccountNotSelected from "@/components/account-not-selected";
import { Button } from "@/components/ui/button";
import CategorySpendingCard from "@/components/insights/category-card";
import React from "react";
import { useInvestec } from "@/contexts/investec-context";

// "Last Month", "Last 3 Months", "Last Year"

const InsightsPage = () => {
	const { selectedAccount, isLoadingTransactions } = useInvestec();

	if (!selectedAccount) {
		return (
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex flex-col items-center justify-center h-96">
					<AccountNotSelected />
				</div>
			</main>
		);
	}

	if (isLoadingTransactions) {
		return (
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex flex-col items-center justify-center h-96">
					<p className="text-muted-foreground">
						Loading transactions...
					</p>
				</div>
			</main>
		);
	}

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Period Selector */}
			<div className="flex gap-4 mb-8">
				{["Overall"].map((period) => (
					<Button
						key={period}
						variant={period === "Overall" ? "default" : "outline"}
						className={
							period === "Overall"
								? "bg-primary text-primary-foreground"
								: "border-border text-foreground hover:bg-card"
						}
					>
						{period}
					</Button>
				))}
			</div>

			{/* Top Insights */}
			<div className="grid md:grid-cols-2 gap-8 mb-8">
				{/* Spending by Category */}
				<div className="bg-card border border-border/40 rounded-xl p-6">
					<div className="flex items-center gap-2 mb-6">
						<PieChart className="w-5 h-5 text-primary" />
						<h3 className="text-lg font-semibold text-foreground">
							Spending by Category
						</h3>
					</div>
					<div className="space-y-4">
						<CategorySpendingCard />
					</div>
				</div>

				{/* Key Patterns Identified */}
				<div className="bg-card border border-border/40 rounded-xl p-6">
					<div className="flex items-center gap-2 mb-6">
						<TrendingUp className="w-5 h-5 text-accent" />
						<h3 className="text-lg font-semibold text-foreground">
							Patterns We Found
						</h3>
					</div>
					<div className="space-y-4">
						{[
							{
								title: "Weekend Spending Spike",
								description:
									"Your spending increases 34% on weekends, primarily on dining and entertainment.",
								type: "observation",
							},
							{
								title: "Subscription Leak",
								description:
									"You have 8 active subscriptions costing R 1,247/month. Consider reviewing.",
								type: "opportunity",
							},
							{
								title: "Coffee Run Habit",
								description:
									"Average R 45 × 22 days = R 990/month on coffee. Could save R 6K annually.",
								type: "savings",
							},
							{
								title: "Consistent Savings",
								description:
									"You consistently save 32% of your income. Great financial discipline!",
								type: "achievement",
							},
						].map((pattern, i) => (
							<div
								key={i}
								className={`p-4 rounded-lg border ${
									pattern.type === "opportunity"
										? "bg-orange-500/5 border-orange-500/20"
										: pattern.type === "savings"
										? "bg-green-500/5 border-green-500/20"
										: pattern.type === "achievement"
										? "bg-primary/5 border-primary/20"
										: "bg-accent/5 border-accent/20"
								}`}
							>
								<p className="font-medium text-foreground text-sm mb-1">
									{pattern.title}
								</p>
								<p className="text-xs text-muted-foreground">
									{pattern.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Detailed Breakdown */}
			<div className="bg-card border border-border/40 rounded-xl p-6">
				<h3 className="text-lg font-semibold text-foreground mb-6">
					Month-over-Month Comparison
				</h3>
				<div className="grid md:grid-cols-4 gap-4">
					{[
						{
							label: "This Month",
							value: "R 12,847",
							change: "+5.2%",
							type: "increase",
						},
						{
							label: "Last Month",
							value: "R 12,215",
							change: "+8.3%",
							type: "increase",
						},
						{
							label: "Average",
							value: "R 11,950",
							change: "—",
							type: "neutral",
						},
						{
							label: "Projected",
							value: "R 14,120",
							change: "+18.1%",
							type: "warning",
						},
					].map((item, i) => (
						<div
							key={i}
							className="p-4 bg-background/50 rounded-lg border border-border/40"
						>
							<p className="text-xs text-muted-foreground mb-1">
								{item.label}
							</p>
							<p className="text-xl font-bold text-foreground mb-2">
								{item.value}
							</p>
							<p
								className={`text-xs font-medium ${
									item.type === "increase"
										? "text-green-400"
										: item.type === "warning"
										? "text-orange-400"
										: "text-muted-foreground"
								}`}
							>
								{item.change}
							</p>
						</div>
					))}
				</div>
			</div>
		</main>
	);
};

export default InsightsPage;
