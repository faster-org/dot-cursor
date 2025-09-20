import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { voteType, previousVote } = body

    if (voteType !== null && voteType !== 'up' && voteType !== 'down') {
      return NextResponse.json(
        { error: 'Invalid vote type. Must be "up", "down", or null' },
        { status: 400 }
      )
    }

    const rule = await prisma.rule.findUnique({
      where: { id }
    })

    if (!rule) {
      return NextResponse.json(
        { error: 'Rule not found' },
        { status: 404 }
      )
    }

    // Calculate vote changes based on previous vote
    let upvoteChange = 0
    let downvoteChange = 0

    if (voteType === null) {
      // Removing a vote
      if (previousVote === 'up') {
        upvoteChange = -1
      } else if (previousVote === 'down') {
        downvoteChange = -1
      }
    } else if (previousVote === 'up' && voteType === 'down') {
      // Switching from upvote to downvote
      upvoteChange = -1
      downvoteChange = 1
    } else if (previousVote === 'down' && voteType === 'up') {
      // Switching from downvote to upvote
      upvoteChange = 1
      downvoteChange = -1
    } else if (previousVote === null) {
      // First time voting
      if (voteType === 'up') {
        upvoteChange = 1
      } else {
        downvoteChange = 1
      }
    }

    // Update the vote count
    const updatedRule = await prisma.rule.update({
      where: { id },
      data: {
        upvotes: Math.max(0, rule.upvotes + upvoteChange),
        downvotes: Math.max(0, rule.downvotes + downvoteChange),
      }
    })

    return NextResponse.json({
      success: true,
      upvotes: updatedRule.upvotes,
      downvotes: updatedRule.downvotes
    })
  } catch (error) {
    console.error('Error voting on rule:', error)
    return NextResponse.json(
      { error: 'Failed to vote on rule' },
      { status: 500 }
    )
  }
}