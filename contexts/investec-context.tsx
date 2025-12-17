import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { fetchAccountTransactions, fetchAccounts } from "@/actions/accounts";

import { Account } from "@/types/globals";
import { AccountTransaction } from "investec-pb-api";
import { AnalyticsResponse } from "@/types/analytics-response";
import { Authenticated } from "convex/react";
import { PatternResult } from "@/types/pattern";
import { aggregateByCategory } from "@/utils/aggregates";
import { buildAnalytics } from "@/utils/build-analytics";
import { buildPatterns } from "@/lib/patterns/engine";
import { processInvestecTransactions } from "@/utils/process-transactions";
import { setUserPreferenceAccount } from "@/actions/users";
import { toast } from "sonner";

export interface InvestecClientState {
	accounts: Account[];
	selectedAccount: Account | null;
	transactions: AccountTransaction[];
	accountBalance: number | null;

	isLoadingAccounts: boolean;
	isLoadingTransactions: boolean;
	error: string | null;

	analytics: AnalyticsResponse;
	patterns: PatternResult[];

	setAccounts: (accounts: Account[]) => void;
	setSelectedAccountById: (accountId: string) => void;
	setTransactions: (transactions: AccountTransaction[]) => void;
	clearState: () => void;

	loadAccounts: () => Promise<void>;
	loadAccountTransactions: (accountId: string) => Promise<void>;
}

const InvestecContext = createContext<InvestecClientState | undefined>(
	undefined
);

interface InvestecProviderProps {
	children: React.ReactNode;
}

export const InvestecProvider: React.FC<InvestecProviderProps> = ({
	children,
}) => {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [selectedAccount, setSelectedAccount] = useState<Account | null>(
		null
	);
	const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
	const [accountBalance, setAccountBalance] = useState<number | null>(null);
	const [isLoadingAccounts, setIsLoadingAccounts] = useState<boolean>(false);
	const [isLoadingTransactions, setIsLoadingTransactions] =
		useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [analytics, setAnalytics] = useState<AnalyticsResponse>(
		{} as AnalyticsResponse
	);
	const [patterns, setPatterns] = useState<PatternResult[]>([]);

	const setSelectedAccountById = (accountId: string) => {
		const account =
			accounts.find((acc) => acc.accountId === accountId) || null;
		setSelectedAccount(account);
		setTransactions([]); // Clear transactions when account changes
		loadAccountTransactions(accountId);
	};

	const clearState = () => {
		setAccounts([]);
		setSelectedAccount(null);
		setTransactions([]);
		setError(null);
	};

	const loadAccounts = useCallback(async () => {
		setIsLoadingAccounts(true);
		setError(null);

		try {
			var response = await fetchAccounts();

			if (response.error && response.accounts.length === 0) {
				throw new Error("Failed to fetch accounts.");
			}

			setAccounts(response.accounts);
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Unable to fetch accounts"
			);
		} finally {
			setIsLoadingAccounts(false);
		}
	}, []);

	const loadAccountTransactions = useCallback(async (accountId: string) => {
		setIsLoadingTransactions(true);
		setError(null);

		try {
			const response = await setUserPreferenceAccount(accountId);

			if (response.error) {
				throw new Error(response.error);
			}

			const result = await fetchAccountTransactions(accountId);

			if (result.error) {
				throw new Error(result.error);
			}
			setAccountBalance(result.balance);
			setTransactions(result.transactions);

			const responseAnalytics = getAnalytics(result.transactions);
			const responsePatterns = getPatterns(result.transactions);

			setAnalytics(responseAnalytics);
			setPatterns(responsePatterns);
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Unable to fetch transactions"
			);
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to fetch transactions"
			);
		} finally {
			setIsLoadingTransactions(false);
		}
	}, []);

	const getPatterns = useCallback((transactions: AccountTransaction[]) => {
		const patterns = buildPatterns(transactions);
		return patterns;
	}, []);

	const getAnalytics = useCallback((transactions: AccountTransaction[]) => {
		const analytics = buildAnalytics(transactions);
		return analytics;
	}, []);

	const value: InvestecClientState = {
		accounts,
		selectedAccount,
		transactions,
		isLoadingAccounts,
		isLoadingTransactions,
		error,
		accountBalance,
		analytics,
		patterns,
		setAccounts,
		setSelectedAccountById,
		setTransactions,
		clearState,
		loadAccounts,
		loadAccountTransactions,
	};

	return (
		<InvestecContext.Provider value={value}>
			{children}
		</InvestecContext.Provider>
	);
};

export const useInvestec = (): InvestecClientState => {
	const context = useContext(InvestecContext);
	if (context === undefined) {
		throw new Error("useInvestec must be used within an InvestecProvider");
	}
	return context;
};
