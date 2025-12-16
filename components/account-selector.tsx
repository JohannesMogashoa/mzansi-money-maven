"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { useEffect } from "react";
import { useInvestec } from "@/lib/contexts/investec-context";

const AccountSelector = () => {
	const { accounts, selectedAccount, setSelectedAccountById, loadAccounts } =
		useInvestec();

	useEffect(() => {
		loadAccounts();
	}, []);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">
					{selectedAccount?.productName ?? (
						<Coins className="w-5 h-5 text-muted-foreground" />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
				<DropdownMenuLabel>Your Accounts</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup
					value={selectedAccount?.accountId || ""}
					onValueChange={setSelectedAccountById}
				>
					<DropdownMenuRadioItem value="">
						Select an account
					</DropdownMenuRadioItem>
					{accounts.map((account) => (
						<DropdownMenuRadioItem
							key={account.accountId}
							value={account.accountId}
						>
							{account.productName}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default AccountSelector;
