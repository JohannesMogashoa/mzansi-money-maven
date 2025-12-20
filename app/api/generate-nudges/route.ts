import { OpenRouterModels, aiOpenRouter } from "@/lib/open-router";

import { generateObject } from "ai";
import { z } from "zod";

const nudgeSchema = z.object({
	nudges: z.array(
		z.object({
			id: z.string(),
			title: z.string().describe("Clear, actionable title for the nudge"),
			description: z
				.string()
				.describe("Detailed explanation of the recommendation"),
			priority: z
				.enum(["high", "medium", "low"])
				.describe("Priority level based on potential impact"),
			savings: z
				.string()
				.optional()
				.describe("Potential savings or benefit"),
			actionable: z
				.boolean()
				.describe("Whether the user can act on this immediately"),
			reasoning: z
				.string()
				.describe(
					"AI's reasoning for this specific recommendation based on user data"
				),
		})
	),
	summary: z
		.string()
		.describe("A 2-3 sentence summary of key insights from the analysis"),
	overallScore: z.number().describe("Overall financial health score 0-100"),
});

export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		const { userData } = await req.json();

		const { object } = await generateObject({
			model: aiOpenRouter.chat(OpenRouterModels.GEMINI_2_0_FLASH),
			schema: nudgeSchema,
			messages: [
				{
					role: "user",
					content: `You are an expert financial advisor AI for Investec South Africa. Analyze this client's financial data and generate 5-7 personalized, actionable nudges to improve their financial behavior and savings:

                            Client Profile:
                            - Monthly Spending: R ${userData.monthlySpending}
                            - Savings Rate: ${userData.savingsRate}%
                            - Active Subscriptions: ${userData.subscriptions}
                            - Emergency Fund (months): ${userData.emergencyFund}
                            - Account Balance: R ${userData.accountBalance}

                            Generate nudges that are:
                            1. Specific to their spending patterns
                            2. Prioritized by impact (high priority = biggest potential savings)
                            3. Actionable (they can implement today/this week)
                            4. South Africa-specific (use RSA context, mention Investec when relevant)
                            5. Behavioral (focus on fostering better financial habits)

                            Include a mix of:
                            - Subscription audits and optimization
                            - Spending category optimization
                            - Emergency fund building
                            - Passive income opportunities
                            - Automation recommendations
                            
                            ---

                            ## OUTPUT FORMAT (STRICT)

                            Return ONLY valid JSON in the following structure:

                ${nudgeSchema.describe}

                            ---
                            `,
				},
			],
			maxOutputTokens: 2000,
		});

		return Response.json(object);
	} catch (error) {
		console.error("[v0] Error generating nudges:", error);
		return Response.json(
			{ error: "Failed to generate nudges" },
			{ status: 500 }
		);
	}
}
