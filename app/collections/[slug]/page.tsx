import { getCollectionBySlug, getCategories } from "@/lib/data-loader";
import { RuleCard } from "@/components/rule/rule-card";
import { notFound } from "next/navigation";
import { Package } from "lucide-react";
import { BackButton } from "@/app/rules/[slug]/back-button";
import { SiNextdotjs, SiPython, SiReact, SiHtml5 } from "@icons-pack/react-simple-icons";
import type { Metadata } from "next";

const getIconComponent = (iconName?: string) => {
	const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
		nextdotjs: SiNextdotjs,
		python: SiPython,
		react: SiReact,
		html5: SiHtml5,
	};

	const IconComponent = iconName ? iconMap[iconName] : null;
	return IconComponent;
};

export async function generateStaticParams() {
	const { collections } = await import("@/data/collections");
	return collections.map((collection) => ({
		slug: collection.slug,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const collection = await getCollectionBySlug(slug);

	if (!collection) {
		return {
			title: "Collection Not Found",
			description: "The requested collection could not be found.",
		};
	}

	return {
		title: `${collection.name} - Cursor Rules Collection`,
		description: `${collection.description} Discover ${collection.ruleDetails.length} AI rules and prompts for Cursor IDE to enhance your ${collection.name} development workflow.`,
		keywords: [
			collection.name,
			"Cursor IDE rules",
			"AI prompts",
			"development tools",
			"code automation",
			"AI-powered coding",
			...collection.name.toLowerCase().split(" "),
		],
		openGraph: {
			title: `${collection.name} - Cursor Rules Collection`,
			description: collection.description,
			url: `https://dotcursor.com/collections/${slug}`,
		},
		twitter: {
			title: `${collection.name} - Cursor Rules Collection`,
			description: collection.description,
		},
		alternates: {
			canonical: `https://dotcursor.com/collections/${slug}`,
		},
	};
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
		categories: (rule.categories || [])
			.map((catSlug) => {
				return allCategories.find((c) => c.slug === catSlug);
			})
			.filter(Boolean)
			.map((cat) => ({ id: cat?.id, name: cat?.name, slug: cat?.slug })),
	}));

	return (
		<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Back button */}
			<BackButton />

			{/* Collection Header */}
			<div className="mb-8">
				<div className="flex items-center gap-5 mb-4">
					{(() => {
						const IconComponent = getIconComponent(collection.icon);
						return IconComponent ? (
							<IconComponent className="h-14 w-14 text-foreground" />
						) : (
							<Package className="h-12 w-12 text-muted-foreground" />
						);
					})()}
					<div>
						<div>
							<div className="flex items-center gap-2 mb-2">
								<h1 className="text-3xl font-medium tracking-tight">{collection.name}</h1>
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
					<p className="text-muted-foreground text-lg">No rules in this collection yet</p>
				</div>
			)}
		</div>
	);
}
