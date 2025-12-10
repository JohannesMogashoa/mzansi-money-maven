import { mutation, query } from "./_generated/server";

import { v } from "convex/values";

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
