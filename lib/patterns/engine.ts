import { differenceInHours, format, isWeekend, parseISO } from "date-fns";

import { AccountTransaction } from "investec-pb-api";
import { AnalyticsTransaction } from "@/types/analytics-transaction";
import { PatternResult } from "@/types/pattern";
import { processInvestecTransactions } from "@/utils/process-transactions";

export function buildPatterns(raw: AccountTransaction[]): PatternResult[] {
	const txs = processInvestecTransactions(raw);
	return identifyPatterns(txs);
}

function identifyPatterns(txs: AnalyticsTransaction[]): PatternResult[] {
	const patterns: PatternResult[] = [];

	// Run our detectors
	patterns.push(...detectWeekendWarrior(txs));
	patterns.push(...detectSubscriptionCreep(txs));
	patterns.push(...detectImpulseClusters(txs));
	patterns.push(...detectSalaryWindfall(txs));

	return patterns;
}

/**
 * PATTERN 1: The Weekend Warrior (Observation)
 * High spend on Sat/Sun compared to weekdays.
 */
function detectWeekendWarrior(txs: AnalyticsTransaction[]): PatternResult[] {
	let weekendTotal = 0;
	let weekdayTotal = 0;

	txs.forEach((tx) => {
		if (tx.type === "CREDIT") return;
		if (isWeekend(parseISO(tx.date))) {
			weekendTotal += tx.amount;
		} else {
			weekdayTotal += tx.amount;
		}
	});

	if (weekendTotal > weekdayTotal) {
		return [
			{
				title: "The Weekend Warrior",
				description: `You spend ${Math.round(
					(weekendTotal / (weekendTotal + weekdayTotal)) * 100
				)}% of your money on weekends. Consider if these are planned or lifestyle spends.`,
				type: "observation",
			},
		];
	}
	return [];
}

/**
 * PATTERN 2: Subscription Creep (Savings)
 * Identifying recurring debit orders that might be "leaking" money.
 */
function detectSubscriptionCreep(txs: AnalyticsTransaction[]): PatternResult[] {
	const subs = txs.filter(
		(tx) =>
			tx.category === "subscriptions" ||
			tx.transactionType === "DebitOrders"
	);
	const subCount = subs.length;
	const subTotal = subs.reduce((acc, tx) => acc + tx.amount, 0);

	if (subCount > 3) {
		return [
			{
				title: "Subscription Sleuth",
				description: `We found ${subCount} recurring payments totaling R${subTotal.toFixed(
					2
				)}. Are you still using all of these?`,
				type: "savings",
			},
		];
	}
	return [];
}

/**
 * PATTERN 3: Impulse Clusters (Opportunity)
 * Multiple card purchases in a very short window (e.g. 3 hours).
 */
function detectImpulseClusters(txs: AnalyticsTransaction[]): PatternResult[] {
	const cardPurchases = txs
		.filter(
			(tx) =>
				tx.transactionType === "CardPurchases" && tx.type === "DEBIT"
		)
		.sort(
			(a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
		);

	let clusters = 0;
	for (let i = 0; i < cardPurchases.length - 1; i++) {
		const hours = differenceInHours(
			parseISO(cardPurchases[i + 1].date),
			parseISO(cardPurchases[i].date)
		);
		if (hours >= 0 && hours <= 3) {
			clusters++;
		}
	}

	if (clusters > 2) {
		return [
			{
				title: "Impulse Cluster Detected",
				description: `You've had ${clusters} shopping sprints this month. Setting a 1-hour "cool-down" period could save you from unplanned buys.`,
				type: "opportunity",
			},
		];
	}
	return [];
}

/**
 * PATTERN 4: Salary Windfall (Achievement / Observation)
 * Detecting a large credit and how it's handled.
 */
function detectSalaryWindfall(txs: AnalyticsTransaction[]): PatternResult[] {
	const salaryTx = txs.find(
		(tx) => tx.type === "CREDIT" && tx.amount > 10000
	);

	if (salaryTx) {
		// Check if there was a transfer out (Savings) shortly after
		const savingsTx = txs.find(
			(tx) =>
				tx.type === "DEBIT" &&
				tx.category === "transfers" &&
				differenceInHours(parseISO(tx.date), parseISO(salaryTx.date)) <
					48
		);

		if (savingsTx) {
			return [
				{
					title: "Payday Pro",
					description:
						"Great job! You moved money to savings within 48 hours of getting paid.",
					type: "achievement",
				},
			];
		} else {
			return [
				{
					title: "Payday Opportunity",
					description:
						"You've received your salary! Consider moving 10% to a savings pocket before the 'Weekend Warrior' kicks in.",
					type: "opportunity",
				},
			];
		}
	}
	return [];
}
