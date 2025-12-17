"use client";

import AccountSelector from "./account-selector";

const AccountNotSelected = () => {
	return (
		<div className="bg-card border border-border/40 rounded-xl p-6">
			<div className="space-y-4 text-center">
				<p className="text-muted-foreground mb-3">
					Please select an account to view any insights or analytics.
				</p>

				<AccountSelector isHeader={false} />
			</div>
		</div>
	);
};

export default AccountNotSelected;
