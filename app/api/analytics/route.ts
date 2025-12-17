import { AccountTransaction } from "investec-pb-api";
import { NextResponse } from "next/server";
import { buildAnalytics } from "@/utils/build-analytics";
import mockTransactions from "@/data/data.json";

export async function GET() {
	try {
		const analytics = buildAnalytics(
			mockTransactions as AccountTransaction[]
		);

		return NextResponse.json(analytics);
	} catch (error) {
		console.error("Analytics error:", error);
		return NextResponse.json(
			{ error: "Failed to build analytics" },
			{ status: 500 }
		);
	}
}
