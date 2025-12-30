// app/dashboard/sync-config/page.tsx
"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

interface SyncConfig {
	interval: "EVERY_6_HOURS" | "DAILY" | "WEEKLY";
	enabled: boolean;
	lastSyncAt: string | null;
	nextSyncAt: string | null;
	clientId: string;
	accountId: string;
}

export default function SyncConfigPage() {
	const router = useRouter();
	const [config, setConfig] = useState<SyncConfig | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isSyncing, setIsSyncing] = useState(false);
	const [error, setError] = useState("");

	const [formData, setFormData] = useState({
		interval: "EVERY_6_HOURS" as const,
		enabled: true,
		clientId: "",
		clientSecret: "",
		accountId: "",
	});

	useEffect(() => {
		fetchConfig();
	}, []);

	const fetchConfig = async () => {
		try {
			const res = await fetch("/api/sync/config");
			if (res.ok) {
				const data = await res.json();
				setConfig(data);
				setFormData({
					interval: data.interval,
					enabled: data.enabled,
					clientId: data.clientId,
					clientSecret: "", // Never send back
					accountId: data.accountId,
				});
			}
		} catch (err) {
			console.error("Failed to fetch config:", err);
		}
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		setError("");

		try {
			const res = await fetch("/api/sync/config", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Failed to save configuration");
			}

			await fetchConfig();
			setIsEditing(false);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setIsSaving(false);
		}
	};

	const handleManualSync = async () => {
		setIsSyncing(true);
		setError("");

		try {
			const res = await fetch("/api/sync/manual", {
				method: "POST",
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Sync failed");
			}

			await fetchConfig();
			alert("Sync completed successfully!");
		} catch (err: any) {
			setError(err.message);
		} finally {
			setIsSyncing(false);
		}
	};

	const intervalLabels = {
		EVERY_6_HOURS: "Every 6 Hours",
		DAILY: "Daily",
		WEEKLY: "Weekly",
	};

	if (!config && !isEditing) {
		return (
			<div className="max-w-2xl mx-auto p-6">
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-4">
						Setup Transaction Sync
					</h2>
					<p className="text-gray-700 mb-4">
						Configure automatic syncing of your Investec
						transactions.
					</p>
					<button
						onClick={() => setIsEditing(true)}
						className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
					>
						Setup Now
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">
				Transaction Sync Settings
			</h1>

			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}

			{!isEditing && config ? (
				<div className="space-y-6">
					{/* Current Configuration */}
					<div className="bg-white border rounded-lg p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold">
								Current Configuration
							</h2>
							<button
								onClick={() => setIsEditing(true)}
								className="text-blue-600 hover:text-blue-700"
							>
								Edit
							</button>
						</div>

						<dl className="space-y-3">
							<div>
								<dt className="text-sm text-gray-500">
									Status
								</dt>
								<dd className="mt-1">
									<span
										className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
											config.enabled
												? "bg-green-100 text-green-800"
												: "bg-gray-100 text-gray-800"
										}`}
									>
										{config.enabled
											? "Enabled"
											: "Disabled"}
									</span>
								</dd>
							</div>

							<div>
								<dt className="text-sm text-gray-500">
									Sync Interval
								</dt>
								<dd className="mt-1 font-medium">
									{intervalLabels[config.interval]}
								</dd>
							</div>

							<div>
								<dt className="text-sm text-gray-500">
									Last Sync
								</dt>
								<dd className="mt-1">
									{config.lastSyncAt
										? new Date(
												config.lastSyncAt
										  ).toLocaleString()
										: "Never"}
								</dd>
							</div>

							<div>
								<dt className="text-sm text-gray-500">
									Next Sync
								</dt>
								<dd className="mt-1">
									{config.nextSyncAt
										? new Date(
												config.nextSyncAt
										  ).toLocaleString()
										: "Not scheduled"}
								</dd>
							</div>

							<div>
								<dt className="text-sm text-gray-500">
									Account ID
								</dt>
								<dd className="mt-1 font-mono text-sm">
									{config.accountId}
								</dd>
							</div>
						</dl>
					</div>

					{/* Manual Sync */}
					<div className="bg-white border rounded-lg p-6">
						<h2 className="text-lg font-semibold mb-4">
							Manual Sync
						</h2>
						<p className="text-gray-600 mb-4">
							Trigger an immediate sync of your transactions.
						</p>
						<button
							onClick={handleManualSync}
							disabled={isSyncing || !config.enabled}
							className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
						>
							{isSyncing ? "Syncing..." : "Sync Now"}
						</button>
					</div>
				</div>
			) : (
				// Edit Form
				<form
					onSubmit={handleSave}
					className="bg-white border rounded-lg p-6"
				>
					<div className="space-y-4">
						<div>
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									checked={formData.enabled}
									onChange={(e) =>
										setFormData({
											...formData,
											enabled: e.target.checked,
										})
									}
									className="rounded"
								/>
								<span className="font-medium">
									Enable automatic sync
								</span>
							</label>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">
								Sync Interval
							</label>
							<select
								value={formData.interval}
								onChange={(e) =>
									setFormData({
										...formData,
										interval: e.target.value as any,
									})
								}
								className="w-full border rounded-lg px-3 py-2"
							>
								<option value="EVERY_6_HOURS">
									Every 6 Hours
								</option>
								<option value="DAILY">Daily</option>
								<option value="WEEKLY">Weekly</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">
								Investec Client ID
							</label>
							<input
								type="text"
								value={formData.clientId}
								onChange={(e) =>
									setFormData({
										...formData,
										clientId: e.target.value,
									})
								}
								className="w-full border rounded-lg px-3 py-2"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">
								Investec Client Secret
								{config && (
									<span className="text-xs text-gray-500 ml-2">
										(leave blank to keep current)
									</span>
								)}
							</label>
							<input
								type="password"
								value={formData.clientSecret}
								onChange={(e) =>
									setFormData({
										...formData,
										clientSecret: e.target.value,
									})
								}
								className="w-full border rounded-lg px-3 py-2"
								required={!config}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">
								Account ID
							</label>
							<input
								type="text"
								value={formData.accountId}
								onChange={(e) =>
									setFormData({
										...formData,
										accountId: e.target.value,
									})
								}
								className="w-full border rounded-lg px-3 py-2"
								required
							/>
						</div>
					</div>

					<div className="flex gap-3 mt-6">
						<button
							type="submit"
							disabled={isSaving}
							className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
						>
							{isSaving ? "Saving..." : "Save Configuration"}
						</button>
						{config && (
							<button
								type="button"
								onClick={() => {
									setIsEditing(false);
									setError("");
								}}
								className="border px-4 py-2 rounded-lg hover:bg-gray-50"
							>
								Cancel
							</button>
						)}
					</div>
				</form>
			)}
		</div>
	);
}
