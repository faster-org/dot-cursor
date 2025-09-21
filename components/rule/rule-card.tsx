"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ArrowUp, ArrowDown, Download } from "lucide-react";
import { useVoting } from "@/hooks/use-voting";
import Link from "next/link";
import { toast } from "sonner";
import { CategoryBadges } from "./category-badges";
import { Skeleton } from "@/components/ui/skeleton";

interface RuleCardProps {
	rule: {
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
		categories?: Array<{
			name: string;
			slug: string;
		}>;
	};
}

export function RuleCard({ rule }: RuleCardProps) {
	const { userVote, vote } = useVoting(rule.slug);
	const [currentUpvotes, setCurrentUpvotes] = useState(rule.upvotes);
	const [currentDownvotes, setCurrentDownvotes] = useState(rule.downvotes);
	const [optimisticUserVote, setOptimisticUserVote] = useState<
		"up" | "down" | null
	>(null);
	const [isVoting, setIsVoting] = useState(false);
	const [isLoadingStats, setIsLoadingStats] = useState(true);

	// Sync optimistic state with actual userVote
	useEffect(() => {
		setOptimisticUserVote(userVote);
	}, [userVote]);

	// Load actual stats from server
	useEffect(() => {
		const loadStats = async () => {
			try {
				const response = await fetch(`/api/rules/${rule.slug}/stats`);
				if (response.ok) {
					const data = await response.json();
					setCurrentUpvotes(data.upvotes);
					setCurrentDownvotes(data.downvotes);
				}
			} catch (error) {
				console.warn("Failed to load vote stats:", error);
			} finally {
				setIsLoadingStats(false);
			}
		};

		loadStats();
	}, [rule.slug]);

	const handleCopy = async () => {
		try {
			// Create the same formatted content as download
			let frontmatter = "";

			switch (rule.applicationMode) {
				case "always":
					// Always Apply - no description field
					frontmatter = `---
alwaysApply: true
---`;
					break;
				case "intelligent":
					// Apply Intelligently - description decides when to apply
					frontmatter = `---
description: ${rule.description}
alwaysApply: false
---`;
					break;
				case "files":
					// Apply to Specific Files - globs field for file patterns
					frontmatter = `---
globs: ${rule.globs || "*.ts,*.tsx"}
alwaysApply: false
---`;
					break;
				case "manual":
				default:
					// Apply Manually - just alwaysApply: false
					frontmatter = `---
alwaysApply: false
---`;
					break;
			}

			const mdcContent = `${frontmatter}
${rule.content}`;

			await navigator.clipboard.writeText(mdcContent);
			toast.success("Rule copied to clipboard!");
			// Increment copy count via API
			fetch(`/api/rules/${rule.slug}/copy`, { method: "POST" });
		} catch {
			toast.error("Failed to copy rule");
		}
	};

	const handleDownload = () => {
		try {
			// Create the .mdc file content with frontmatter based on application mode
			let frontmatter = "";

			switch (rule.applicationMode) {
				case "always":
					// Always Apply - no description field
					frontmatter = `---
alwaysApply: true
---`;
					break;
				case "intelligent":
					// Apply Intelligently - description decides when to apply
					frontmatter = `---
description: ${rule.description}
alwaysApply: false
---`;
					break;
				case "files":
					// Apply to Specific Files - globs field for file patterns
					frontmatter = `---
globs: ${rule.globs || "*.ts,*.tsx"}
alwaysApply: false
---`;
					break;
				case "manual":
				default:
					// Apply Manually - just alwaysApply: false
					frontmatter = `---
alwaysApply: false
---`;
					break;
			}

			const mdcContent = `${frontmatter}
${rule.content}`;

			// Create blob and download
			const blob = new Blob([mdcContent], { type: "text/markdown" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${rule.slug}.mdc`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch {
			toast.error("Failed downloading rule");
		}
	};

	const handleVote = async (voteType: "up" | "down") => {
		// Prevent rapid clicking
		if (isVoting) return;

		setIsVoting(true);

		// Optimistic update - instant feedback
		const previousUpvotes = currentUpvotes;
		const previousDownvotes = currentDownvotes;
		const previousOptimisticVote = optimisticUserVote;

		// Calculate optimistic values
		let newUpvotes = currentUpvotes;
		let newDownvotes = currentDownvotes;
		let newOptimisticVote: "up" | "down" | null = optimisticUserVote;

		if (voteType === "up") {
			if (optimisticUserVote === "up") {
				// Remove upvote
				newUpvotes = Math.max(0, currentUpvotes - 1);
				newOptimisticVote = null;
			} else if (optimisticUserVote === "down") {
				// Change from downvote to upvote
				newUpvotes = currentUpvotes + 1;
				newDownvotes = Math.max(0, currentDownvotes - 1);
				newOptimisticVote = "up";
			} else {
				// Add upvote
				newUpvotes = currentUpvotes + 1;
				newOptimisticVote = "up";
			}
		} else {
			if (optimisticUserVote === "down") {
				// Remove downvote
				newDownvotes = Math.max(0, currentDownvotes - 1);
				newOptimisticVote = null;
			} else if (optimisticUserVote === "up") {
				// Change from upvote to downvote
				newDownvotes = currentDownvotes + 1;
				newUpvotes = Math.max(0, currentUpvotes - 1);
				newOptimisticVote = "down";
			} else {
				// Add downvote
				newDownvotes = currentDownvotes + 1;
				newOptimisticVote = "down";
			}
		}

		// Apply optimistic update immediately
		setCurrentUpvotes(newUpvotes);
		setCurrentDownvotes(newDownvotes);
		setOptimisticUserVote(newOptimisticVote);

		try {
			// Make server request
			const result = await vote(voteType);

			if (result.error) {
				// Revert on error
				setCurrentUpvotes(previousUpvotes);
				setCurrentDownvotes(previousDownvotes);
				setOptimisticUserVote(previousOptimisticVote);
				toast.error(result.error);
			} else if (result.success) {
				// Verify server response
				setCurrentUpvotes(result.upvotes);
				setCurrentDownvotes(result.downvotes);
			}
		} finally {
			setIsVoting(false);
		}
	};

	return (
		<Card className="group transition-all duration-200 hover:shadow-md relative overflow-hidden gap-2.5">
			<CardHeader className="pb-0 mb-0 h-auto">
				<div className="flex items-start justify-between">
					<div className="flex flex-col gap-2 flex-1">
						<CardTitle className="-mt-0.5 leading-6 line-clamp-1">
							{rule.title}
						</CardTitle>
						<CardDescription className="line-clamp-4 font-mono text-xs leading-4.5">
							{rule.content}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="flex flex-col gap-5">
					<div className="-mt-0.5 flex items-center justify-between">
						<CategoryBadges categories={rule.categories || []} />
					</div>
				</div>
			</CardContent>

			{/* Gradient overlay with controls - appears on hover */}
			<div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-end justify-between p-5">
				<div className="flex items-center gap-1.5">
					<Link href={`/rules/${rule.slug}`}>
						<Button variant="outline" size="sm">
							View
						</Button>
					</Link>
					<Button
						variant="ghost"
						className="size-8"
						size="sm"
						onClick={handleCopy}
					>
						<Copy className="!size-3.5" />
					</Button>
					<Button
						variant="ghost"
						className="size-8"
						size="sm"
						onClick={handleDownload}
					>
						<Download className="!size-3.5" />
					</Button>
				</div>
				<div className="flex items-center gap-1.5">
					<Button
						variant="outline"
						size="sm"
						disabled={isVoting || isLoadingStats || optimisticUserVote === "up"}
						onClick={() => handleVote("up")}
					>
						<ArrowUp className="!size-3.5" />
						{isLoadingStats ? <Skeleton className="h-4 w-3" /> : currentUpvotes}
					</Button>
					<Button
						variant="outline"
						size="sm"
						disabled={
							isVoting || isLoadingStats || optimisticUserVote === "down"
						}
						onClick={() => handleVote("down")}
					>
						<ArrowDown className="!size-3.5" />
						{isLoadingStats ? (
							<Skeleton className="h-4 w-3" />
						) : (
							currentDownvotes
						)}
					</Button>
				</div>
			</div>
		</Card>
	);
}
