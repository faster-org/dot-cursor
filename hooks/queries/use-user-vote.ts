'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './query-keys';

interface UserVoteResponse {
	userVote: 'up' | 'down' | null;
}

async function fetchUserVote(slug: string): Promise<UserVoteResponse> {
	const response = await fetch(`/api/rules/${slug}/vote`);

	if (!response.ok) {
		throw new Error('Failed to fetch user vote');
	}

	return response.json();
}

export function useUserVote(slug: string) {
	return useQuery({
		queryKey: queryKeys.voting.vote(slug),
		queryFn: () => fetchUserVote(slug),
		staleTime: 1000 * 30, // 30 seconds
		gcTime: 1000 * 60 * 2, // 2 minutes
	});
}