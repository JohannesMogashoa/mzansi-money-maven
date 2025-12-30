import { mutation, query } from "./_generated/server";

import { ConvexError } from "convex/values";
import { v } from "convex/values";

export const get = query({
	args: {
		userId: v.string(),
	},
	handler: async (ctx, { userId }) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
			.first();

		if (!user) return null;

		const config = await ctx.db
			.query("syncConfigs")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.first();

		if (!config) return null;

		// Don't return the secret
		return {
			interval: config.interval,
			enabled: config.enabled,
			lastSyncAt: config.lastSyncAt,
			nextSyncAt: config.nextSyncAt,
			accountId: config.accountId,
		};
	},
});

export const save = mutation({
	args: {
		interval: v.union(
			v.literal("EVERY_6_HOURS"),
			v.literal("DAILY"),
			v.literal("WEEKLY")
		),
		enabled: v.boolean(),
		accountId: v.string(),
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_clerk_id", (q) => q.eq("clerkId", args.userId))
			.first();

		if (!user) throw new ConvexError("User not found");

		const existing = await ctx.db
			.query("syncConfigs")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.first();

		const nextSyncAt = calculateNextSync(args.interval);

		const data: any = {
			userId: user._id,
			interval: args.interval,
			enabled: args.enabled,
			accountId: args.accountId,
			nextSyncAt,
		};

		if (existing) {
			await ctx.db.patch(existing._id, {
				...data,
			});
		} else {
			await ctx.db.insert("syncConfigs", data);
		}

		return { success: true };
	},
});

export const toggleEnabled = mutation({
	args: { enabled: v.boolean() },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new ConvexError("Not authenticated");

		const user = await ctx.db
			.query("users")
			.withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
			.first();

		if (!user) throw new ConvexError("User not found");

		const config = await ctx.db
			.query("syncConfigs")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.first();

		if (!config) throw new ConvexError("Config not found");

		await ctx.db.patch(config._id, {
			enabled: args.enabled,
			nextSyncAt: args.enabled
				? calculateNextSync(config.interval)
				: undefined,
		});

		return { success: true };
	},
});

function calculateNextSync(interval: string): number {
	const now = Date.now();
	switch (interval) {
		case "EVERY_6_HOURS":
			return now + 6 * 60 * 60 * 1000;
		case "DAILY":
			return now + 24 * 60 * 60 * 1000;
		case "WEEKLY":
			return now + 7 * 24 * 60 * 60 * 1000;
		default:
			return now + 6 * 60 * 60 * 1000;
	}
}
