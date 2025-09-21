'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './query-keys';

interface RuleStats {
	upvotes: number;
	downvotes: number;
	viewCount: number;
	copyCount: number;
}

async function fetchRuleStats(slug: string): Promise<RuleStats> {
	const response = await fetch(`/api/rules/${slug}/stats`);

	if (!response.ok) {
		throw new Error('Failed to fetch rule stats');
	}

	return response.json();
}

export function useRuleStats(slug: string) {
	return useQuery({
		queryKey: queryKeys.rules.stats(slug),
		queryFn: () => fetchRuleStats(slug),
		staleTime: 1000 * 60 * 2, // 2 minutes
		gcTime: 1000 * 60 * 5, // 5 minutes
		refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
	});
}