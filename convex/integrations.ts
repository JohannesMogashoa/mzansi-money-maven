import { mutation, query } from "./_generated/server";

import { v } from "convex/values";

export const addIntegration = mutation({
	args: {
		userId: v.id("users"),
		clientId: v.string(),
		clientSecret: v.string(),
		apiKey: v.string(),
	},
	handler: async (ctx, { userId, clientId, clientSecret, apiKey }) => {
		const integrationId = await ctx.db.insert("integration", {
			userId,
			clientId,
			clientSecret,
			apiKey,
		});
		return integrationId;
	},
});

export const getIntegrationById = query({
	args: {
		integrationId: v.id("integration"),
	},
	handler: async (ctx, { integrationId }) => {
		return await ctx.db.get(integrationId);
	},
});

export const getIntegrationByUserId = query({
	args: {
		userId: v.id("users"),
	},
	handler: async (ctx, { userId }) => {
		const integration = await ctx.db
			.query("integration")
			.filter((q) => q.eq(q.field("userId"), userId))
			.first();
		return integration;
	},
});
