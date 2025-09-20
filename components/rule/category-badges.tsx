"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";

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
	const [visibleCount, setVisibleCount] = useState(maxVisible);
	const containerRef = useRef<HTMLDivElement>(null);
	const [containerWidth, setContainerWidth] = useState(0);

	const visibleCategories = categories.slice(0, visibleCount);
	const overflowCategories = categories.slice(visibleCount);
	const hasOverflow = overflowCategories.length > 0;

	// Measure container width and calculate how many badges fit
	useEffect(() => {
		if (!containerRef.current) return;

		const updateWidth = () => {
			if (containerRef.current) {
				setContainerWidth(containerRef.current.offsetWidth);
			}
		};

		updateWidth();

		const resizeObserver = new ResizeObserver(updateWidth);
		resizeObserver.observe(containerRef.current);

		return () => resizeObserver.disconnect();
	}, []);

	// Calculate how many badges can fit based on estimated widths
	useEffect(() => {
		if (containerWidth === 0 || categories.length === 0) return;

		// Rough estimation: average badge width + gap
		const avgBadgeWidth = 80; // Estimated average badge width including padding
		const gap = 8; // Gap between badges
		const overflowBadgeWidth = 40; // Width of "+X" badge

		let maxFit = Math.floor(
			(containerWidth - overflowBadgeWidth - gap) / (avgBadgeWidth + gap),
		);

		// Ensure we show at least 1 badge and don't exceed available categories
		maxFit = Math.max(1, Math.min(maxFit, categories.length));

		// If all categories fit, don't reserve space for overflow badge
		if (maxFit >= categories.length) {
			maxFit = categories.length;
		}

		setVisibleCount(maxFit);
	}, [containerWidth, categories.length]);

	if (categories.length === 0) return null;

	return (
		<div ref={containerRef} className="flex items-center gap-2">
			{visibleCategories.map((category) => (
				<Link key={category.slug} href={`/browse?category=${category.slug}`}>
					<Badge variant="outline" className="whitespace-nowrap">
						{category.name}
					</Badge>
				</Link>
			))}

			{hasOverflow && (
				<HoverCard>
					<HoverCardTrigger asChild>
						<Badge
							variant="outline"
							className="cursor-pointer hover:bg-secondary/80 transition-colors whitespace-nowrap flex-shrink-0"
						>
							+{overflowCategories.length}
						</Badge>
					</HoverCardTrigger>
					<HoverCardContent className="w-auto p-3" side="top">
						<div className="flex flex-wrap gap-2">
							{overflowCategories.map((category) => (
								<Link
									key={category.slug}
									href={`/browse?category=${category.slug}`}
								>
									<Badge variant="outline" className="text-xs">
										{category.name}
									</Badge>
								</Link>
							))}
						</div>
					</HoverCardContent>
				</HoverCard>
			)}
		</div>
	);
}
