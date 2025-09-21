import { NextRequest, NextResponse } from 'next/server'
import { getCategoriesWithRules } from '@/lib/data-loader'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get all categories with rules from files
    const allCategoriesWithRules = await getCategoriesWithRules()

    // Paginate
    const skip = (page - 1) * limit
    const paginatedCategories = allCategoriesWithRules.slice(skip, skip + limit)

    // Transform to match the existing format
    const transformedCategories = paginatedCategories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      rules: category.rules.map(rule => ({
        ...rule,
        categories: rule.categories
          .map(catSlug => allCategoriesWithRules.find(c => c.slug === catSlug))
          .filter(Boolean)
          .map(cat => ({ name: cat!.name, slug: cat!.slug }))
      })),
      _count: {
        rules: category.rules.length
      }
    }))

    return NextResponse.json({
      categories: transformedCategories,
      pagination: {
        page,
        limit,
        total: allCategoriesWithRules.length,
        totalPages: Math.ceil(allCategoriesWithRules.length / limit),
        hasMore: page < Math.ceil(allCategoriesWithRules.length / limit)
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