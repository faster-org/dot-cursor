"use client";

import { useState, useEffect, useCallback } from "react";
import { SearchHero } from "./search-hero";
import { CategorizedRules } from "./categorized-rules";

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

interface Category {
	id: string;
	name: string;
	slug: string;
	description?: string;
	rules: Rule[];
}

interface HomeClientProps {
	initialData: {
		categories: Category[];
		pagination: {
			page: number;
			limit: number;
			total: number;
			totalPages: number;
			hasMore: boolean;
		};
	};
}

export function HomeClient({ initialData }: HomeClientProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [categories, setCategories] = useState<Category[]>(initialData.categories);
	const [allLoadedCategories, setAllLoadedCategories] = useState<Category[]>(initialData.categories);
	const [pagination, setPagination] = useState(initialData.pagination);
	const [loading, setLoading] = useState(false);
	const [isClientFiltering, setIsClientFiltering] = useState(false);

	const loadMoreCategories = useCallback(async () => {
		if (loading || !pagination.hasMore || searchTerm) return;

		setLoading(true);
		try {
			const response = await fetch(`/api/categories?page=${pagination.page + 1}&limit=5`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();

			// Deduplicate categories by ID to prevent React key conflicts
			const updatedCategories = (() => {
				const existingIds = new Set(categories.map(cat => cat.id));
				const newCategories = data.categories.filter((cat: Category) => !existingIds.has(cat.id));
				return [...categories, ...newCategories];
			})();

			setCategories(updatedCategories);
			setAllLoadedCategories(updatedCategories);
			setPagination(data.pagination);
		} catch (error) {
			console.error('Failed to load more categories:', error);
		} finally {
			setLoading(false);
		}
	}, [loading, pagination.hasMore, pagination.page, searchTerm, categories]);

	// Client-side filtering for instant feedback
	const filterCategoriesLocally = useCallback((term: string, categoriesToFilter: Category[]) => {
		if (!term.trim()) {
			return categoriesToFilter;
		}

		const lowercaseSearch = term.toLowerCase();
		return categoriesToFilter
			.map((category) => ({
				...category,
				rules: category.rules.filter((rule) =>
					rule.title.toLowerCase().includes(lowercaseSearch) ||
					rule.description.toLowerCase().includes(lowercaseSearch) ||
					rule.content.toLowerCase().includes(lowercaseSearch)
				),
			}))
			.filter((category) => category.rules.length > 0);
	}, []);

	// Client-side filtering effect - instant feedback
	useEffect(() => {
		if (searchTerm.trim()) {
			setIsClientFiltering(true);
			const filtered = filterCategoriesLocally(searchTerm, allLoadedCategories);
			setCategories(filtered);
		} else {
			setIsClientFiltering(false);
			// When search is cleared, restore all loaded categories
			setCategories(allLoadedCategories);
		}
	}, [searchTerm, allLoadedCategories, filterCategoriesLocally]);

	// Scroll listener for infinite scroll - predictive loading with throttling
	useEffect(() => {
		let lastScrollTime = 0;
		let hasTriggeredForCurrentPage = false;

		const handleScroll = () => {
			const now = Date.now();
			// Throttle scroll events to every 100ms
			if (now - lastScrollTime < 100) return;
			lastScrollTime = now;

			if (searchTerm || loading || !pagination.hasMore) {
				return;
			}

			const scrollTop = document.documentElement.scrollTop;
			const scrollHeight = document.documentElement.scrollHeight;
			const clientHeight = document.documentElement.clientHeight;

			// Calculate scroll percentage (0 to 1)
			const scrollPercentage = scrollTop / (scrollHeight - clientHeight);

			// Trigger when user has scrolled 60% of the way down
			// Only trigger once per page to prevent multiple requests
			if (scrollPercentage >= 0.6 && !hasTriggeredForCurrentPage) {
				hasTriggeredForCurrentPage = true;
				loadMoreCategories();
			}
		};

		// Reset trigger flag when pagination changes (new page loaded)
		hasTriggeredForCurrentPage = false;

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [searchTerm, loading, pagination.hasMore, pagination.page, loadMoreCategories]);

	const handleSearch = (term: string) => {
		setSearchTerm(term);
	};

	return (
		<div className="w-full">
			<SearchHero onSearch={handleSearch} />
			<CategorizedRules
				categoriesWithRules={categories}
				searchTerm={searchTerm}
				loading={loading && !searchTerm}
				hasMore={pagination.hasMore && !searchTerm}
				onLoadMore={loadMoreCategories}
				loadingMore={loading}
				isClientFiltering={isClientFiltering}
			/>
		</div>
	);
}