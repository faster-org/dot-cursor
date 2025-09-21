import Link from "next/link";
import { Package } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collection } from "@/data/types";

interface CollectionCardProps {
	collection: Collection & { ruleCount: number };
}

export function CollectionCard({ collection }: CollectionCardProps) {
	return (
		<Link href={`/collections/${collection.slug}`} className="block">
			<Card className="group transition-all duration-200 hover:shadow-md h-[200px] relative flex flex-col">
				<CardHeader className="flex-1">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-2">
								{collection.icon ? (
									<span className="text-2xl">{collection.icon}</span>
								) : (
									<Package className="h-6 w-6 text-muted-foreground" />
								)}
								<CardTitle className="text-lg">{collection.name}</CardTitle>
							</div>
							<CardDescription className="line-clamp-2">
								{collection.description}
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-0 mt-auto">
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">
							{collection.ruleCount}{" "}
							{collection.ruleCount === 1 ? "rule" : "rules"}
						</span>
						<Button
							variant="outline"
							size="sm"
							className="opacity-0 group-hover:opacity-100 transition-opacity"
						>
							View
						</Button>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
