"use server";

import { AccountTransaction, InvestecPbApi } from "investec-pb-api";

import { Account } from "@/types/globals";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { convex } from "@/lib/convex-client";
import { decrypt } from "@/lib/encrypt";
import { env } from "@/env";

export async function fetchAccounts(): Promise<{
	accounts: Account[];
	error: string | null;
}> {
	const { sessionClaims } = await auth();

	if (!sessionClaims) {
		return { accounts: [], error: "Session claims not found." };
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
			return { accounts: [], error: "Integration details not found." };
		}

		const clientSecret = decrypt(integration.clientSecret) ?? "";
		const apiKey = decrypt(integration.apiKey) ?? "";

		if (!integration.clientId || !clientSecret || !apiKey) {
			return {
				accounts: [],
				error: "Decrypted integration details are incomplete.",
			};
		}

		const investecClient = new InvestecPbApi(
			integration.clientId,
			clientSecret,
			apiKey,
			env.INVESTEC_HOST
		);

		const response = await investecClient.getAccounts();

		return { accounts: response.data.accounts, error: null };
	}

	return {
		accounts: [],
		error: "Integration ID not found in session claims.",
	};
}

export async function fetchAccountTransactions(accountId: string): Promise<{
	transactions: AccountTransaction[];
	balance: number | null;
	error: string | null;
}> {
	const { sessionClaims } = await auth();

	if (!sessionClaims) {
		return {
			transactions: [],
			balance: null,
			error: "Session claims not found.",
		};
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
			return {
				transactions: [],
				balance: null,
				error: "Integration details not found.",
			};
		}

		const clientSecret = decrypt(integration.clientSecret) ?? "";
		const apiKey = decrypt(integration.apiKey) ?? "";

		if (!integration.clientId || !clientSecret || !apiKey) {
			return {
				transactions: [],
				balance: null,
				error: "Decrypted integration details are incomplete.",
			};
		}

		const investecClient = new InvestecPbApi(
			integration.clientId,
			clientSecret,
			apiKey,
			env.INVESTEC_HOST
		);

		const response = await investecClient.getAccountTransactions(accountId);
		const balanceResponse = await investecClient.getAccountBalances(
			accountId
		);

		return {
			transactions: response.data.transactions,
			balance: balanceResponse.data.currentBalance,
			error: null,
		};
	}

	return {
		transactions: [],
		balance: null,
		error: "Integration ID not found in session claims.",
	};
}
