"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ArrowUp, ArrowDown, Download } from "lucide-react";
import { useVoting } from "@/hooks/queries/use-voting";
import { useRuleStats } from "@/hooks/queries/use-rule-stats";
import { useCopyRule } from "@/hooks/queries/use-copy-rule";
import { useUserVote } from "@/hooks/queries/use-user-vote";
import Link from "next/link";
import { toast } from "sonner";
import { CategoryBadges } from "./category-badges";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApplicationMode } from "@/data/types";

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
		applicationMode: ApplicationMode;
		globs?: string;
		categories?: Array<{
			name: string;
			slug: string;
		}>;
	};
}

type RuleForCard = RuleCardProps["rule"];

function buildMdcContent(rule: RuleForCard): string {
	let frontmatter = "";

	switch (rule.applicationMode) {
		case "always":
			frontmatter = `---
alwaysApply: true
---`;
			break;
		case "intelligent":
			frontmatter = `---
description: ${rule.description}
alwaysApply: false
---`;
			break;
		case "files":
			frontmatter = `---
globs: ${rule.globs || "*.ts,*.tsx"}
alwaysApply: false
---`;
			break;
		case "manual":
		default:
			frontmatter = `---
alwaysApply: false
---`;
			break;
	}

	return `${frontmatter}
${rule.content}`;
}

export function RuleCard({ rule }: RuleCardProps) {
	const { data: stats, isLoading: isLoadingStats, isFetching: isFetchingStats } = useRuleStats(rule.slug);
	const { data: userVoteData, isLoading: isLoadingUserVote, isFetching: isFetchingUserVote } = useUserVote(rule.slug);
	const votingMutation = useVoting(rule.slug);
	const copyMutation = useCopyRule();

	// Use stats from React Query, fallback to props
	const currentUpvotes = stats?.upvotes ?? rule.upvotes;
	const currentDownvotes = stats?.downvotes ?? rule.downvotes;
	const userVote = userVoteData?.userVote;

	// Show skeletons until we have actual data with numbers
	const hasValidStats = stats && typeof stats.upvotes === 'number';
	const hasValidUserVote = userVoteData && userVoteData.hasOwnProperty('userVote');
	const isLoadingVoteData = (!hasValidStats || !hasValidUserVote) && !votingMutation.isPending;

	const handleCopy = async () => {
		try {
			const mdcContent = buildMdcContent(rule);
			await navigator.clipboard.writeText(mdcContent);
			toast.success("Rule copied to clipboard!");
			copyMutation.mutate(rule.slug);
		} catch {
			toast.error("Failed to copy rule");
		}
	};

	const handleDownload = () => {
		try {
			const mdcContent = buildMdcContent(rule);

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

	const handleVote = (voteType: "up" | "down") => {
		votingMutation.mutate(voteType === "up" ? "upvote" : "downvote");
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
						disabled={votingMutation.isPending || isLoadingVoteData}
						onClick={() => handleVote("up")}
						className={userVote === 'up' ? 'border-foreground' : ''}
					>
						<ArrowUp className="!size-3.5" />
						{isLoadingVoteData ? <Skeleton className="h-4 w-3" /> : currentUpvotes}
					</Button>
					<Button
						variant="outline"
						size="sm"
						disabled={votingMutation.isPending || isLoadingVoteData}
						onClick={() => handleVote("down")}
						className={userVote === 'down' ? 'border-foreground' : ''}
					>
						<ArrowDown className="!size-3.5" />
						{isLoadingVoteData ? (
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
