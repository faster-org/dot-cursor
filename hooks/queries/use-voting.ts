'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';
import { toast } from 'sonner';

interface VoteVariables {
	ruleId: string;
	voteType: 'upvote' | 'downvote';
}

interface VoteResponse {
	success: boolean;
	upvotes: number;
	downvotes: number;
}

async function submitVote({ ruleId, voteType }: VoteVariables): Promise<VoteResponse> {
	const apiVoteType = voteType === 'upvote' ? 'up' : 'down';
	const response = await fetch(`/api/rules/${ruleId}/vote`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ voteType: apiVoteType }),
	});

	if (!response.ok) {
		let errorMessage = 'Failed to submit vote';
		try {
			const errorData = await response.json();
			errorMessage = errorData.error || errorMessage;
		} catch {
			// If JSON parsing fails, fallback to text
			try {
				errorMessage = await response.text() || errorMessage;
			} catch {
				// If everything fails, use default message
			}
		}
		throw new Error(errorMessage);
	}

	return response.json();
}

export function useVoting(ruleId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (voteType: 'upvote' | 'downvote') => submitVote({ ruleId, voteType }),
		onSuccess: () => {
			// Only invalidate stats, not user vote (we want to keep our optimistic update)
			queryClient.invalidateQueries({ queryKey: queryKeys.rules.stats(ruleId) });
		},
		// Optimistic update
		onMutate: async (voteType) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: queryKeys.rules.stats(ruleId) });
			await queryClient.cancelQueries({ queryKey: queryKeys.voting.vote(ruleId) });

			// Get previous values
			const previousStats = queryClient.getQueryData(queryKeys.rules.stats(ruleId));
			const previousUserVote = queryClient.getQueryData(queryKeys.voting.vote(ruleId));

			// Get current user vote
			const currentUserVote = (previousUserVote as { userVote: 'up' | 'down' | null })?.userVote;
			const clickedVote = voteType === 'upvote' ? 'up' : 'down';

			// Determine if this is a toggle (same vote) or a new/switch vote
			// Only toggle if we actually have a current vote AND it matches what we clicked
			const isToggle = currentUserVote !== null && currentUserVote === clickedVote;
			const newUserVote = isToggle ? null : clickedVote;



			// Optimistically update stats
			queryClient.setQueryData(queryKeys.rules.stats(ruleId), (old: unknown) => {
				const prev = (old && typeof old === 'object') ? (old as Record<string, unknown>) : {};
				const upvotes = typeof prev.upvotes === 'number' ? prev.upvotes : 0;
				const downvotes = typeof prev.downvotes === 'number' ? prev.downvotes : 0;

				let newUpvotes = upvotes;
				let newDownvotes = downvotes;

				if (isToggle) {
					// Removing the same vote
					if (clickedVote === 'up') {
						newUpvotes = Math.max(0, upvotes - 1);
					} else {
						newDownvotes = Math.max(0, downvotes - 1);
					}
				} else if (currentUserVote === 'up' && clickedVote === 'down') {
					// Switch from upvote to downvote
					newUpvotes = Math.max(0, upvotes - 1);
					newDownvotes = downvotes + 1;
				} else if (currentUserVote === 'down' && clickedVote === 'up') {
					// Switch from downvote to upvote
					newDownvotes = Math.max(0, downvotes - 1);
					newUpvotes = upvotes + 1;
				} else {
					// First time voting
					if (clickedVote === 'up') {
						newUpvotes = upvotes + 1;
					} else {
						newDownvotes = downvotes + 1;
					}
				}

				return {
					...prev,
					upvotes: newUpvotes,
					downvotes: newDownvotes,
				};
			});

			// Optimistically update user vote
			queryClient.setQueryData(queryKeys.voting.vote(ruleId), {
				userVote: newUserVote
			});

			return { previousStats, previousUserVote };
		},
		// Rollback on error and show message
		onError: (error: Error, _variables, context) => {
			if (context?.previousStats) {
				queryClient.setQueryData(queryKeys.rules.stats(ruleId), context.previousStats);
			}
			if (context?.previousUserVote) {
				queryClient.setQueryData(queryKeys.voting.vote(ruleId), context.previousUserVote);
			}
			toast.error(error.message || 'Failed to submit vote');
		},
	});
}