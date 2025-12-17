export function normalizeMerchant(description: string): string {
	return description
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, "")
		.replace(/\b(za|pty|ltd|store|branch|online|approved|payment)\b/g, "")
		.replace(/\s+/g, " ")
		.trim();
}
