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

export interface InvestecClientState {
	accounts: Account[];
	selectedAccount: Account | null;
	transactions: AccountTransaction[];
	accountBalance: number | null;

	isLoadingAccounts: boolean;
	isLoadingTransactions: boolean;
	error: string | null;

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
			const result = await fetchAccountTransactions(accountId);

			if (result.error) {
				throw new Error(result.error);
			}
			setAccountBalance(result.balance);
			setTransactions(result.transactions);
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Unable to fetch transactions"
			);
		} finally {
			setIsLoadingTransactions(false);
		}
	}, []);

	const value: InvestecClientState = {
		accounts,
		selectedAccount,
		transactions,
		isLoadingAccounts,
		isLoadingTransactions,
		error,
		accountBalance,
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
