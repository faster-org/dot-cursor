"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RuleCard } from "@/components/rule/rule-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
	categories: Array<{
		name: string;
		slug: string;
	}>;
}

interface Category {
	id: string;
	name: string;
	slug: string;
	_count: {
		rules: number;
	};
}

interface BrowseClientProps {
	initialRules: Rule[];
	initialPagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
	categories: Category[];
	initialSearchParams: { [key: string]: string | undefined };
}

export function BrowseClient({
	initialRules,
	initialPagination,
	categories,
	initialSearchParams,
}: BrowseClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [rules, setRules] = useState(initialRules);
	const [pagination, setPagination] = useState(initialPagination);
	const [loading, setLoading] = useState(false);

	// Get current values from URL params, fallback to initial params
	const currentSearch =
		searchParams.get("search") || initialSearchParams.search || "";
	const currentCategory =
		searchParams.get("category") || initialSearchParams.category || "all";
	const currentSort =
		searchParams.get("sortBy") || initialSearchParams.sortBy || "createdAt";

	const [search, setSearch] = useState(currentSearch);
	const [selectedCategory, setSelectedCategory] = useState(currentCategory);
	const [sortBy, setSortBy] = useState(currentSort);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [allLoadedRules, setAllLoadedRules] = useState(initialRules);
	const [searchLoading, setSearchLoading] = useState(false);
	const [isClientFiltering, setIsClientFiltering] = useState(false);
	const [lastServerSearchTerm, setLastServerSearchTerm] = useState("");
	const [loadingMore, setLoadingMore] = useState(false);
	const [allRules, setAllRules] = useState(initialRules); // Store all loaded rules

	// Sync state with URL parameters when they change
	useEffect(() => {
		const urlSearch = searchParams.get("search") || "";
		const urlCategory = searchParams.get("category") || "all";
		const urlSort = searchParams.get("sortBy") || "createdAt";

		setSearch(urlSearch);
		setSelectedCategory(urlCategory);
		setSortBy(urlSort);
	}, [searchParams]);

	// Client-side filtering for instant feedback
	const filterRulesLocally = useCallback(
		(term: string, rulesToFilter: Rule[]) => {
			if (!term.trim()) {
				return rulesToFilter;
			}

			const lowercaseSearch = term.toLowerCase();
			return rulesToFilter.filter(
				(rule) =>
					rule.title.toLowerCase().includes(lowercaseSearch) ||
					rule.description.toLowerCase().includes(lowercaseSearch) ||
					rule.content.toLowerCase().includes(lowercaseSearch),
			);
		},
		[],
	);

	const updateUrl = (params: Record<string, string>) => {
		const newSearchParams = new URLSearchParams(searchParams.toString());

		Object.entries(params).forEach(([key, value]) => {
			if (value && value !== "all") {
				newSearchParams.set(key, value);
			} else {
				newSearchParams.delete(key);
			}
		});

		router.push(`/browse?${newSearchParams.toString()}`);
	};

	// Server-side search for comprehensive results
	const searchRulesOnServer = useCallback(
		async (
			searchTerm: string,
			category: string = selectedCategory,
			sort: string = sortBy,
		) => {
			setSearchLoading(true);
			try {
				const queryParams = new URLSearchParams({
					page: "1",
					sortBy: sort,
					...(category && category !== "all" && { category }),
					...(searchTerm && { search: searchTerm }),
				});

				const res = await fetch(`/api/rules?${queryParams}`);
				const data = await res.json();
				setRules(data.rules);
				setAllLoadedRules(data.rules);
				setPagination(data.pagination);
				setIsClientFiltering(false);
			} catch (error) {
				console.error("Failed to search rules:", error);
			} finally {
				setSearchLoading(false);
			}
		},
		[selectedCategory, sortBy],
	);

	const fetchRules = async (params?: Record<string, string>) => {
		setLoading(true);
		try {
			const queryParams = new URLSearchParams({
				page: "1",
				sortBy,
				...(selectedCategory &&
					selectedCategory !== "all" && { category: selectedCategory }),
				...(search && { search }),
				...params,
			});

			const res = await fetch(`/api/rules?${queryParams}`);
			const data = await res.json();
			setRules(data.rules);
			setAllLoadedRules(data.rules);
			setAllRules(data.rules);
			setPagination(data.pagination);
		} catch (error) {
			console.error("Failed to fetch rules:", error);
		} finally {
			setLoading(false);
		}
	};

	const loadMoreRules = useCallback(async () => {
		if (loadingMore || !pagination.totalPages || pagination.page >= pagination.totalPages || search.trim() || isClientFiltering) {
			return;
		}

		setLoadingMore(true);
		try {
			const queryParams = new URLSearchParams({
				page: (pagination.page + 1).toString(),
				sortBy,
				...(selectedCategory &&
					selectedCategory !== "all" && { category: selectedCategory }),
			});

			const res = await fetch(`/api/rules?${queryParams}`);
			const data = await res.json();

			// Append new rules to existing ones
			const newAllRules = [...allRules, ...data.rules];
			setAllRules(newAllRules);
			setAllLoadedRules(newAllRules);
			setRules(newAllRules);
			setPagination(data.pagination);
		} catch (error) {
			console.error("Failed to load more rules:", error);
		} finally {
			setLoadingMore(false);
		}
	}, [loadingMore, pagination, search, isClientFiltering, sortBy, selectedCategory, allRules]);

	const handleSearchChange = (term: string) => {
		setSearch(term);
		updateUrl({ search: term, page: "1" });
	};

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
		setIsSidebarOpen(false); // Close sidebar on mobile after selection
		updateUrl({ category, page: "1" });
		fetchRules({ category: category !== "all" ? category : "", page: "1" });
	};

	const handleSortChange = (sort: string) => {
		setSortBy(sort);
		updateUrl({ sortBy: sort, page: "1" });
		fetchRules({ sortBy: sort, page: "1" });
	};


	// Instant client-side filtering effect - no debouncing for real-time filtering
	useEffect(() => {
		if (search.trim()) {
			setIsClientFiltering(true);
			const filtered = filterRulesLocally(search, allLoadedRules);
			setRules(filtered);
		} else {
			setIsClientFiltering(false);
			// When search is cleared, just restore all loaded rules immediately
			setRules(allLoadedRules);
		}
	}, [search, allLoadedRules, filterRulesLocally]);

	// Debounced server-side search effect for comprehensive results
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			const trimmedSearch = search.trim();
			// Only perform server search if the search term has actually changed
			if (trimmedSearch && trimmedSearch !== lastServerSearchTerm) {
				setLastServerSearchTerm(trimmedSearch);
				searchRulesOnServer(trimmedSearch);
			} else if (!trimmedSearch && lastServerSearchTerm) {
				// When search is cleared, just reset the last search term
				setLastServerSearchTerm("");
				// Don't fetch here - the client-side effect already restored allLoadedRules
			}
		}, 500); // 500ms delay for server search

		return () => clearTimeout(timeoutId);
	}, [search, searchRulesOnServer, lastServerSearchTerm]);

	// Scroll listener for infinite scroll - predictive loading with throttling
	useEffect(() => {
		let lastScrollTime = 0;
		let hasTriggeredForCurrentPage = false;

		const handleScroll = (e: Event) => {
			const target = e.target as HTMLElement;
			if (!target || target.className.indexOf('overflow-y-auto') === -1) return;

			const now = Date.now();
			// Throttle scroll events to every 100ms
			if (now - lastScrollTime < 100) return;
			lastScrollTime = now;

			if (search.trim() || loadingMore || !pagination.totalPages || pagination.page >= pagination.totalPages) {
				return;
			}

			const scrollTop = target.scrollTop;
			const scrollHeight = target.scrollHeight;
			const clientHeight = target.clientHeight;

			// Calculate scroll percentage (0 to 1)
			const scrollPercentage = scrollTop / (scrollHeight - clientHeight);

			// Trigger when user has scrolled 60% of the way down
			// Only trigger once per page to prevent multiple requests
			if (scrollPercentage >= 0.6 && !hasTriggeredForCurrentPage) {
				hasTriggeredForCurrentPage = true;
				loadMoreRules();
			}
		};

		// Reset trigger flag when pagination changes (new page loaded)
		hasTriggeredForCurrentPage = false;

		// Add event listener to the scrollable container
		const scrollContainer = document.querySelector('.overflow-y-auto');
		if (scrollContainer) {
			scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
			return () => scrollContainer.removeEventListener('scroll', handleScroll);
		}
	}, [search, loadingMore, pagination.totalPages, pagination.page, loadMoreRules]);

	const CategoryList = () => (
		<div className="space-y-2">
			<button
				onClick={() => handleCategoryChange("all")}
				className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
					selectedCategory === "all"
						? "bg-secondary text-foreground"
						: "hover:bg-muted"
				}`}
			>
				All Categories
			</button>
			{categories.map((category) => (
				<button
					key={category.id}
					onClick={() => handleCategoryChange(category.slug)}
					className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${
						selectedCategory === category.slug
							? "bg-secondary text-foreground"
							: "hover:bg-muted"
					}`}
				>
					<span>{category.name}</span>
					<span className="text-xs opacity-70">{category._count.rules}</span>
				</button>
			))}
		</div>
	);

	return (
		<>
			{/* Desktop Categories Sidebar */}
			<div className="hidden lg:block w-64 flex-shrink-0">
				<div className="h-[calc(100vh-8rem)] overflow-y-auto sticky top-8">
					<h3 className="font-semibold text-lg mb-4">Categories</h3>
					<CategoryList />
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 min-w-0 h-[calc(100vh-8rem)] flex flex-col">
				<div className="mb-6 space-y-4">
					<div className="flex gap-2">
						{/* Mobile Filter Button */}
						<Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
							<SheetTrigger asChild>
								<Button variant="outline" size="icon" className="lg:hidden">
									<Filter className="h-4 w-4" />
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-72">
								<div className="py-4">
									<h3 className="font-semibold text-lg mb-4">Categories</h3>
									<CategoryList />
								</div>
							</SheetContent>
						</Sheet>

						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search rules..."
								value={search}
								onChange={(e) => handleSearchChange(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>

					<div className="flex justify-between items-center">
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground">
								{pagination.total} rule{pagination.total !== 1 ? "s" : ""} found
							</span>
							{/* Show server search loading indicator */}
							{searchLoading && isClientFiltering && (
								<Loader2 className="h-4 w-4 animate-spin" />
							)}
							{/* Show selected category on mobile */}
							{selectedCategory !== "all" && (
								<span className="lg:hidden text-xs bg-muted px-2 py-1 rounded">
									{categories.find((c) => c.slug === selectedCategory)?.name}
								</span>
							)}
						</div>
						<Select value={sortBy} onValueChange={handleSortChange}>
							<SelectTrigger className="w-auto min-w-[150px]">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="createdAt">Latest</SelectItem>
								<SelectItem value="popular">Most Copied</SelectItem>
								<SelectItem value="votes">Top Voted</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto">
					{loading ? (
						<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 p-1">
							{[...Array(6)].map((_, i) => (
								<Skeleton key={i} className="h-[200px]" />
							))}
						</div>
					) : rules.length > 0 ? (
						<>
							<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 p-1">
								{rules.map((rule) => (
									<RuleCard key={rule.id} rule={rule} />
								))}
							</div>

							{/* Loading more indicator for infinite scroll */}
							{loadingMore && (
								<div className="flex justify-center py-8">
									<div className="text-sm font-medium flex items-center gap-2 text-foreground">
										<Loader2 className="h-3.5 w-3.5 animate-spin" />
										Loading more rules...
									</div>
								</div>
							)}
						</>
					) : (
						<div className="text-center py-12">
							<p className="text-muted-foreground">No rules found</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
