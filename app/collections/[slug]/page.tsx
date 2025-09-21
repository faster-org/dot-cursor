import { getCollectionBySlug, getCategories } from "@/lib/data-loader";
import { RuleCard } from "@/components/rule/rule-card";
import { notFound } from "next/navigation";
import { Package } from "lucide-react";
import { BackButton } from "@/app/rules/[slug]/back-button";

export async function generateStaticParams() {
	const { collections } = await import("@/data/collections");
	return collections.map((collection) => ({
		slug: collection.slug,
	}));
}

export default async function CollectionDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const collection = await getCollectionBySlug(slug);
	const allCategories = await getCategories();

	if (!collection) {
		notFound();
	}

	// Transform rules to match RuleCard interface
	const transformedRules = collection.ruleDetails.map((rule) => ({
		...rule,
		upvotes: 0,
		downvotes: 0,
		viewCount: 0,
		copyCount: 0,
		categories: rule.categories
			.map((catSlug) => {
				return allCategories.find((c) => c.slug === catSlug);
			})
			.filter(Boolean)
			.map((cat) => ({ id: cat!.id, name: cat!.name, slug: cat!.slug })),
	}));

	return (
		<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Back button */}
			<BackButton />

			{/* Collection Header */}
			<div className="mb-8">
				<div className="flex items-center gap-5 mb-4">
					{collection.icon ? (
						<span className="text-5xl">{collection.icon}</span>
					) : (
						<Package className="h-12 w-12 text-muted-foreground" />
					)}
					<div>
						<div>
							<div className="flex items-center gap-2 mb-2">
								<h1 className="text-3xl font-medium tracking-tight">
									{collection.name}
								</h1>
							</div>
							<p className="text-muted-foreground">{collection.description}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Rules Grid */}
			<div className="grid gap-6 md:grid-cols-2">
				{transformedRules.map((rule) => (
					<RuleCard key={rule.id} rule={rule} />
				))}
			</div>

			{transformedRules.length === 0 && (
				<div className="text-center py-12">
					<p className="text-muted-foreground text-lg">
						No rules in this collection yet
					</p>
				</div>
			)}
		</div>
	);
}
