import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRuleWithoutStats, getCategories } from "@/lib/data-loader";
import { RuleActions } from "./rule-actions";
import { BackButton } from "./back-button";
import { ViewTracker } from "./view-tracker";
import { RuleStatsProvider } from "./rule-stats-provider";

async function getRule(slug: string) {
	const rule = await getRuleWithoutStats(slug);
	return rule;
}

export default async function RulePage({
	params,
}: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const rule = await getRule(slug);
	const allCategories = await getCategories();

	if (!rule) {
		notFound();
	}

	return (
		<RuleStatsProvider slug={rule.slug}>
			<div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<ViewTracker slug={rule.slug} />
				<BackButton />

				<div className="mb-4">
					<h1 className="text-3xl font-medium mb-4">{rule.title}</h1>
					<p className="text-lg text-muted-foreground mb-4">
						{rule.description}
					</p>

					<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
						{rule.categories && rule.categories.length > 0 && (
							<div className="flex gap-2">
								{rule.categories
									.map((catSlug: string) => {
										const category = allCategories.find(
											(c) => c.slug === catSlug,
										);
										if (!category) return null;
										return (
											<Link
												key={category.slug}
												href={`/rules?category=${category.slug}`}
											>
												<Badge variant="outline" className="text-sm">
													{category.name}
												</Badge>
											</Link>
										);
									})
									.filter(Boolean)}
							</div>
						)}
					</div>
				</div>
				<div className="flex items-center justify-between mb-4">
					<RuleActions rule={rule} />
				</div>
				<Card>
					<CardContent>
						<pre className="overflow-x-auto">
							<code className="text-sm font-mono">{rule.content}</code>
						</pre>
					</CardContent>
				</Card>
			</div>
		</RuleStatsProvider>
	);
}
