// convex/schema.ts

import { defineSchema, defineTable } from "convex/server";

import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		name: v.string(),
		email: v.string(),
		createdAt: v.number(),
		clerkId: v.string(),
		preferences: v.optional(
			v.object({
				accountId: v.optional(v.string()),
			})
		),
	})
		.index("by_email", ["email"])
		.index("by_clerk_id", ["clerkId"]),

	integration: defineTable({
		userId: v.id("users"),
		clientId: v.string(),
		clientSecret: v.string(),
		apiKey: v.string(),
	}).index("by_userId", ["userId"]),

	syncConfigs: defineTable({
		userId: v.id("users"),

		// Sync settings
		interval: v.union(
			v.literal("EVERY_6_HOURS"),
			v.literal("DAILY"),
			v.literal("WEEKLY")
		),
		enabled: v.boolean(),

		accountId: v.string(),

		// Sync tracking (no transaction data, just metadata)
		lastSyncAt: v.optional(v.number()),
		nextSyncAt: v.optional(v.number()),
		lastTransactionId: v.optional(v.string()), // To avoid re-processing
	})
		.index("by_userId", ["userId"])
		.index("by_nextSync", ["enabled", "nextSyncAt"]),

	syncLogs: defineTable({
		userId: v.id("users"),
		status: v.union(
			v.literal("RUNNING"),
			v.literal("SUCCESS"),
			v.literal("FAILED")
		),
		startedAt: v.number(),
		completedAt: v.optional(v.number()),

		transactionsFound: v.number(),
		transactionsProcessed: v.number(),

		error: v.optional(v.string()),
	}).index("by_userId", ["userId"]),

	insight: defineTable({
		userId: v.id("users"),
		month: v.string(),
	})
		.index("by_userId", ["userId"])
		.index("by_userId_month", ["userId", "month"]),

	spending: defineTable({
		insightId: v.id("insight"),
		title: v.string(),
		amount: v.number(),
	}).index("by_insightId", ["insightId"]),

	pattern: defineTable({
		insightId: v.id("insight"),
		title: v.string(),
		description: v.string(),
		updatedAt: v.number(),
	}).index("by_insightId", ["insightId"]),

	tips: defineTable({
		userId: v.id("users"),
		title: v.string(),
		description: v.string(),
		impact: v.string(),
		category: v.string(),
	}).index("by_userId", ["userId"]),

	achievements: defineTable({
		userId: v.id("users"),
		title: v.string(),
		description: v.string(),
		badges: v.string(),
	}).index("by_userId", ["userId"]),

	nudges: defineTable({
		userId: v.id("users"),
		title: v.string(),
		description: v.string(),
		savings: v.string(),
		priority: v.string(),
		action: v.string(),
		icon: v.string(),
	}).index("by_userId", ["userId"]),
});
