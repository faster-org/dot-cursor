import { Rule, Category, RuleWithStats, Collection } from '@/data/types';
import { categories } from '@/data/categories';
import { collections } from '@/data/collections';
import { prisma } from '@/lib/prisma';
import { readdir } from 'fs/promises';
import { join } from 'path';

// Cache for rules to avoid re-reading files
let rulesCache: Rule[] | null = null;

// Automatically discover and load all rules
export async function loadRules(): Promise<Rule[]> {
	if (rulesCache) return rulesCache;

	const rules: Rule[] = [];

	try {
		// Get the rules directory path
		const rulesDir = join(process.cwd(), 'data', 'rules');

		// Read all files in the rules directory
		const files = await readdir(rulesDir);

		// Filter for TypeScript files (excluding index.ts and .d.ts)
		const ruleFiles = files.filter(file =>
			file.endsWith('.ts') &&
			!file.endsWith('.d.ts') &&
			file !== 'index.ts'
		);

		// Import each rule file dynamically
		for (const file of ruleFiles) {
			try {
				const fileName = file.replace('.ts', '');
				// Use dynamic import that works with Next.js
				const ruleModule = await import(`../data/rules/${fileName}`);

				if (ruleModule.rule && typeof ruleModule.rule === 'object') {
					rules.push(ruleModule.rule as Rule);
				} else {
					console.warn(`Rule file ${file} does not export a valid 'rule' object`);
				}
			} catch (error) {
				console.warn(`Failed to import rule from ${file}:`, error);
			}
		}
	} catch (error) {
		console.error('Error reading rules directory:', error);

		// Fallback to known rules if filesystem access fails
		const fallbackRules = await Promise.allSettled([
			import('@/data/rules/nextjs-app-router').then(m => m.rule),
			import('@/data/rules/tailwind-css').then(m => m.rule),
			import('@/data/rules/python-fastapi').then(m => m.rule),
			import('@/data/rules/react-hooks').then(m => m.rule),
			import('@/data/rules/react-query').then(m => m.rule),
		]);

		rules.push(...fallbackRules
			.filter((result): result is PromiseFulfilledResult<Rule> =>
				result.status === 'fulfilled'
			)
			.map(result => result.value)
		);
	}

	rulesCache = rules;
	return rules;
}

// Get all categories that actually have rules
export async function getCategories(): Promise<Category[]> {
	const allRules = await loadRules();

	// Get unique category slugs from rules
	const usedCategorySlugs = new Set<string>();
	allRules.forEach(rule => {
		rule.categories.forEach(catSlug => usedCategorySlugs.add(catSlug));
	});

	// Return only categories that have at least one rule
	return categories.filter(category => usedCategorySlugs.has(category.slug));
}

// Get rules with stats from Supabase (votes, views, copies)
export async function getRulesWithStats(): Promise<RuleWithStats[]> {
	const rules = await loadRules();

	// Get stats from Supabase for all rules
	const stats = await prisma.rule.findMany({
		select: {
			slug: true,
			upvotes: true,
			downvotes: true,
			viewCount: true,
			copyCount: true
		}
	});

	// Create a map of slug to stats
	const statsMap = new Map(stats.map(s => [s.slug, s]));

	// Merge rules with their stats
	return rules.map(rule => {
		const ruleStats = statsMap.get(rule.slug);
		return {
			...rule,
			upvotes: ruleStats?.upvotes || 0,
			downvotes: ruleStats?.downvotes || 0,
			viewCount: ruleStats?.viewCount || 0,
			copyCount: ruleStats?.copyCount || 0
		};
	});
}

// Get a single rule by slug
export async function getRuleBySlug(slug: string): Promise<Rule | null> {
	const rules = await loadRules();
	return rules.find(r => r.slug === slug) || null;
}

// Get a single rule without stats (for fast SSR)
export async function getRuleWithoutStats(slug: string): Promise<RuleWithStats | null> {
	const rule = await getRuleBySlug(slug);
	if (!rule) return null;

	return {
		...rule,
		upvotes: 0,
		downvotes: 0,
		viewCount: 0,
		copyCount: 0
	};
}

// Get a single rule with stats
export async function getRuleWithStats(slug: string): Promise<RuleWithStats | null> {
	const rule = await getRuleBySlug(slug);
	if (!rule) return null;

	// Get or create stats in Supabase
	let stats = await prisma.rule.findUnique({
		where: { slug },
		select: {
			upvotes: true,
			downvotes: true,
			viewCount: true,
			copyCount: true
		}
	});

	// If no stats exist, create an entry
	if (!stats) {
		stats = await prisma.rule.create({
			data: {
				slug,
				title: rule.title,
				description: rule.description,
				content: rule.content,
				upvotes: 0,
				downvotes: 0,
				viewCount: 0,
				copyCount: 0,
				isPublished: true
			},
			select: {
				upvotes: true,
				downvotes: true,
				viewCount: true,
				copyCount: true
			}
		});
	}

	return {
		...rule,
		upvotes: stats.upvotes,
		downvotes: stats.downvotes,
		viewCount: stats.viewCount,
		copyCount: stats.copyCount
	};
}

// Get rules by category
export async function getRulesByCategory(categorySlug: string): Promise<RuleWithStats[]> {
	const allRules = await getRulesWithStats();
	return allRules.filter(rule => rule.categories.includes(categorySlug));
}

// Get categories with rules
export async function getCategoriesWithRules(): Promise<(Category & { rules: RuleWithStats[] })[]> {
	const allCategories = await getCategories();
	const allRules = await getRulesWithStats();

	return allCategories.map(category => ({
		...category,
		rules: allRules.filter(rule => rule.categories.includes(category.slug))
	})).filter(category => category.rules.length > 0); // Only return categories with rules
}

// Get categories with rules (without stats - for fast SSR)
export async function getCategoriesWithRulesNoStats(): Promise<(Category & { rules: (Rule & { upvotes: number; downvotes: number; viewCount: number; copyCount: number })[] })[]> {
	const allCategories = await getCategories();
	const allRules = await loadRules();

	// Add default stats to rules
	const rulesWithDefaultStats = allRules.map(rule => ({
		...rule,
		upvotes: 0,
		downvotes: 0,
		viewCount: 0,
		copyCount: 0
	}));

	return allCategories.map(category => ({
		...category,
		rules: rulesWithDefaultStats.filter(rule => rule.categories.includes(category.slug))
	})).filter(category => category.rules.length > 0); // Only return categories with rules
}

// Get all collections
export function getCollections(): Collection[] {
	return collections;
}

// Get featured collections
export function getFeaturedCollections(): Collection[] {
	return collections.filter(c => c.featured);
}

// Get collection by slug with its rules
export async function getCollectionBySlug(slug: string): Promise<(Collection & { ruleDetails: Rule[] }) | null> {
	const collection = collections.find(c => c.slug === slug);
	if (!collection) return null;

	const allRules = await loadRules();
	const ruleDetails = collection.rules
		.map(ruleSlug => allRules.find(r => r.slug === ruleSlug))
		.filter(Boolean) as Rule[];

	return {
		...collection,
		ruleDetails
	};
}

// Get collections with rule details for homepage
export async function getCollectionsWithRules(): Promise<(Collection & { ruleDetails: Rule[]; ruleCount: number })[]> {
	const allRules = await loadRules();

	return collections.map(collection => {
		const ruleDetails = collection.rules
			.map(ruleSlug => allRules.find(r => r.slug === ruleSlug))
			.filter(Boolean) as Rule[];

		return {
			...collection,
			ruleDetails,
			ruleCount: ruleDetails.length
		};
	});
}

// Search rules (client-side only now)
export async function searchRules(query: string): Promise<RuleWithStats[]> {
	const rules = await getRulesWithStats();
	const lowerQuery = query.toLowerCase();

	return rules.filter(rule =>
		rule.title.toLowerCase().includes(lowerQuery) ||
		rule.description.toLowerCase().includes(lowerQuery) ||
		rule.content.toLowerCase().includes(lowerQuery) ||
		rule.categories.some(cat => cat.toLowerCase().includes(lowerQuery)) ||
		(rule.tags && rule.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
	);
}