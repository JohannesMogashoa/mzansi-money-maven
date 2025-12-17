import { Award, Eye, Lightbulb, TrendingDown } from "lucide-react";

import { PatternResult } from "@/types/pattern";

const icons = {
	observation: <Eye className="text-blue-500" />,
	opportunity: <Lightbulb className="text-yellow-500" />,
	savings: <TrendingDown className="text-green-500" />,
	achievement: <Award className="text-purple-500" />,
};

export function PatternCard({ pattern }: { pattern: PatternResult }) {
	return (
		<div
			className={`p-4 rounded-lg border flex gap-4 ${
				pattern.type === "opportunity"
					? "bg-orange-500/5 border-orange-500/20"
					: pattern.type === "savings"
					? "bg-green-500/5 border-green-500/20"
					: pattern.type === "achievement"
					? "bg-primary/5 border-primary/20"
					: "bg-accent/5 border-accent/20"
			}`}
		>
			<div className="p-2 rounded-full">{icons[pattern.type]}</div>
			<div>
				<p className="font-medium text-foreground text-sm mb-1">
					{pattern.title}
				</p>
				<p className="text-xs text-muted-foreground">
					{pattern.description}
				</p>
				<span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-2 block">
					{pattern.type}
				</span>
			</div>
		</div>
	);
}
