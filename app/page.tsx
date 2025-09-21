import { HomeClient } from '@/components/home/home-client'
import { getCategoriesWithRulesNoStats, getFeaturedCollections } from '@/lib/data-loader'

async function getAllCategoriesWithRules() {
  try {
    const categoriesWithRules = await getCategoriesWithRulesNoStats()

    // Transform ALL categories to match the existing format
    const transformedCategories = categoriesWithRules.map(category => ({
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

    return transformedCategories
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
}

async function getCollectionsData() {
	const collections = getFeaturedCollections();
	// Add rule count to collections
	const collectionsWithCount = collections.map(collection => ({
		...collection,
		ruleCount: collection.rules.length
	}));
	return collectionsWithCount;
}

export default async function HomePage() {
	const [allCategories, collections] = await Promise.all([
		getAllCategoriesWithRules(),
		getCollectionsData()
	]);

	return <HomeClient allCategories={allCategories} collections={collections} />;
}
