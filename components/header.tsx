"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { SignInButton, UserButton } from "@clerk/nextjs";

import AccountSelector from "./account-selector";
import { Brain } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
	const isMobile = useIsMobile();
	return (
		<header className="border-b border-border/40 backdrop-blur-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
						<Brain className="w-5 h-5 text-primary" />
					</div>
					<span className="text-lg font-semibold text-foreground">
						Ascendia
					</span>
				</div>
				<Authenticated>
					<div className="flex items-center gap-3">
						<AccountSelector />
						<UserButton />
					</div>
				</Authenticated>
				<Unauthenticated>
					<NavigationMenu
						viewport={isMobile}
						className="hidden md:flex gap-8 items-center"
					>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuLink
									asChild
									className={navigationMenuTriggerStyle()}
								>
									<Link
										href="/"
										className="text-muted-foreground hover:text-foreground transition"
									>
										Home
									</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									asChild
									className={navigationMenuTriggerStyle()}
								>
									<Link
										href="#"
										className="text-muted-foreground hover:text-foreground transition"
									>
										Features
									</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									asChild
									className={navigationMenuTriggerStyle()}
								>
									<Link
										href="#"
										className="text-muted-foreground hover:text-foreground transition"
									>
										How It Works
									</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<SignInButton>
									<Button
										variant="default"
										className="bg-primary hover:bg-primary/90 text-primary-foreground"
									>
										<Link href="#">Get Started</Link>
									</Button>
								</SignInButton>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</Unauthenticated>
			</div>
		</header>
	);
};

export default Header;
