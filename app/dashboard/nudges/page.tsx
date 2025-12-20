"use client";

import { AlertCircle, ArrowLeft, Award, Target, Zap } from "lucide-react";
import { NudgesResponse, getPersonalizedNudges } from "./_actions";
import { useEffect, useState } from "react";

import { AIAgent } from "@/components/ai-agent";
import AccountNotSelected from "@/components/account-not-selected";
import { Button } from "@/components/ui/button";
import NudgeCard from "@/components/nudges/nudge-card";
import { useInvestec } from "@/contexts/investec-context";

const NudgesPage = () => {
	const { selectedAccount, isLoadingTransactions, transactions } =
		useInvestec();
	const [nudgesResponse, setNudgesResponse] = useState<NudgesResponse | null>(
		null
	);

	useEffect(() => {
		const getNudges = async () => {
			const response = await getPersonalizedNudges(transactions);
			console.log("Nudges response:", response);
			setNudgesResponse(response);
		};

		if (transactions.length > 0 && !isLoadingTransactions) {
			getNudges();
		}
	}, [transactions, isLoadingTransactions]);

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
			{/* Urgent Nudges */}
			<section className="mb-12">
				<h2 className="text-2xl font-bold text-foreground mb-6">
					Immediate Actions
				</h2>
				<div className="space-y-4">
					{[
						{
							priority: "high",
							title: "Review Your Subscriptions",
							description:
								"You have 8 active subscriptions. We found 3 that might be duplicates or unused.",
							savings: "Potential saving: R 340/month",
							action: "Review Now",
							icon: AlertCircle,
						},
						{
							priority: "medium",
							title: "Optimize Your Spending This Weekend",
							description:
								"Your weekend spending averages 34% higher. Consider setting a budget for this weekend.",
							savings: "Potential saving: R 450",
							action: "Set Budget",
							icon: Target,
						},
					].map((nudge, i) => {
						const Icon = nudge.icon;
						return (
							<div
								key={i}
								className={`p-6 rounded-xl border flex items-start gap-4 ${
									nudge.priority === "high"
										? "bg-orange-500/5 border-orange-500/30"
										: "bg-yellow-500/5 border-yellow-500/30"
								}`}
							>
								<div
									className={`p-3 rounded-lg ${
										nudge.priority === "high"
											? "bg-orange-500/20"
											: "bg-yellow-500/20"
									}`}
								>
									<Icon
										className={`w-6 h-6 ${
											nudge.priority === "high"
												? "text-orange-400"
												: "text-yellow-400"
										}`}
									/>
								</div>
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-foreground mb-1">
										{nudge.title}
									</h3>
									<p className="text-muted-foreground mb-3">
										{nudge.description}
									</p>
									<div className="flex items-center justify-between">
										<p className="text-sm font-medium text-primary">
											{nudge.savings}
										</p>
										<Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
											{nudge.action}
										</Button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</section>

			{/* Personalized Tips */}
			<section className="mb-12">
				<h2 className="text-2xl font-bold text-foreground mb-6">
					Personalized Tips
				</h2>
				<div className="grid md:grid-cols-2 gap-6">
					{nudgesResponse === null ? (
						<p className="text-muted-foreground">Loading tips...</p>
					) : nudgesResponse.success && nudgesResponse.nudges ? (
						nudgesResponse.nudges.tips.map((tip, index) => (
							<NudgeCard key={index} tip={tip} />
						))
					) : (
						<p className="text-red-500">
							{nudgesResponse.error || "Failed to load tips."}
						</p>
					)}
				</div>
			</section>

			{/* Achievement Unlocked */}
			<section>
				<h2 className="text-2xl font-bold text-foreground mb-6">
					Your Achievements
				</h2>
				<div className="bg-linear-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-8">
					<div className="flex items-start gap-4">
						<div className="p-3 rounded-lg bg-green-500/20">
							<Award className="w-8 h-8 text-green-400" />
						</div>
						<div>
							<h3 className="text-2xl font-bold text-foreground mb-2">
								Savings Champion
							</h3>
							<p className="text-lg text-muted-foreground mb-4">
								You've maintained a 32% savings rate for 3
								consecutive months. This puts you in the top 15%
								of Investec clients!
							</p>
							<div className="flex flex-wrap gap-3">
								<Badge>Consistent Saver</Badge>
								<Badge>Budget Master</Badge>
								<Badge>Smart Spender</Badge>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

function Badge({ children }: { children: string }) {
	return (
		<span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
			✓ {children}
		</span>
	);
}

export default NudgesPage;
