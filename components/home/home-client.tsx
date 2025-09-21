"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SearchHero } from "./search-hero";
import { CategorizedRules } from "./categorized-rules";
import { CollectionsSection } from "./collections-section";
import { Collection } from "@/data/types";

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
	categories: {
		name: string;
		slug: string;
	}[];
}

interface Category {
	id: string;
	name: string;
	slug: string;
	description?: string;
	rules: Rule[];
	_count: {
		rules: number;
	};
}

interface HomeClientProps {
	allCategories: Category[];
	collections: (Collection & { ruleCount: number })[];
}

export function HomeClient({ allCategories, collections }: HomeClientProps) {
	const [searchTerm, setSearchTerm] = useState("");
	// Initialize states with data immediately to avoid flash
	const [displayedCategories, setDisplayedCategories] = useState<Category[]>(() =>
		allCategories.slice(0, 5),
	);
	const [filteredCategories, setFilteredCategories] = useState<Category[]>(allCategories);
	const [filteredCollections, setFilteredCollections] = useState(collections);
	const [displayCount, setDisplayCount] = useState(5);
	const [isClientFiltering, setIsClientFiltering] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	// Client-side filtering for instant feedback
	const filterCategoriesLocally = useCallback((term: string, categoriesToFilter: Category[]) => {
		if (!term.trim()) {
			return categoriesToFilter;
		}

		const lowercaseSearch = term.toLowerCase();
		return categoriesToFilter
			.map((category) => ({
				...category,
				rules: category.rules.filter(
					(rule) =>
						rule.title.toLowerCase().includes(lowercaseSearch) ||
						rule.description.toLowerCase().includes(lowercaseSearch) ||
						rule.content.toLowerCase().includes(lowercaseSearch),
				),
			}))
			.filter((category) => category.rules.length > 0);
	}, []);

	// Client-side filtering for collections
	const filterCollectionsLocally = useCallback(
		(term: string, collectionsToFilter: (Collection & { ruleCount: number })[]) => {
			if (!term.trim()) {
				return collectionsToFilter;
			}

			const lowercaseSearch = term.toLowerCase();
			return collectionsToFilter.filter(
				(collection) =>
					collection.name.toLowerCase().includes(lowercaseSearch) ||
					collection.description.toLowerCase().includes(lowercaseSearch),
			);
		},
		[],
	);

	// Client-side filtering effect - instant feedback
	useEffect(() => {
		if (searchTerm.trim()) {
			setIsClientFiltering(true);
			const filtered = filterCategoriesLocally(searchTerm, allCategories);
			const filteredColls = filterCollectionsLocally(searchTerm, collections);
			setFilteredCategories(filtered);
			setFilteredCollections(filteredColls);
			setDisplayedCategories(filtered);
		} else {
			setIsClientFiltering(false);
			setFilteredCategories(allCategories);
			setFilteredCollections(collections);
			// Show current display count when clearing search
			const displayed = allCategories.slice(0, displayCount);
			setDisplayedCategories(displayed);
		}
	}, [
		searchTerm,
		allCategories,
		collections,
		filterCategoriesLocally,
		filterCollectionsLocally,
		displayCount,
	]);

	// Calculate if there are more categories to load
	const hasMore = !searchTerm && displayedCategories.length < filteredCategories.length;

	// Load more categories (client-side)
	const loadMoreCategories = useCallback(() => {
		if (searchTerm || isLoadingMore) return; // Don't load more during search or if already loading

		setIsLoadingMore(true);

		// Simulate a slight delay for better UX
		setTimeout(() => {
			const newDisplayCount = displayCount + 5;
			const newDisplayed = filteredCategories.slice(0, newDisplayCount);
			setDisplayedCategories(newDisplayed);
			setDisplayCount(newDisplayCount);
			setIsLoadingMore(false);
		}, 100); // Reduced delay for faster loading
	}, [displayCount, filteredCategories, searchTerm, isLoadingMore]);

	// Intersection observer for infinite scroll
	const observerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
					loadMoreCategories();
				}
			},
			{
				threshold: 0,
				rootMargin: "400px", // Trigger 400px before the element is visible
			},
		);

		const currentObserverRef = observerRef.current;
		if (currentObserverRef) {
			observer.observe(currentObserverRef);
		}

		return () => {
			if (currentObserverRef) {
				observer.unobserve(currentObserverRef);
			}
		};
	}, [hasMore, isLoadingMore, loadMoreCategories]);

	return (
		<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<SearchHero onSearch={setSearchTerm} />
			<CollectionsSection collections={filteredCollections} />
			<CategorizedRules
				categoriesWithRules={displayedCategories}
				loading={false}
				isClientFiltering={isClientFiltering}
			/>
			{/* Intersection observer target for infinite scroll */}
			{hasMore && <div ref={observerRef} className="h-10" />}
		</div>
	);
}
