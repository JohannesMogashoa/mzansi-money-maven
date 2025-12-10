"use server";

import { Id } from "@/convex/_generated/dataModel";
import { InvestecPbApi } from "investec-pb-api";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { convex } from "@/lib/convex-client";

export async function fetchAccounts() {
	const { sessionClaims } = await auth();

	if (!sessionClaims) {
		return { error: "Session claims not found." };
	}

	const integrationId = sessionClaims.metadata?.integrationId;

	if (integrationId) {
		const integration = await convex.query(
			api.integrations.getIntegrationById,
			{
				integrationId: integrationId as Id<"integration">,
			}
		);

		if (!integration) {
			return { error: "Integration details not found." };
		}

		const investecClient = new InvestecPbApi(
			integration.clientId,
			integration.clientSecret,
			integration.apiKey
		);

		const response = await investecClient.getAccounts();

		return { accounts: response.data.accounts };
	}
}
