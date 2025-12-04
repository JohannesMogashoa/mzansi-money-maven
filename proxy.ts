import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectedRoutes = createRouteMatcher(["/onboarding(.*)"]);

const dashboardRoutes = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
	const { isAuthenticated, sessionClaims, redirectToSignIn } = await auth();

	if (!isAuthenticated && (protectedRoutes(req) || dashboardRoutes(req))) {
		return redirectToSignIn({ returnBackUrl: req.url });
	}

	// Redirect to onboarding if user is authenticated but has not completed onboarding
	if (isAuthenticated) {
		if (
			!sessionClaims?.metadata?.onboardingComplete &&
			req.nextUrl.pathname !== "/onboarding"
		) {
			const onboardingUrl = new URL("/onboarding", req.url);
			return NextResponse.redirect(onboardingUrl);
		}

		if (protectedRoutes(req)) {
			return NextResponse.next();
		}
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
