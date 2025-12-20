"use server";

import {
	analyseTransactionsUserMessage,
	systemPromptWithOutputStructure,
} from "@/utils/ai/prompts";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { isEventStream, process } from "@/utils/ai/processor";

import { AccountTransaction } from "investec-pb-api";
import { OpenRouterModels } from "@/lib/open-router";
import { PersonalizedTipsResponse } from "@/types/nudges";
import { processInvestecTransactions } from "@/utils/process-transactions";

export type NudgesResponse = {
	success: boolean;
	error: string | null;
	nudges: PersonalizedTipsResponse | null;
};

export const getPersonalizedNudges = async (
	transactions: AccountTransaction[]
): Promise<NudgesResponse> => {
	const { isAuthenticated, userId } = await auth();

	if (!isAuthenticated || !userId) {
		return { success: false, error: "No Logged In User", nudges: null };
	}

	const txs = processInvestecTransactions(transactions);

	const output = await process(
		[systemPromptWithOutputStructure, analyseTransactionsUserMessage(txs)],
		false,
		OpenRouterModels.GEMMA_3_27B
	);

	if (isEventStream(output)) {
		return {
			success: false,
			error: "Streaming not supported",
			nudges: null,
		};
	}

	if (!output?.choices[0]?.message?.content) {
		return { success: false, error: "No response from AI", nudges: null };
	}

	const content = deserializeTipsResponse(
		output.choices[0].message.content as string
	);

	return { success: true, nudges: content, error: null };
};

function extractJson(raw: string): string {
	// Remove markdown fences if present
	const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
	if (fenced) {
		return fenced[1];
	}

	return raw.trim();
}

function deserializeTipsResponse(rawContent: string): PersonalizedTipsResponse {
	const jsonString = extractJson(rawContent);

	let parsed: unknown;

	try {
		parsed = JSON.parse(jsonString);
	} catch (err) {
		throw new Error("Failed to parse AI response as JSON");
	}

	if (!isPersonalizedTipsResponse(parsed)) {
		throw new Error("Parsed AI response does not match expected shape");
	}

	return parsed;
}

function isPersonalizedTipsResponse(
	value: unknown
): value is PersonalizedTipsResponse {
	if (
		typeof value !== "object" ||
		value === null ||
		!("title" in value) ||
		!("tips" in value) ||
		!Array.isArray((value as any).tips)
	) {
		return false;
	}

	return (value as any).tips.every(
		(tip: any) =>
			typeof tip.title === "string" &&
			typeof tip.description === "string" &&
			typeof tip.impactLabel === "string" &&
			[
				"BUDGETING",
				"SAVINGS",
				"AUTOMATION",
				"REWARDS",
				"AWARENESS",
				"RISK",
			].includes(tip.category) &&
			["LOW", "MEDIUM", "HIGH"].includes(tip.confidence)
	);
}
