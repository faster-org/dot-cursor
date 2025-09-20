'use client'

import { useState, useEffect } from 'react'

type VoteType = 'up' | 'down' | null

export function useVoting(ruleId: string) {
  const [userVote, setUserVote] = useState<VoteType>(null)

  // Get user's vote from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedVote = localStorage.getItem(`vote_${ruleId}`)
      if (storedVote === 'up' || storedVote === 'down') {
        setUserVote(storedVote)
      }
    }
  }, [ruleId])

  const vote = async (voteType: 'up' | 'down') => {
    try {
      // Determine new vote state (toggle if same, set if different)
      const newVote = userVote === voteType ? null : voteType;

      const response = await fetch(`/api/rules/${ruleId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voteType: newVote, // null means remove vote
          previousVote: userVote // Send previous vote for proper counting
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to vote')
      }

      const data = await response.json()

      // Store vote in localStorage
      if (typeof window !== 'undefined') {
        if (newVote) {
          localStorage.setItem(`vote_${ruleId}`, newVote)
        } else {
          localStorage.removeItem(`vote_${ruleId}`)
        }
      }

      setUserVote(newVote)

      return { success: true, ...data }
    } catch (error) {
      return { error: 'Failed to vote on rule' }
    }
  }

  const hasVoted = userVote !== null

  return {
    userVote,
    hasVoted,
    vote,
  }
}