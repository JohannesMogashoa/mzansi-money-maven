// convex/syncLogs.ts

import { ConvexError } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new ConvexError("Not authenticated");

		const user = await ctx.db
			.query("users")
			.withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
			.first();

		if (!user) return [];

		const logs = await ctx.db
			.query("syncLogs")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.order("desc")
			.take(10);

		return logs;
	},
});
