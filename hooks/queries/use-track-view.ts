'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';

interface TrackViewResponse {
	success: boolean;
	viewCount: number;
}

async function trackView(slug: string): Promise<TrackViewResponse> {
	const response = await fetch(`/api/rules/${slug}/view`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error('Failed to track view');
	}

	return response.json();
}

export function useTrackView() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: trackView,
		onSuccess: (data, slug) => {
			// Update the cached stats with the new view count
			queryClient.setQueryData(queryKeys.rules.stats(slug), (old) => {
				const prev = (old && typeof old === 'object') ? (old as Record<string, unknown>) : {};
				return {
					...prev,
					viewCount: data.viewCount,
				};
			});

			// Also invalidate to ensure fresh data
			queryClient.invalidateQueries({ queryKey: queryKeys.rules.stats(slug) });
		},
		// Fire and forget - no error handling needed for view tracking
		onError: () => {
			// Silently fail for tracking operations
			console.warn('Failed to track view');
		},
	});
}