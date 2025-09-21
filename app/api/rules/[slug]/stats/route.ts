import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRuleBySlug } from '@/lib/data-loader';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Check if rule exists in our file system
    const rule = await getRuleBySlug(slug);
    if (!rule) {
      return NextResponse.json(
        { error: 'Rule not found' },
        { status: 404 }
      );
    }

    // Get stats from Supabase (create if doesn't exist)
    const stats = await prisma.rule.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title: rule.title,
        description: rule.description,
        content: rule.content,
        viewCount: 0,
        copyCount: 0,
        upvotes: 0,
        downvotes: 0,
        isPublished: true
      },
      select: {
        upvotes: true,
        downvotes: true
      }
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching rule stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}