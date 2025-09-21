import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRuleWithoutStats, getCategories } from "@/lib/data-loader";
import { RuleActions } from "./rule-actions";
import { BackButton } from "./back-button";
import { ViewTracker } from "./view-tracker";
import type { Metadata } from 'next'

async function getRule(slug: string) {
	const rule = await getRuleWithoutStats(slug);
	return rule;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const rule = await getRule(slug);
	const allCategories = await getCategories();

	if (!rule) {
		return {
			title: 'Rule Not Found',
			description: 'The requested AI rule could not be found.',
		};
	}

	// Get category names for the rule
	const categoryNames = rule.categories
		.map(catSlug => allCategories.find(c => c.slug === catSlug)?.name)
		.filter(Boolean);

	const categoryText = categoryNames.length > 0 ? ` for ${categoryNames.join(', ')}` : '';

	return {
		title: `${rule.title} - Cursor IDE AI Rule`,
		description: `${rule.description} Copy this AI rule for Cursor IDE to enhance your${categoryText} development workflow. ${rule.content.slice(0, 100)}...`,
		keywords: [
			rule.title,
			'Cursor IDE rule',
			'AI prompt',
			'code automation',
			'development tool',
			...categoryNames,
			...rule.title.toLowerCase().split(' '),
			...(rule.tags || [])
		],
		openGraph: {
			title: `${rule.title} - Cursor IDE AI Rule`,
			description: rule.description,
			url: `https://dotcursor.com/rules/${slug}`,
		},
		twitter: {
			title: `${rule.title} - Cursor IDE AI Rule`,
			description: rule.description,
		},
		alternates: {
			canonical: `https://dotcursor.com/rules/${slug}`,
		},
	};
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
			
			<Card className="my-8">
				<CardContent>
          <div className="flex items-center justify-between mb-6">
				    <RuleActions rule={rule} />
			    </div>
					<pre className="overflow-x-auto">
						<code className="text-sm font-mono">{rule.content}</code>
					</pre>
				</CardContent>
			</Card>
		</div>
	);
}
