import {
	QueryCtx,
	internalMutation,
	mutation,
	query,
} from "./_generated/server";
import { Validator, v } from "convex/values";

import { UserJSON } from "@clerk/backend";

export const createUser = mutation({
	args: {
		name: v.string(),
		email: v.string(),
		clerkId: v.string(),
	},
	handler: async (ctx, { name, email, clerkId }) => {
		const now = Date.now();
		const userId = await ctx.db.insert("users", {
			name,
			email,
			clerkId,
			createdAt: now,
			preferences: {},
		});
		return userId;
	},
});

export const current = query({
	args: {
		clerkId: v.string(),
	},
	handler: async (ctx, { clerkId }) => {
		return await userByExternalId(ctx, clerkId);
	},
});

export const upsertFromClerk = internalMutation({
	args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
	async handler(ctx, { data }) {
		const now = Date.now();

		const userAttributes = {
			name: `${data.first_name} ${data.last_name}`,
			clerkId: data.id,
			email: data.email_addresses[0]?.email_address || "",
			createdAt: now,
			preferences: {},
		};

		const user = await userByExternalId(ctx, data.id);
		if (user === null) {
			await ctx.db.insert("users", userAttributes);
		} else {
			await ctx.db.patch(user._id, userAttributes);
		}
	},
});

export const deleteFromClerk = internalMutation({
	args: { clerkUserId: v.string() },
	async handler(ctx, { clerkUserId }) {
		const user = await userByExternalId(ctx, clerkUserId);

		if (user !== null) {
			await ctx.db.delete(user._id);
		} else {
			console.warn(
				`Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
			);
		}
	},
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
	const userRecord = await getCurrentUser(ctx);
	if (!userRecord) throw new Error("Can't get current user");
	return userRecord;
}

// This only works when called by client side using convex directly

export async function getCurrentUser(ctx: QueryCtx) {
	const identity = await ctx.auth.getUserIdentity();
	if (identity === null) {
		return null;
	}
	return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, clerkId: string) {
	return await ctx.db
		.query("users")
		.withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
		.unique();
}

export const setUserAccount = mutation({
	args: {
		accountId: v.string(),
		userId: v.string(),
	},
	handler: async (ctx, { accountId, userId }) => {
		try {
			const user = await userByExternalId(ctx, userId);

			if (!user) {
				throw new Error("User not found");
			}

			await ctx.db.patch(user._id, {
				preferences: {
					accountId: accountId,
				},
			});

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
	},
});
