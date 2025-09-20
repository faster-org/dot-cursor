import { HomeClient } from '@/components/home/home-client'
import { prisma } from '@/lib/prisma'

async function getInitialCategoriesWithRules() {
  try {
    const page = 1
    const limit = 5
    const skip = (page - 1) * limit

    // Build where clause - always include categories that have published rules
    const whereClause = {
      rules: {
        some: {
          rule: {
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
                isPublished: true
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

    return {
      categories: categoriesWithRules,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch initial categories')
  }
}

export default async function HomePage() {
	const initialData = await getInitialCategoriesWithRules()

	return <HomeClient initialData={initialData} />
}
