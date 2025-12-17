import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/backend";
import { httpAction } from "./_generated/server";
import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";

function getSvixHeaders(request: Request) {
	const svixId = request.headers.get("svix-id");
	const svixTimestamp = request.headers.get("svix-timestamp");
	const svixSignature = request.headers.get("svix-signature");

	if (!svixId || !svixTimestamp || !svixSignature) {
		return null;
	}

	return {
		svixId,
		svixTimestamp,
		svixSignature,
	};
}

async function verifyClerkWebhookRequest(
	request: Request
): Promise<WebhookEvent> {
	const headers = getSvixHeaders(request);
	if (!headers) {
		throw new Error("Missing Svix headers");
	}

	const secret = process.env.CLERK_WEBHOOK_SECRET;
	if (!secret) {
		throw new Error("Missing CLERK_WEBHOOK_SECRET");
	}

	const payload = await request.text();
	const webhook = new Webhook(secret);

	const event = webhook.verify(payload, {
		"svix-id": headers.svixId,
		"svix-timestamp": headers.svixTimestamp,
		"svix-signature": headers.svixSignature,
	}) as WebhookEvent;

	return event;
}

const clerkUsersWebhook = httpAction(async (ctx, request) => {
	if (request.method !== "POST") {
		return new Response("Method Not Allowed", { status: 405 });
	}

	let event: WebhookEvent;
	try {
		event = await verifyClerkWebhookRequest(request);
	} catch (err) {
		console.error("Clerk webhook verification failed:", err);
		return new Response("Invalid webhook signature", { status: 400 });
	}

	switch (event.type) {
		case "user.created":
		case "user.updated": {
			// Implement this internal mutation in convex/users.ts (example below)
			await ctx.runMutation(internal.users.upsertFromClerk, {
				data: event.data,
			});
			break;
		}

		case "user.deleted": {
			const clerkUserId: string | undefined = event.data?.id;
			if (clerkUserId) {
				// Implement this internal mutation in convex/users.ts (example below)
				await ctx.runMutation(internal.users.deleteFromClerk, {
					clerkUserId,
				});
			}
			break;
		}

		default: {
			// You can ignore other events, or add more cases (org.*, session.*, etc.)
			console.log("Ignored Clerk webhook event:", event.type);
			break;
		}
	}

	return new Response(null, { status: 200 });
});

const http = httpRouter();

http.route({
	path: "/clerk-users-webhook",
	method: "POST",
	handler: clerkUsersWebhook,
});

export default http;
