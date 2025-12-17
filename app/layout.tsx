import "./globals.css";

import {
	ClerkProvider,
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";
import ConvexClientProvider from "@/lib/ConvexClientProvider";
import Footer from "@/components/footer";
import Header from "@/components/header";
import type { Metadata } from "next";
import type React from "react";
import { Toaster } from "sonner";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Financial Assistant - Ascendia",
	description:
		"Intelligent financial insights powered by AI to help you understand spending patterns and improve financial behavior",
	icons: {
		icon: [
			{
				url: "/favicon-32x32.png",
				media: "(prefers-color-scheme: light)",
				type: "image/png",
				sizes: "32x32",
			},
			{
				url: "/favicon-16x16.png",
				media: "(prefers-color-scheme: dark)",
				type: "image/png",
				sizes: "16x16",
			},
		],
		apple: "/apple-touch-icon.png",
	},
	manifest: "/site.webmanifest",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`font-sans antialiased`}>
				<ClerkProvider>
					<ConvexClientProvider>
						<Header />
						<main className="min-h-screen bg-background">
							{children}
						</main>
						<Footer />
						<Analytics />
						<Toaster />
					</ConvexClientProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
