"use client";

import {
	ArrowLeft,
	BarChart3,
	Eye,
	EyeOff,
	Home,
	Lightbulb,
} from "lucide-react";
import React, { useState } from "react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useInvestec } from "@/lib/contexts/investec-context";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);

const DashboardPage = () => {
	const [showBalance, setShowBalance] = useState(true);
	const router = useRouter();
	const {
		transactions,
		accountBalance,
		selectedAccount,
		isLoadingTransactions,
	} = useInvestec();

	const TransactionsCard = () => {
		if (selectedAccount === null) {
			return (
				<p className="text-sm text-muted-foreground">
					Please select an account to view transactions.
				</p>
			);
		}

		if (transactions.length === 0 && !isLoadingTransactions) {
			return (
				<p className="text-sm text-muted-foreground">
					No recent transactions available.
				</p>
			);
		}

		if (isLoadingTransactions) {
			return (
				<p className="text-sm text-muted-foreground">
					Loading transactions...
				</p>
			);
		}

		return transactions.slice(0, 5).map((tx, i) => (
			<div
				key={`${tx.uuid}-${i}`}
				className="flex items-center justify-between py-3 border-b border-border/40 last:border-0"
			>
				<div>
					<p className="font-medium text-foreground">
						{tx.description}
					</p>
					<p className="text-sm text-muted-foreground">
						{tx.transactionType}
					</p>
				</div>
				<div className="text-right">
					<p
						className={`font-semibold ${
							tx.type === "CREDIT"
								? "text-green-400"
								: "text-foreground"
						}`}
					>
						{`${tx.type === "CREDIT" ? "+" : "-"} ${tx.amount}`}
					</p>
					<p className="text-xs text-muted-foreground">
						{dayjs(tx.transactionDate).fromNow()}
					</p>
				</div>
			</div>
		));
	};

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Account Overview Card */}
			<div className="bg-linear-to-br from-card to-card/50 border border-border/40 rounded-2xl p-8 mb-8">
				<div className="flex justify-between items-start mb-8">
					<div>
						<p className="text-muted-foreground text-sm mb-2">
							Total Account Balance
						</p>
						<div className="flex items-center gap-3">
							<h2 className="text-4xl font-bold text-foreground">
								{showBalance
									? `R ${accountBalance ?? "-"}`
									: "••••••"}
							</h2>
							<button
								onClick={() => setShowBalance(!showBalance)}
								className="p-2 hover:bg-card rounded-lg transition"
							>
								{showBalance ? (
									<Eye className="w-5 h-5 text-muted-foreground" />
								) : (
									<EyeOff className="w-5 h-5 text-muted-foreground" />
								)}
							</button>
						</div>
					</div>
					<div className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg text-sm font-medium">
						+2.4% this month
					</div>
				</div>

				{/* Quick Stats */}
				<div className="grid grid-cols-3 gap-4">
					{[
						{
							label: "Monthly Spending",
							value: "R 12,847",
							change: "+5.2%",
							trend: "up",
						},
						{
							label: "Savings Rate",
							value: "32%",
							change: "+1.8%",
							trend: "up",
						},
						{
							label: "Budget Alerts",
							value: "2",
							change: "New",
							trend: "neutral",
						},
					].map((stat, i) => (
						<div
							key={i}
							className="p-4 bg-background/50 rounded-lg border border-border/40"
						>
							<p className="text-xs text-muted-foreground mb-1">
								{stat.label}
							</p>
							<p className="text-lg font-semibold text-foreground mb-1">
								{stat.value}
							</p>
							<p
								className={`text-xs ${
									stat.trend === "up"
										? "text-green-400"
										: "text-muted-foreground"
								}`}
							>
								{stat.change}
							</p>
						</div>
					))}
				</div>
			</div>

			{/* Action Cards */}
			<div className="grid md:grid-cols-3 gap-6 mb-8">
				{/* Navigate to INSIGHTS */}
				<button
					onClick={() => router.push("/dashboard/insights")}
					className="group p-6 bg-card border border-border/40 rounded-xl hover:border-primary/40 transition-all cursor-pointer"
				>
					<div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
						<BarChart3 className="w-6 h-6 text-primary" />
					</div>
					<h3 className="text-lg font-semibold text-foreground mb-1">
						View Insights
					</h3>
					<p className="text-sm text-muted-foreground">
						Discover spending patterns and trends
					</p>
				</button>
				{/* Navigate to NUDGE */}
				<button
					onClick={() => router.push("/dashboard/nudges")}
					className="group p-6 bg-card border border-border/40 rounded-xl hover:border-primary/40 transition-all cursor-pointer"
				>
					<div className="mb-4 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
						<Lightbulb className="w-6 h-6 text-accent" />
					</div>
					<h3 className="text-lg font-semibold text-foreground mb-1">
						AI Recommendations
					</h3>
					<p className="text-sm text-muted-foreground">
						Get personalized nudges and tips
					</p>
				</button>

				<div className="p-6 bg-card border border-border/40 rounded-xl">
					<div className="mb-4 w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
						<Home className="w-6 h-6 text-green-400" />
					</div>
					<h3 className="text-lg font-semibold text-foreground mb-1">
						Your Goals
					</h3>
					<p className="text-sm text-muted-foreground">
						3 active goals - 67% complete
					</p>
				</div>
			</div>

			{/* Recent Transactions */}
			<div className="bg-card border border-border/40 rounded-xl p-6">
				<h3 className="text-lg font-semibold text-foreground mb-6">
					Recent Transactions
				</h3>
				<div className="space-y-4">
					<TransactionsCard />
				</div>
			</div>
		</main>
	);
};

export default DashboardPage;
