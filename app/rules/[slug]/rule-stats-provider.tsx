"use client";

import React, { createContext, useContext } from "react";
import { useRuleStats } from "@/hooks/use-rule-stats";

interface RuleStats {
	upvotes: number;
	downvotes: number;
}

interface RuleStatsContextType {
	stats: RuleStats;
	loading: boolean;
	error: string | null;
	updateStats: (newStats: Partial<RuleStats>) => void;
}

const RuleStatsContext = createContext<RuleStatsContextType | undefined>(undefined);

export function RuleStatsProvider({
	children,
	slug
}: {
	children: React.ReactNode;
	slug: string;
}) {
	const statsData = useRuleStats(slug);

	return (
		<RuleStatsContext.Provider value={statsData}>
			{children}
		</RuleStatsContext.Provider>
	);
}

export function useRuleStatsContext() {
	const context = useContext(RuleStatsContext);
	if (!context) {
		throw new Error("useRuleStatsContext must be used within RuleStatsProvider");
	}
	return context;
}