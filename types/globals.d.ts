interface Account {
	accountId: string;
	accountNumber: string;
	accountName: string;
	referenceName: string;
	productName: string;
	kycCompliant: boolean;
	profileId: string;
	profileName: string;
}

export { Account };

declare global {
	interface CustomJwtSessionClaims {
		metadata: {
			onboardingComplete?: boolean;
			integrationId?: string;
		};
	}
}
