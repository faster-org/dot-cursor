import { Rule, Category, RuleWithStats } from '@/data/types';
import { categories } from '@/data/categories';
import { prisma } from '@/lib/prisma';

// Import all rules statically
import { rule as nextjsAppRouter } from '@/data/rules/nextjs-app-router';
import { rule as tailwindCss } from '@/data/rules/tailwind-css';
import { rule as pythonFastapi } from '@/data/rules/python-fastapi';
import { rule as reactHooks } from '@/data/rules/react-hooks';

// Cache for rules to avoid re-reading files
let rulesCache: Rule[] | null = null;

// Load all rules from the data/rules directory
export async function loadRules(): Promise<Rule[]> {
	if (rulesCache) return rulesCache;

	// Statically import all rules
	const rules: Rule[] = [
		nextjsAppRouter,
		tailwindCss,
		pythonFastapi,
		reactHooks,
		// Add more rules here as they are created
	];

	rulesCache = rules;
	return rules;
}

// Get all categories
export function getCategories(): Category[] {
	return categories;
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
	const allCategories = getCategories();
	const allRules = await getRulesWithStats();

	return allCategories.map(category => ({
		...category,
		rules: allRules.filter(rule => rule.categories.includes(category.slug))
	})).filter(category => category.rules.length > 0); // Only return categories with rules
}

// Get categories with rules (without stats - for fast SSR)
export async function getCategoriesWithRulesNoStats(): Promise<(Category & { rules: (Rule & { upvotes: number; downvotes: number; viewCount: number; copyCount: number })[] })[]> {
	const allCategories = getCategories();
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