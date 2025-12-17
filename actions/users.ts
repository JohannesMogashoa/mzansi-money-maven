"use server";

import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { convex } from "@/lib/convex-client";

export const setUserPreferenceAccount = async (accountId: string) => {
	try {
		const { userId } = await auth();

		if (!userId) {
			throw new Error("User not authenticated in server.");
		}

		const mutationResponse = await convex.mutation(
			api.users.setUserAccount,
			{
				accountId,
				userId,
			}
		);

		if (mutationResponse?.error) {
			return {
				success: false,
				error: mutationResponse.error,
			};
		}

		return { success: true, error: null };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "An unknown error occurred.",
		};
	}
};
