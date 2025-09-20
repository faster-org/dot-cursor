import { RuleCard } from "@/components/rule/rule-card";
import { prisma } from "@/lib/prisma";

interface RuleWithCategories {
	id: string;
	title: string;
	slug: string;
	description: string;
	content: string;
	viewCount: number;
	copyCount: number;
	upvotes: number;
	downvotes: number;
	createdAt: Date;
	categories: Array<{
		category: {
			id: string;
			name: string;
			slug: string;
		};
	}>;
}

interface TransformedRule {
	id: string;
	title: string;
	slug: string;
	description: string;
	content: string;
	viewCount: number;
	copyCount: number;
	upvotes: number;
	downvotes: number;
	createdAt: Date;
	categories: Array<{
		id: string;
		name: string;
		slug: string;
	}>;
}

function transformRule(rule: RuleWithCategories): TransformedRule {
	return {
		...rule,
		categories: rule.categories?.map((rc) => rc.category) || [],
	};
}

async function getTrendingRules() {
	// Get rules with highest view counts (trending by popularity)
	// Since we don't track view timestamps, we'll show most viewed rules overall
	const trendingRules = await prisma.rule.findMany({
		where: {
			isPublished: true,
		},
		include: {
			categories: {
				include: {
					category: true,
				},
			},
		},
		orderBy: { viewCount: "desc" },
		take: 24,
	});

	return trendingRules.map(transformRule);
}

function RuleGrid({ rules }: { rules: TransformedRule[] }) {
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
					<h1 className="text-4xl font-medium tracking-tight">
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
