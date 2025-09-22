import { loadRules, getCategories } from "@/lib/data-loader";
import { BrowseClient } from "./browse-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Browse Cursor Rules - Cursor IDE Community Prompts & Configurations",
	description:
		"Browse all rules for Cursor IDE. Filter by category to find React, Python, Next.js, and other development-specific AI prompts and automation rules.",
	keywords: [
		"browse Cursor IDE rules",
		"AI prompts catalog",
		"development AI rules",
		"code automation prompts",
		"Cursor IDE configurations",
		"programming AI assistance",
		"React AI rules",
		"Python prompts",
		"Next.js AI rules",
		"development workflow automation",
	],
	openGraph: {
		title: "Browse Cursor Rules - Cursor IDE Community Prompts & Configurations",
		description:
			"Browse all rules for Cursor IDE. Filter by category to find development-specific AI prompts and automation rules.",
		url: "https://dotcursor.com/rules",
	},
	twitter: {
		title: "Browse Cursor Rules - Cursor IDE Community Prompts & Configurations",
		description:
			"Browse all rules for Cursor IDE. Filter by category to find development-specific AI prompts.",
	},
	alternates: {
		canonical: "https://dotcursor.com/rules",
	},
};

async function getInitialData() {
	// Get all rules and categories from files without stats for fast SSR
	const [allRules, allCategories] = await Promise.all([loadRules(), getCategories()]);

	// Transform categories to include rule counts and sort by rule count (descending)
	const categoriesWithCounts = allCategories
		.map((category) => ({
			...category,
			_count: {
				rules: allRules.filter((rule) => rule.categories?.includes(category.slug)).length,
			},
		}))
		.sort((a, b) => b._count.rules - a._count.rules);

	// Transform rules to match expected format with default stats
	const transformedRules = allRules.map((rule) => ({
		...rule,
		// Add default stats that will be loaded client-side
		upvotes: 0,
		downvotes: 0,
		viewCount: 0,
		copyCount: 0,
		categories: (rule.categories || [])
			.map((catSlug) => allCategories.find((c) => c.slug === catSlug))
			.filter(Boolean)
			.map((cat) => ({ id: cat?.id, name: cat?.name, slug: cat?.slug })),
	}));

	return {
		rules: transformedRules,
		categories: categoriesWithCounts,
	};
}

export default async function BrowsePage({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const { rules, categories } = await getInitialData();

	return (
		<div className="w-full max-w-7xl mx-auto px-8 py-4">
			<div className="flex gap-8">
				<BrowseClient
					initialRules={rules}
					categories={categories}
					initialSearchParams={searchParams}
				/>
			</div>
		</div>
	);
}
