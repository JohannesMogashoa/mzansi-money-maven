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
