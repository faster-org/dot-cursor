import { RuleCard } from "@/components/rule/rule-card";
import { loadRules, getCategories } from "@/lib/data-loader";
import { Rule } from "@/data/types";

async function getTrendingRules() {
	// Get all rules from files without stats for fast SSR
	const allRules = await loadRules();
	const allCategories = await getCategories();

	// Transform rules to match expected format for RuleCard
	const transformedRules = allRules.map((rule) => ({
		...rule,
		// Add default stats that will be loaded client-side
		upvotes: 0,
		downvotes: 0,
		viewCount: 0,
		copyCount: 0,
		createdAt: rule.createdAt,
		categories: rule.categories
			.map((catSlug) => allCategories.find((c) => c.slug === catSlug))
			.filter(Boolean)
			.map((cat) => ({ id: cat!.id, name: cat!.name, slug: cat!.slug })),
	}));

	// Sort by creation date since we don't have view counts at SSR time
	// Most recent first for "trending"
	return transformedRules
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		)
		.slice(0, 24);
}

interface TrendingRule extends Rule {
	upvotes: number;
	downvotes: number;
	viewCount: number;
	copyCount: number;
	categories: Array<{
		id: string;
		name: string;
		slug: string;
	}>;
}

function RuleGrid({ rules }: { rules: TrendingRule[] }) {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{rules.length > 0 ? (
				rules.map((rule) => <RuleCard key={rule.id} rule={rule} />)
			) : (
				<div className="col-span-full text-center py-12">
					<p className="text-muted-foreground">No trending rules found</p>
				</div>
			)}
		</div>
	);
}

export default async function TrendingPage() {
	const trendingRules = await getTrendingRules();

	return (
		<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-2">
					<h1 className="text-3xl font-medium tracking-tight">
						Trending Rules
					</h1>
				</div>
				<p className="text-muted-foreground">
					Most viewed rules across the platform
				</p>
			</div>

			<RuleGrid rules={trendingRules} />
		</div>
	);
}
