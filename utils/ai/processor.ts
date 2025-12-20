import {
	ChatResponse,
	ChatStreamingResponseChunkData,
} from "@openrouter/sdk/models";
import openRouter, { OpenRouterModels } from "@/lib/open-router";

import { ChatMessage } from "./prompts";
import { EventStream } from "@openrouter/sdk/lib/event-streams.js";
import { SendChatCompletionRequestResponse } from "@openrouter/sdk/models/operations";

export async function process(
	messages: ChatMessage[],
	shouldStream = false,
	model: OpenRouterModels = OpenRouterModels.GEMINI_2_0_FLASH
): Promise<SendChatCompletionRequestResponse> {
	const fallbackModel =
		model === OpenRouterModels.GEMINI_2_0_FLASH
			? OpenRouterModels.GPT_OSS
			: OpenRouterModels.GEMINI_2_0_FLASH;

	return await openRouter.chat.send({
		models: [model, fallbackModel],
		messages,
		stream: shouldStream,
	});
}

export function isEventStream(
	response: ChatResponse | EventStream<ChatStreamingResponseChunkData>
): response is EventStream<ChatStreamingResponseChunkData> {
	return Symbol.asyncIterator in response;
}
