import { HomeClient } from '@/components/home/home-client'
import { getCategoriesWithRulesNoStats, getFeaturedCollections } from '@/lib/data-loader'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Cursor IDE AI Rules - Community-Driven Prompts & Configurations',
	description: 'Discover and share AI-powered rules for Cursor IDE. Browse community-created prompts, configurations, and automation rules to supercharge your development workflow with AI assistance.',
	keywords: [
		'Cursor IDE',
		'AI rules',
		'AI prompts',
		'AI development',
		'code automation',
		'AI-powered coding',
		'development tools',
		'AI assistant',
		'programming prompts',
		'code generation',
		'AI configurations',
		'developer productivity'
	],
	authors: [{ name: 'Cursor Community' }],
	creator: 'Cursor Community',
	publisher: 'Cursor Community',
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://dotcursor.com',
		siteName: 'Cursor IDE Rules',
		title: 'Cursor IDE AI Rules - Community-Driven Prompts & Configurations',
		description: 'Discover and share AI-powered rules for Cursor IDE. Browse community-created prompts, configurations, and automation rules to supercharge your development workflow.',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Cursor IDE AI Rules - Community-Driven Prompts & Configurations',
		description: 'Discover and share AI-powered rules for Cursor IDE. Browse community-created prompts, configurations, and automation rules.',
		creator: '@cursor',
	},
	alternates: {
		canonical: 'https://dotcursor.com',
	},
}

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
