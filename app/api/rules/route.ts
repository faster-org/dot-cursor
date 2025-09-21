import { NextRequest, NextResponse } from 'next/server'
import { getRulesWithStats, getRulesByCategory, getCategories } from '@/lib/data-loader'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sortBy = searchParams.get('sortBy') || 'createdAt'

    // Get rules from files
    const rules = category
      ? await getRulesByCategory(category)
      : await getRulesWithStats()

    // Sort rules
    if (sortBy === 'popular') {
      rules.sort((a, b) => b.copyCount - a.copyCount)
    } else if (sortBy === 'votes') {
      rules.sort((a, b) => b.upvotes - a.upvotes)
    } else {
      // Sort by creation date (newest first)
      rules.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    // Paginate
    const skip = (page - 1) * limit
    const paginatedRules = rules.slice(skip, skip + limit)

    // Get all categories to transform category slugs to objects
    const allCategories = getCategories()

    // Transform to match existing format
    const transformedRules = paginatedRules.map(rule => ({
      ...rule,
      categories: rule.categories
        .map(catSlug => allCategories.find(c => c.slug === catSlug))
        .filter(Boolean)
        .map(cat => ({ id: cat!.id, name: cat!.name, slug: cat!.slug }))
    }))

    return NextResponse.json({
      rules: transformedRules,
      pagination: {
        page,
        limit,
        total: rules.length,
        totalPages: Math.ceil(rules.length / limit)
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