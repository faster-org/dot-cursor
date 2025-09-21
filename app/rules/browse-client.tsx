"use client";

import { useState, useEffect } from "react";
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
import { Search, Filter } from "lucide-react";
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
	categories: Category[];
	initialSearchParams: { [key: string]: string | undefined };
}

export function BrowseClient({
	initialRules,
	categories,
}: BrowseClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Get current values from URL params
	const currentSearch = searchParams.get("search") || "";
	const currentCategory = searchParams.get("category") || "all";
	const currentSort = searchParams.get("sortBy") || "createdAt";

	const [search, setSearch] = useState(currentSearch);
	const [selectedCategory, setSelectedCategory] = useState(currentCategory);
	const [sortBy, setSortBy] = useState(currentSort);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [filteredRules, setFilteredRules] = useState<Rule[]>([]);
	const [displayedRules, setDisplayedRules] = useState<Rule[]>([]);
	const [displayCount, setDisplayCount] = useState(12); // Start with 12 rules

	// Update URL when filters change (remove page param)
	const updateUrl = (params: Record<string, string>) => {
		const newSearchParams = new URLSearchParams(searchParams.toString());

		// Always remove page param since we don't need it anymore
		newSearchParams.delete('page');

		Object.entries(params).forEach(([key, value]) => {
			if (value && value !== "all" && value.trim()) {
				newSearchParams.set(key, value);
			} else {
				newSearchParams.delete(key);
			}
		});

		router.push(`/rules?${newSearchParams.toString()}`);
	};

	// Sync state with URL changes
	useEffect(() => {
		const urlSearch = searchParams.get("search") || "";
		const urlCategory = searchParams.get("category") || "all";
		const urlSort = searchParams.get("sortBy") || "createdAt";

		setSearch(urlSearch);
		setSelectedCategory(urlCategory);
		setSortBy(urlSort);
	}, [searchParams]);

	// Client-side filtering and sorting - instant updates
	useEffect(() => {
		let filtered = [...initialRules];

		// Filter by category
		if (selectedCategory && selectedCategory !== "all") {
			filtered = filtered.filter(rule =>
				rule.categories.some(cat => cat.slug === selectedCategory)
			);
		}

		// Filter by search term
		if (search.trim()) {
			const lowercaseSearch = search.toLowerCase();
			filtered = filtered.filter(rule =>
				rule.title.toLowerCase().includes(lowercaseSearch) ||
				rule.description.toLowerCase().includes(lowercaseSearch) ||
				rule.content.toLowerCase().includes(lowercaseSearch)
			);
		}

		// Sort rules
		if (sortBy === "popular") {
			filtered.sort((a, b) => b.copyCount - a.copyCount);
		} else if (sortBy === "votes") {
			filtered.sort((a, b) => b.upvotes - a.upvotes);
		} else {
			// Sort by creation date (newest first)
			filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
		}

		setFilteredRules(filtered);
		setDisplayCount(12); // Reset display count when filters change
	}, [initialRules, selectedCategory, search, sortBy]);

	// Update displayed rules based on display count
	useEffect(() => {
		setDisplayedRules(filteredRules.slice(0, displayCount));
	}, [filteredRules, displayCount]);

	const handleSearchChange = (term: string) => {
		setSearch(term);
		updateUrl({ search: term });
	};

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
		updateUrl({ category });
		setIsSidebarOpen(false);
	};

	const handleSortChange = (sort: string) => {
		setSortBy(sort);
		updateUrl({ sortBy: sort });
	};

	const loadMoreRules = () => {
		setDisplayCount(prev => prev + 12);
	};

	// Scroll listener for infinite scroll
	useEffect(() => {
		const handleScroll = () => {
			const scrollContainer = document.querySelector('.rules-scroll-container');
			if (!scrollContainer) return;

			const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
			const scrollPercentage = scrollTop / (scrollHeight - clientHeight);

			// Load more when scrolled 80% down and there are more rules to show
			if (scrollPercentage >= 0.8 && displayedRules.length < filteredRules.length) {
				loadMoreRules();
			}
		};

		const scrollContainer = document.querySelector('.rules-scroll-container');
		if (scrollContainer) {
			scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
			return () => scrollContainer.removeEventListener('scroll', handleScroll);
		}
	}, [displayedRules.length, filteredRules.length]);

	const CategoryList = () => (
		<div className="space-y-2">
			<Button
				onClick={() => handleCategoryChange("all")}
				className={`bg-transparent border-none text-muted-foreground w-full text-left justify-start px-3 py-2 rounded-md text-sm transition-colors ${
					selectedCategory === "all"
						? "!bg-secondary text-foreground"
						: "hover:bg-muted"
				}`}
			>
				All Categories
			</Button>
			{categories.map((category) => (
				<Button
					key={category.id}
					onClick={() => handleCategoryChange(category.slug)}
					className={`bg-transparent border-none text-muted-foreground w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${
						selectedCategory === category.slug
							? "!bg-secondary text-foreground"
							: "hover:bg-muted"
					}`}
				>
					<span>{category.name}</span>
					<span className="text-xs opacity-70">{category._count.rules}</span>
				</Button>
			))}
		</div>
	);

	return (
		<>
			{/* Desktop Categories Sidebar */}
			<div className="hidden lg:block w-64 flex-shrink-0">
				<div className="h-[calc(100vh-8rem)] overflow-y-auto sticky top-8">
					<h3 className="font-medium text-base mb-4">Categories</h3>
					<CategoryList />
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 min-w-0 h-[calc(100vh-8rem)] flex flex-col">
				<div className="mb-6 space-y-4">
					<div className="flex gap-2">
						{/* Mobile Categories Button */}
						<Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
							<SheetTrigger asChild>
								<Button variant="outline" size="sm" className="lg:hidden">
									<Filter className="h-4 w-4 mr-2" />
									Categories
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-72">
								<h3 className="font-medium text-base mb-4">Categories</h3>
								<CategoryList />
							</SheetContent>
						</Sheet>

						{/* Search Input */}
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input
								placeholder="Search rules..."
								value={search}
								onChange={(e) => handleSearchChange(e.target.value)}
								className="pl-10"
							/>
						</div>

						{/* Sort Dropdown */}
						<Select value={sortBy} onValueChange={handleSortChange}>
							<SelectTrigger className="w-40">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="createdAt">Latest</SelectItem>
								<SelectItem value="popular">Popular</SelectItem>
								<SelectItem value="votes">Most Voted</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Rules Grid */}
				<div className="flex-1 overflow-y-auto rules-scroll-container">
					{filteredRules.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-muted-foreground text-lg">
								{search || selectedCategory !== "all"
									? `No rules found ${search ? `for "${search}"` : ''} ${selectedCategory !== "all" ? `in ${categories.find(c => c.slug === selectedCategory)?.name}` : ''}`
									: "No rules available yet"
								}
							</p>
						</div>
					) : (
						<>
							<div className="grid gap-6 md:grid-cols-2">
								{displayedRules.map((rule) => (
									<RuleCard key={rule.id} rule={rule} />
								))}
							</div>

							{/* Load more indicator */}
							{displayedRules.length < filteredRules.length && (
								<div className="flex justify-center py-8">
									<div className="text-sm text-muted-foreground">
										Showing {displayedRules.length} of {filteredRules.length} rules
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
}