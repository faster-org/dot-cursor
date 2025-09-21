import { HomeClient } from '@/components/home/home-client'
import { getCategoriesWithRulesNoStats } from '@/lib/data-loader'

async function getInitialCategoriesWithRules() {
  try {
    const categoriesWithRules = await getCategoriesWithRulesNoStats()

    // Take first 5 categories for initial load
    const paginatedCategories = categoriesWithRules.slice(0, 5)

    // Transform to match the existing format
    const transformedCategories = paginatedCategories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      rules: category.rules.map(rule => ({
        ...rule,
        categories: rule.categories
          .map(catSlug => categoriesWithRules.find(c => c.slug === catSlug))
          .filter(Boolean)
          .map(cat => ({ name: cat!.name, slug: cat!.slug }))
      })),
      _count: {
        rules: category.rules.length
      }
    }))

    return {
      categories: transformedCategories,
      pagination: {
        page: 1,
        limit: 5,
        total: categoriesWithRules.length,
        totalPages: Math.ceil(categoriesWithRules.length / 5),
        hasMore: categoriesWithRules.length > 5
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
