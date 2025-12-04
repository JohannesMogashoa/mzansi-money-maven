"use client";

import { ArrowRight, Link } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { completeOnboarding } from "./_actions";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const OnboardingPage = () => {
	const [error, setError] = React.useState("");
	const { user } = useUser();
	const router = useRouter();

	const handleSubmit = async (formData: FormData) => {
		const res = await completeOnboarding(formData);
		if (res?.message) {
			// Forces a token refresh and refreshes the `User` object
			await user?.reload();
			router.push("/dashboard");
		}
		if (res?.error) {
			setError(res?.error);
		}
	};

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<h1 className="text-3xl font-bold mb-6">
				Welcome to Ascendia Onboarding
			</h1>

			<Card>
				<CardHeader>
					<CardTitle>Investec Integration</CardTitle>
					<CardDescription>
						We will need the following information in order to
						integrate with your Investec account.
					</CardDescription>
				</CardHeader>
				{error && <p className="text-red-600">Error: {error}</p>}
				<CardContent>
					<form
						className="flex flex-col gap-5 items-center"
						action={handleSubmit}
					>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="clientId">
									Client ID
								</FieldLabel>
								<Input
									id="clientId"
									type="text"
									placeholder="your-client-id"
									required
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="clientSecret">
									Client Secret
								</FieldLabel>
								<Input
									id="clientSecret"
									type="password"
									name="clientSecret"
									placeholder="your-client-secret"
									required
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="apiKey">
									API Key:
								</FieldLabel>
								<Input
									type="password"
									id="apiKey"
									name="apiKey"
									placeholder="your-api-key"
									required
								/>
							</Field>
							<Field>
								<Button
									className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-base"
									type="submit"
								>
									Connect to Investec
									<Link className="ml-2 w-4 h-4" />
								</Button>
								<FieldDescription className="text-center">
									Don&apos;t have credentials?{" "}
									<a
										href="#"
										target="_blank"
										rel="noopener noreferrer"
									>
										Get Credentials
									</a>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</main>
	);
};

export default OnboardingPage;
