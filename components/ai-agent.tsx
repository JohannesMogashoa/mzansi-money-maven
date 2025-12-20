"use client";

import { AlertCircle, Loader, TrendingUp, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

interface Nudge {
	id: string;
	title: string;
	description: string;
	priority: "high" | "medium" | "low";
	savings?: string;
	actionable: boolean;
	reasoning: string;
}

interface AnalysisResult {
	nudges: Nudge[];
	summary: string;
	overallScore: number;
}

export function AIAgent() {
	const [nudges, setNudges] = useState<Nudge[]>([]);
	const [loading, setLoading] = useState(false);
	const [summary, setSummary] = useState("");
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		generateNudges();
	}, []);

	const generateNudges = async () => {
		setLoading(true);
		setNudges([]);
		setSummary("");
		abortControllerRef.current = new AbortController();

		try {
			const response = await fetch("/api/generate-nudges", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userData: {
						monthlySpending: 12847,
						savingsRate: 32,
						subscriptions: 8,
						emergencyFund: 2.5,
						accountBalance: 247583,
					},
				}),
				signal: abortControllerRef.current.signal,
			});

			if (!response.ok) {
				throw new Error("Failed to generate nudges");
			}

			const data = (await response.json()) as AnalysisResult;
			setNudges(data.nudges);
			setSummary(data.summary);
		} catch (error) {
			if ((error as Error).name !== "AbortError") {
				console.error("Error generating nudges:", error);
				setNudges([
					{
						id: "error",
						title: "Unable to generate personalized nudges",
						description:
							"Please try again later or contact support.",
						priority: "high",
						actionable: false,
						reasoning: "API error occurred",
					},
				]);
			}
		} finally {
			setLoading(false);
		}
	};

	if (loading && nudges.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 gap-4">
				<div className="relative">
					<div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
					<div className="relative p-4 rounded-full bg-primary/10">
						<Loader className="w-8 h-8 text-primary animate-spin" />
					</div>
				</div>
				<p className="text-muted-foreground">
					Analyzing your spending patterns...
				</p>
			</div>
		);
	}

	const highPriorityNudges = nudges.filter((n) => n.priority === "high");
	const mediumPriorityNudges = nudges.filter((n) => n.priority === "medium");
	const lowPriorityNudges = nudges.filter((n) => n.priority === "low");

	return (
		<div className="space-y-8">
			{/* Summary Section */}
			{summary && (
				<div className="bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
					<div className="flex items-start gap-4">
						<div className="p-3 rounded-lg bg-primary/20">
							<TrendingUp className="w-6 h-6 text-primary" />
						</div>
						<div className="flex-1">
							<h3 className="text-lg font-semibold text-foreground mb-2">
								AI Analysis Summary
							</h3>
							<p className="text-muted-foreground leading-relaxed">
								{summary}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* High Priority Nudges */}
			{highPriorityNudges.length > 0 && (
				<section>
					<h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
						<AlertCircle className="w-6 h-6 text-orange-400" />
						Critical Opportunities
					</h2>
					<div className="space-y-3">
						{highPriorityNudges.map((nudge) => (
							<NudgeCard
								key={nudge.id}
								nudge={nudge}
								isExpanded={expandedId === nudge.id}
								onToggle={() =>
									setExpandedId(
										expandedId === nudge.id
											? null
											: nudge.id
									)
								}
							/>
						))}
					</div>
				</section>
			)}

			{/* Medium Priority Nudges */}
			{mediumPriorityNudges.length > 0 && (
				<section>
					<h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
						<Zap className="w-6 h-6 text-yellow-400" />
						Recommended Actions
					</h2>
					<div className="space-y-3">
						{mediumPriorityNudges.map((nudge) => (
							<NudgeCard
								key={nudge.id}
								nudge={nudge}
								isExpanded={expandedId === nudge.id}
								onToggle={() =>
									setExpandedId(
										expandedId === nudge.id
											? null
											: nudge.id
									)
								}
							/>
						))}
					</div>
				</section>
			)}

			{/* Low Priority Nudges */}
			{lowPriorityNudges.length > 0 && (
				<section>
					<h2 className="text-2xl font-bold text-foreground mb-4">
						Additional Tips
					</h2>
					<div className="space-y-3">
						{lowPriorityNudges.map((nudge) => (
							<NudgeCard
								key={nudge.id}
								nudge={nudge}
								isExpanded={expandedId === nudge.id}
								onToggle={() =>
									setExpandedId(
										expandedId === nudge.id
											? null
											: nudge.id
									)
								}
							/>
						))}
					</div>
				</section>
			)}

			{/* Regenerate Button */}
			<div className="pt-4">
				<Button
					onClick={generateNudges}
					disabled={loading}
					className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
				>
					{loading ? (
						<>
							<Loader className="w-4 h-4 mr-2 animate-spin" />
							Regenerating...
						</>
					) : (
						<>
							<Zap className="w-4 h-4 mr-2" />
							Regenerate Recommendations
						</>
					)}
				</Button>
			</div>
		</div>
	);
}

function NudgeCard({
	nudge,
	isExpanded,
	onToggle,
}: {
	nudge: Nudge;
	isExpanded: boolean;
	onToggle: () => void;
}) {
	const priorityColors = {
		high: "bg-orange-500/5 border-orange-500/30",
		medium: "bg-yellow-500/5 border-yellow-500/30",
		low: "bg-blue-500/5 border-blue-500/30",
	};

	const priorityIcons = {
		high: <AlertCircle className="w-5 h-5 text-orange-400" />,
		medium: <Zap className="w-5 h-5 text-yellow-400" />,
		low: <Zap className="w-5 h-5 text-blue-400" />,
	};

	return (
		<button
			onClick={onToggle}
			className={`w-full p-6 rounded-xl border text-left transition-all ${
				priorityColors[nudge.priority]
			} hover:border-primary/40`}
		>
			<div className="flex items-start gap-4">
				<div
					className={`p-2 rounded-lg ${
						nudge.priority === "high"
							? "bg-orange-500/20"
							: nudge.priority === "medium"
							? "bg-yellow-500/20"
							: "bg-blue-500/20"
					}`}
				>
					{priorityIcons[nudge.priority]}
				</div>
				<div className="flex-1">
					<h3 className="text-lg font-semibold text-foreground mb-1">
						{nudge.title}
					</h3>
					<p className="text-muted-foreground text-sm mb-2">
						{nudge.description}
					</p>
					{nudge.savings && (
						<p className="text-sm font-medium text-primary">
							{nudge.savings}
						</p>
					)}
					{isExpanded && (
						<div className="mt-4 pt-4 border-t border-border/40">
							<p className="text-xs text-muted-foreground italic">
								<strong>AI Reasoning:</strong> {nudge.reasoning}
							</p>
						</div>
					)}
				</div>
			</div>
		</button>
	);
}
