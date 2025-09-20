import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause - always include categories that have published rules
    const whereClause = {
      rules: {
        some: {
          rule: search ? {
            isPublished: true,
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
            ]
          } : {
            isPublished: true
          }
        }
      }
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where: whereClause,
        include: {
          rules: {
            where: {
              rule: {
                isPublished: true,
                ...(search ? {
                  OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                  ]
                } : {})
              }
            },
            include: {
              rule: {
                include: {
                  categories: {
                    include: {
                      category: true
                    }
                  }
                }
              }
            },
            orderBy: {
              rule: {
                createdAt: 'desc'
              }
            }
          },
          _count: {
            select: {
              rules: {
                where: {
                  rule: {
                    isPublished: true
                  }
                }
              }
            }
          }
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.category.count({
        where: whereClause
      })
    ])

    // Transform the data to match the expected format
    const categoriesWithRules = categories.map(category => ({
      ...category,
      rules: category.rules.map(ruleCategory => ({
        ...ruleCategory.rule,
        categories: ruleCategory.rule.categories.map(rc => rc.category)
      }))
    }))

    return NextResponse.json({
      categories: categoriesWithRules,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}