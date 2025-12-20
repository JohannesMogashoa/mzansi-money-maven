import { OpenRouter } from "@openrouter/sdk";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "@/env";

function getBaseUrl() {
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	return `http://localhost:${process.env.PORT ?? 3000}`;
}

const DEEP_SEEK_MODEL = "deepseek/deepseek-chat-v3.1:free";
const GPT_OSS_MODEL = "openai/gpt-oss-120b:free";
const GEMINI_2_0_FLASH_MODEL = "google/gemini-2.0-flash-exp:free";
const GEMMA_3_27B_MODEL = "google/gemma-3-27b-it:free";

export enum OpenRouterModels {
	DEEP_SEEK = DEEP_SEEK_MODEL,
	GPT_OSS = GPT_OSS_MODEL,
	GEMINI_2_0_FLASH = GEMINI_2_0_FLASH_MODEL,
	GEMMA_3_27B = GEMMA_3_27B_MODEL,
}

const openRouter = new OpenRouter({
	apiKey: env.OPENROUTER_API_KEY,
	httpReferer: getBaseUrl(),
	xTitle: "Mzansi Money Maven",
});

export const aiOpenRouter = createOpenRouter({
	apiKey: env.OPENROUTER_API_KEY,
	headers: {
		xTitle: "Mzansi Money Maven",
		httpReferer: getBaseUrl(),
	},
});

export default openRouter;
