import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Try to find by ID first, then by slug
    const rule = await prisma.rule.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ],
        isPublished: true
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!rule) {
      return NextResponse.json(
        { error: 'Rule not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.rule.update({
      where: { id: rule.id },
      data: {
        viewCount: { increment: 1 }
      }
    })

    return NextResponse.json(rule)
  } catch (error) {
    console.error('Error fetching rule:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rule' },
      { status: 500 }
    )
  }
}