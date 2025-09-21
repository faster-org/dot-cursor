import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRuleBySlug } from '@/lib/data-loader';

export async function POST(
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

    // Increment view count in Supabase (create record if doesn't exist)
    const updatedRule = await prisma.rule.upsert({
      where: { slug },
      update: {
        viewCount: { increment: 1 }
      },
      create: {
        slug,
        title: rule.title,
        description: rule.description,
        content: rule.content,
        viewCount: 1,
        copyCount: 0,
        upvotes: 0,
        downvotes: 0,
        isPublished: true
      }
    });

    return NextResponse.json({ success: true, viewCount: updatedRule.viewCount });
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}