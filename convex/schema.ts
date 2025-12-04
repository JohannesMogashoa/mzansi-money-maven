/**
 * Convex Database Schema
 *
 * Defines the structure of all data stored in Convex for the AI Podcast Assistant.
 * Convex provides real-time reactivity, automatic TypeScript types, and ACID transactions.
 *
 * Key Design Decisions:
 * - Single "projects" table stores all podcast processing data
 * - Denormalized structure (all data in one document) for real-time updates and atomic writes
 * - Optional fields allow progressive data population as Inngest jobs complete
 * - jobStatus tracks each generation step independently for granular UI feedback
 * - Indexes optimize common queries (user's projects, filtering by status, sorting by date)
 */

// convex/schema.ts

// convex/schema.ts

import { defineSchema, defineTable } from "convex/server";

import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		name: v.string(),
		email: v.string(),
		createdAt: v.number(),
	}).index("by_email", ["email"]),

	integration: defineTable({
		// users.id < integration
		userId: v.id("users"),
		clientId: v.string(),
		clientSecret: v.string(),
		apiKey: v.string(),
	}).index("by_userId", ["userId"]),

	insight: defineTable({
		// users.id < insight
		userId: v.id("users"),
		month: v.string(),
	})
		.index("by_userId", ["userId"])
		.index("by_userId_month", ["userId", "month"]),

	spending: defineTable({
		// insight.id < spending
		insightId: v.id("insight"),
		title: v.string(),
		amount: v.number(),
	}).index("by_insightId", ["insightId"]),

	pattern: defineTable({
		// insight.id < pattern
		insightId: v.id("insight"),
		title: v.string(),
		description: v.string(),
		updatedAt: v.number(),
	}).index("by_insightId", ["insightId"]),

	tips: defineTable({
		// users < tips
		userId: v.id("users"),
		title: v.string(),
		description: v.string(),
		impact: v.string(), // enum in your model
		category: v.string(), // enum in your model
	}).index("by_userId", ["userId"]),

	achievements: defineTable({
		// users < achievements
		userId: v.id("users"),
		title: v.string(),
		description: v.string(),
		badges: v.string(),
	}).index("by_userId", ["userId"]),

	nudges: defineTable({
		// users < nudges
		userId: v.id("users"),
		title: v.string(),
		description: v.string(),
		savings: v.string(),
		priority: v.string(), // enum in your model
		action: v.string(),
		icon: v.string(),
	}).index("by_userId", ["userId"]),
});
