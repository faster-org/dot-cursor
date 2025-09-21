import { CollectionCard } from "@/components/collection/collection-card";
import { getCollectionsWithRules } from "@/lib/data-loader";
import { Package } from "lucide-react";

export default async function CollectionsPage() {
	const collections = await getCollectionsWithRules();

	return (
		<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Page Header */}
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-2">
					<h1 className="text-3xl font-medium tracking-tight">Collections</h1>
				</div>
				<p className="text-muted-foreground">
					Curated groups of rules for common use cases and workflows
				</p>
			</div>

			{/* Collections Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{collections.map((collection) => (
					<CollectionCard key={collection.id} collection={collection} />
				))}
			</div>

			{collections.length === 0 && (
				<div className="text-center py-12">
					<Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<p className="text-muted-foreground text-lg">
						No collections available yet
					</p>
				</div>
			)}
		</div>
	);
}
