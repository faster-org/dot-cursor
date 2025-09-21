import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RuleCard } from "@/components/rule/rule-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

interface Rule {
	id: string;
	title: string;
	slug: string;
	description: string;
	content: string;
	viewCount: number;
	copyCount: number;
	upvotes: number;
	downvotes: number;
	createdAt: string;
	category?: {
		name: string;
		slug: string;
	};
}

interface CategorizedRulesProps {
	categoriesWithRules: Array<{
		id: string;
		name: string;
		slug: string;
		description?: string;
		rules: Rule[];
	}>;
	searchTerm?: string;
	loading?: boolean;
	isClientFiltering?: boolean;
}

export function CategorizedRules({
	categoriesWithRules,
	searchTerm,
	loading = false,
}: CategorizedRulesProps) {
	// Categories are already filtered by the parent component
	const displayCategories = categoriesWithRules;

	if (loading && displayCategories.length === 0) {
		return (
			<section className="w-full pb-16">
				<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="space-y-16">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="space-y-6">
								<Skeleton className="h-8 w-48" />
								<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
									{[...Array(3)].map((_, j) => (
										<Skeleton key={j} className="h-[200px]" />
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}

	if (!displayCategories.length && !loading) {
		return (
			<section className="w-full pb-16">
				<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center py-12">
						{searchTerm ? (
							<>
								<p className="text-muted-foreground text-lg">
									No rules found for &quot;{searchTerm}&quot;
								</p>
								<p className="text-muted-foreground text-sm mt-2">
									Try searching with different keywords
								</p>
							</>
						) : (
							<>
								<p className="text-muted-foreground text-lg">
									No rules available yet
								</p>
								<Link href="/submit">
									<Button className="mt-4">Submit the first rule</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="w-full pb-16">
			<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="space-y-16">
					{displayCategories.map((category) => (
						<div key={category.id} className="flex flex-col gap-4">
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-lg font-medium">{category.name}</h2>
								</div>
								<Link
									className="transition-colors text-sm font-medium text-muted-foreground hover:text-foreground flex flex-row items-center gap-2"
									href={`/rules?category=${category.slug}`}
								>
									View all
									<ArrowRight className="h-3.5 w-3.5" />
								</Link>
							</div>
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{(searchTerm
									? category.rules
									: category.rules.slice(0, 20)
								).map((rule) => (
									<RuleCard key={rule.id} rule={rule} />
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
