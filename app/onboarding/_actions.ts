"use server";

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

import { api } from "@/convex/_generated/api";
import { convex } from "@/lib/convex-client";
import { encrypt } from "@/lib/encrypt";

export const completeOnboarding = async (formData: FormData) => {
	const clientSecret = formData.get("clientSecret") as string;
	const apiKey = formData.get("apiKey") as string;
	const clientId = formData.get("clientId") as string;

	if (!clientId || !clientSecret || !apiKey) {
		return { error: "All fields are required." };
	}

	const { isAuthenticated, userId } = await auth();

	if (!isAuthenticated) {
		return { error: "No Logged In User" };
	}

	const user = await currentUser();

	if (!user || !userId) {
		return { error: "User not found." };
	}

	const client = await clerkClient();

	try {
		const dbUser = await convex.query(api.users.current, {
			clerkId: userId!,
		});

		const integration = await convex.mutation(
			api.integrations.addIntegration,
			{
				userId: dbUser!._id,
				clientId: clientId,
				clientSecret: encrypt(clientSecret),
				apiKey: encrypt(apiKey),
			}
		);

		const res = await client.users.updateUser(userId, {
			publicMetadata: {
				onboardingComplete: true,
				integrationId: integration,
			},
		});
		console.log("Updated user public metadata:", res.publicMetadata);

		return { message: res.publicMetadata };
	} catch (err) {
		return { error: "There was an error updating the user metadata." };
	}
};
