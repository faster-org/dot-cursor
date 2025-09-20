import { HomeClient } from '@/components/home/home-client'

async function getInitialCategoriesWithRules() {
  // Use the same API endpoint for consistency
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/categories?page=1&limit=5`, {
    cache: 'no-store' // Ensure fresh data on each load
  })

  if (!response.ok) {
    throw new Error('Failed to fetch initial categories')
  }

  return await response.json()
}

export default async function HomePage() {
	const initialData = await getInitialCategoriesWithRules()

	return <HomeClient initialData={initialData} />
}
