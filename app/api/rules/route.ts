import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

interface RuleWithCategories {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  viewCount: number;
  copyCount: number;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  categories: Array<{
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

function transformRule(rule: RuleWithCategories) {
  return {
    ...rule,
    categories: rule.categories?.map((rc) => rc.category) || []
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sortBy = searchParams.get('sortBy') || 'createdAt'

    const skip = (page - 1) * limit

    const where = {
      isPublished: true,
      ...(category && {
        categories: {
          some: {
            category: {
              slug: category
            }
          }
        }
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ]
      })
    }

    const orderBy = sortBy === 'popular'
      ? { copyCount: 'desc' }
      : sortBy === 'votes'
      ? { upvotes: 'desc' }
      : { createdAt: 'desc' }

    const [rules, total] = await Promise.all([
      prisma.rule.findMany({
        where,
        include: {
          categories: {
            include: {
              category: true
            }
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.rule.count({ where })
    ])

    return NextResponse.json({
      rules: rules.map(transformRule),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching rules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, content, categoryId } = body

    if (!title || !description || !content) {
      return NextResponse.json(
        { error: 'Title, description, and content are required' },
        { status: 400 }
      )
    }

    const slug = slugify(title)

    // Check if slug already exists
    const existingRule = await prisma.rule.findUnique({
      where: { slug }
    })

    if (existingRule) {
      return NextResponse.json(
        { error: 'A rule with this title already exists' },
        { status: 400 }
      )
    }

    // Create rule
    const rule = await prisma.rule.create({
      data: {
        title,
        slug,
        description,
        content,
        categoryId,
        isPublished: true,
      },
      include: {
        category: true,
      }
    })

    return NextResponse.json(rule, { status: 201 })
  } catch (error) {
    console.error('Error creating rule:', error)
    return NextResponse.json(
      { error: 'Failed to create rule' },
      { status: 500 }
    )
  }
}