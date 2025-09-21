"use client";

import { Button } from "@/components/ui/button";
import { Copy, ArrowUp, ArrowDown, Download } from "lucide-react";
import { useVoting } from "@/hooks/queries/use-voting";
import { useCopyRule } from "@/hooks/queries/use-copy-rule";
import { useRuleStats } from "@/hooks/queries/use-rule-stats";
import { useUserVote } from "@/hooks/queries/use-user-vote";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface RuleActionsProps {
	rule: {
		slug: string;
		title: string;
		description: string;
		content: string;
		applicationMode: string;
		globs?: string;
	};
}

export function RuleActions({ rule }: RuleActionsProps) {
	const {
		data: stats,
	} = useRuleStats(rule.slug);
	const {
		data: userVoteData,
	} = useUserVote(rule.slug);
	const votingMutation = useVoting(rule.slug);
	const copyMutation = useCopyRule();

	const userVote = userVoteData?.userVote;

	// Show skeletons until we have actual data with numbers
	const hasValidStats = stats && typeof stats.upvotes === "number";
	const hasValidUserVote = userVoteData && Object.hasOwn(userVoteData, "userVote");
	const isLoadingVoteData = (!hasValidStats || !hasValidUserVote) && !votingMutation.isPending;

	const createMdcContent = () => {
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
			default:
				// Apply Manually - just alwaysApply: false
				frontmatter = `---
alwaysApply: false
---`;
				break;
		}

		return `${frontmatter}
${rule.content}`;
	};

	const handleCopy = async () => {
		try {
			const mdcContent = createMdcContent();
			await navigator.clipboard.writeText(mdcContent);
			toast.success("Rule copied to clipboard!");
			copyMutation.mutate(rule.slug);
		} catch {
			toast.error("Failed to copy rule");
		}
	};

	const handleDownload = () => {
		try {
			const mdcContent = createMdcContent();

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
		<div className="flex items-center justify-between w-full">
			<div className="flex items-center gap-1.5">
				<Button
					variant="outline"
					size="sm"
					disabled={votingMutation.isPending || isLoadingVoteData}
					onClick={() => handleVote("up")}
					className={userVote === "up" ? "border-foreground" : ""}
				>
					<ArrowUp className="!size-3.5" />
					{isLoadingVoteData ? <Skeleton className="h-4 w-3" /> : (stats?.upvotes ?? 0)}
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={votingMutation.isPending || isLoadingVoteData}
					onClick={() => handleVote("down")}
					className={userVote === "down" ? "border-foreground" : ""}
				>
					<ArrowDown className="!size-3.5" />
					{isLoadingVoteData ? <Skeleton className="h-4 w-3" /> : (stats?.downvotes ?? 0)}
				</Button>
			</div>

			<div className="flex items-center gap-1.5">
				<Button variant="ghost" className="size-8" size="sm" onClick={handleCopy}>
					<Copy className="!size-3.5" />
				</Button>
				<Button variant="ghost" className="size-8" size="sm" onClick={handleDownload}>
					<Download className="!size-3.5" />
				</Button>
			</div>
		</div>
	);
}
