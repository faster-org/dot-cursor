import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getRuleBySlug } from '@/lib/data-loader'
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit'
import { validateVote, getPreviousVote } from '@/lib/vote-protection'
import { getClientIdentifier } from '@/lib/rate-limit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const clientId = getClientIdentifier(request);
    const userVote = getPreviousVote(clientId, slug);

    return NextResponse.json({
      userVote
    });
  } catch (error) {
    console.error('Error getting user vote:', error);
    return NextResponse.json(
      { error: 'Failed to get user vote' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Check rate limit for voting
    const rateLimit = await checkRateLimit(request, 'voting');
    const errorResponse = rateLimitResponse(
      rateLimit.success,
      rateLimit.limit,
      rateLimit.remaining,
      rateLimit.reset
    );
    if (errorResponse) return errorResponse;

    const { slug } = await params
    const body = await request.json()
    const { voteType } = body

    if (voteType !== null && voteType !== 'up' && voteType !== 'down') {
      return NextResponse.json(
        { error: 'Invalid vote type. Must be "up", "down", or null' },
        { status: 400 }
      )
    }

    // Validate vote and check patterns
    const validation = validateVote(request, slug, voteType);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 429 }
      );
    }

    // Check if rule exists in our file system
    const fileRule = await getRuleBySlug(slug);
    if (!fileRule) {
      return NextResponse.json(
        { error: 'Rule not found' },
        { status: 404 }
      );
    }

    // Find or create the rule in Supabase
    let rule = await prisma.rule.findUnique({
      where: { slug }
    });

    if (!rule) {
      rule = await prisma.rule.create({
        data: {
          slug,
          title: fileRule.title,
          description: fileRule.description,
          content: fileRule.content,
          upvotes: 0,
          downvotes: 0,
          viewCount: 0,
          copyCount: 0,
          isPublished: true
        }
      });
    }

    // Calculate vote changes based on tracked previous vote (from server memory)
    const previousVote = validation.previousVote;
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
    } else if (previousVote === voteType) {
      // Removing same vote (toggle off)
      if (voteType === 'up') {
        upvoteChange = -1
      } else {
        downvoteChange = -1
      }
      // Actually set voteType to null for toggle
      // This is handled by the client already, but just to be safe
    }

    // Update the vote count
    const updatedRule = await prisma.rule.update({
      where: { id: rule.id },
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