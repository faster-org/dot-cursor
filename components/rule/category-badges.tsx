"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface Category {
	name: string;
	slug: string;
}

interface CategoryBadgesProps {
	categories: Category[];
	maxVisible?: number;
}

export function CategoryBadges({
	categories,
	maxVisible = 3,
}: CategoryBadgesProps) {
	// Use a fixed visible count for instant rendering
	// This avoids the delay from ResizeObserver calculations
	const visibleCount = Math.min(maxVisible, categories.length);

	const visibleCategories = categories.slice(0, visibleCount);
	const overflowCategories = categories.slice(visibleCount);
	const hasOverflow = overflowCategories.length > 0;

	if (categories.length === 0) return null;

	return (
		<div className="flex items-center gap-2">
			{visibleCategories.map((category) => (
				<Link key={category.slug} href={`/rules?category=${category.slug}`}>
					<Badge variant="outline" className="whitespace-nowrap">
						{category.name}
					</Badge>
				</Link>
			))}

			{hasOverflow && (
				<Popover>
					<PopoverTrigger asChild>
						<Badge
							variant="outline"
							className="cursor-pointer hover:bg-secondary/80 transition-colors whitespace-nowrap flex-shrink-0"
						>
							+{overflowCategories.length}
						</Badge>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" side="top">
						<div className="inline-flex flex-wrap gap-1.5 p-3 pt-2.5 max-w-xs">
							{overflowCategories.map((category) => (
								<Link
									key={category.slug}
									href={`/rules?category=${category.slug}`}
								>
									<Badge variant="outline" className="text-xs">
										{category.name}
									</Badge>
								</Link>
							))}
						</div>
					</PopoverContent>
				</Popover>
			)}
		</div>
	);
}
