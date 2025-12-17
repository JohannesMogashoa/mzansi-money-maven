"use client";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { InvestecProvider } from "../contexts/investec-context";
import { ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
	throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file");
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export default function ConvexClientProvider({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
			<InvestecProvider>{children}</InvestecProvider>
		</ConvexProviderWithClerk>
	);
}
