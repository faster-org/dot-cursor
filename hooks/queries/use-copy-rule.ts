'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';

interface CopyRuleResponse {
	success: boolean;
}

async function trackCopyRule(slug: string): Promise<CopyRuleResponse> {
	const response = await fetch(`/api/rules/${slug}/copy`, {
		method: 'POST',
	});

	if (!response.ok) {
		throw new Error('Failed to track copy');
	}

	return response.json();
}

export function useCopyRule() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: trackCopyRule,
		onSuccess: (_, slug) => {
			// Invalidate stats to reflect updated copy count
			queryClient.invalidateQueries({ queryKey: queryKeys.rules.stats(slug) });
		},
		// Fire and forget - no error handling needed for tracking
		onError: () => {
			// Silently fail for tracking operations
			console.warn('Failed to track copy operation');
		},
	});
}