import { PersonalizedTip } from "@/types/nudges";
import React from "react";
import { Zap } from "lucide-react";

const NudgeCard = ({ tip }: { tip: PersonalizedTip }) => {
	return (
		<div className="p-6 bg-card border border-border/40 rounded-xl hover:border-primary/40 transition-colors">
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<h3 className="text-lg font-semibold text-foreground mb-1">
						{tip.title}
					</h3>
					<p className="text-xs text-primary font-medium uppercase tracking-wide mb-3">
						{tip.category}
					</p>
				</div>
				<div className="p-2 rounded-lg bg-primary/10">
					<Zap className="w-5 h-5 text-primary" />
				</div>
			</div>
			<p className="text-muted-foreground text-sm mb-4">
				{tip.description}
			</p>
			<div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
				<p className="text-sm font-medium text-accent">
					{tip.impactLabel}
				</p>
			</div>
		</div>
	);
};

export default NudgeCard;
