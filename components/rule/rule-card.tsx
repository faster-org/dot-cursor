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
import { Copy, ArrowUp, ArrowDown } from "lucide-react";
import { useVoting } from "@/hooks/use-voting";
import Link from "next/link";
import { toast } from "sonner";
import { CategoryBadges } from "./category-badges";

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
	const { userVote, vote } = useVoting(rule.id);
	const [currentUpvotes, setCurrentUpvotes] = useState(rule.upvotes);
	const [currentDownvotes, setCurrentDownvotes] = useState(rule.downvotes);
	const [optimisticUserVote, setOptimisticUserVote] = useState<"up" | "down" | null>(null);
	const [isVoting, setIsVoting] = useState(false);

	// Sync optimistic state with actual userVote
	useEffect(() => {
		setOptimisticUserVote(userVote);
	}, [userVote]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(rule.content);
			toast.success("Rule copied to clipboard!");
			// Increment copy count via API
			fetch(`/api/rules/${rule.id}/copy`, { method: "POST" });
		} catch {
			toast.error("Failed to copy rule");
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
		<Card className="transition-shadow gap-2.5">
			<CardHeader className="pb-0 mb-0 h-auto">
				<div className="flex items-start justify-between">
					<div className="flex flex-col gap-2 flex-1">
						<div className="flex flex-row justify-between items-start gap-2">
							<Link href={`/rules/${rule.slug}`}>
								<CardTitle className="-mt-0.5 hover:underline leading-6 cursor-pointer line-clamp-1">
									{rule.title}
								</CardTitle>
							</Link>
							<Button
								variant="outline"
								size="icon"
								onClick={handleCopy}
								className="ml-2 mt-0.5 !p-0 h-auto w-auto border-none hover:text-foreground/60"
							>
								<Copy className="!size-4" />
							</Button>
						</div>
						<CardDescription className="line-clamp-4">
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

					{/* Voting section */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								disabled={isVoting || optimisticUserVote === "up"}
								onClick={() => handleVote("up")}
								className="text-xs text-muted-foreground"
							>
								<ArrowUp className="!size-3.5" />
								{currentUpvotes}
							</Button>
							<Button
								variant="outline"
								size="sm"
								disabled={isVoting || optimisticUserVote === "down"}
								onClick={() => handleVote("down")}
								className="text-xs text-muted-foreground"
							>
								<ArrowDown className="!size-3.5" />
								{currentDownvotes}
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
