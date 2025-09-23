"use client";

import { Collection } from "@/data/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CollectionPill } from "@/components/collection/collection-pill";

interface CollectionsSectionProps {
	collections: (Collection & { ruleCount: number })[];
}

export function CollectionsSection({ collections }: CollectionsSectionProps) {
	if (collections.length === 0) return null;

	return (
		<section className="w-full py-12">
			<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-2xl font-medium">Collections</h2>
					</div>
					<Link
						href="/collections"
						className="transition-colors text-sm font-medium text-muted-foreground hover:text-foreground flex flex-row items-center gap-2"
					>
						View all
						<ArrowRight className="h-3.5 w-3.5" />
					</Link>
				</div>

				<div className="flex flex-wrap gap-3">
					{collections.map((collection) => (
						<CollectionPill key={collection.id} collection={collection} />
					))}
				</div>
			</div>
		</section>
	);
}
