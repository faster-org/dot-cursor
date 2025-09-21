"use client";

import { useState, useEffect, useCallback } from "react";

interface RuleStats {
	upvotes: number;
	downvotes: number;
}

export function useRuleStats(slug: string) {
	const [stats, setStats] = useState<RuleStats>({
		upvotes: 0,
		downvotes: 0
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadStats = async () => {
			try {
				const response = await fetch(`/api/rules/${slug}/stats`);
				if (response.ok) {
					const data = await response.json();
					setStats(data);
				} else {
					setError("Failed to load stats");
				}
			} catch (err) {
				console.warn("Failed to load stats:", err);
				setError("Failed to load stats");
			} finally {
				setLoading(false);
			}
		};

		loadStats();
	}, [slug]);

	const updateStats = useCallback((newStats: Partial<RuleStats>) => {
		setStats(prev => ({ ...prev, ...newStats }));
	}, []);

	return {
		stats,
		loading,
		error,
		updateStats
	};
}