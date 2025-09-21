"use client";

import { Button } from "@/components/ui/button";
import { Copy, ArrowUp, ArrowDown, Download } from "lucide-react";
import { useVoting } from "@/hooks/use-voting";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRuleStatsContext } from "./rule-stats-provider";

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
	const { userVote, vote } = useVoting(rule.slug);
	const { stats, loading, updateStats } = useRuleStatsContext();

	const createMdcContent = () => {
		let frontmatter = '';

		switch (rule.applicationMode) {
			case 'always':
				// Always Apply - no description field
				frontmatter = `---
alwaysApply: true
---`;
				break;
			case 'intelligent':
				// Apply Intelligently - description decides when to apply
				frontmatter = `---
description: ${rule.description}
alwaysApply: false
---`;
				break;
			case 'files':
				// Apply to Specific Files - globs field for file patterns
				frontmatter = `---
globs: ${rule.globs || '*.ts,*.tsx'}
alwaysApply: false
---`;
				break;
			case 'manual':
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
			// Still increment copy count in background for analytics
			fetch(`/api/rules/${rule.slug}/copy`, { method: "POST" });
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

	const handleVote = async (voteType: "up" | "down") => {
		const result = await vote(voteType);

		if (result.error) {
			toast.error(result.error);
			return;
		}

		if (result.success) {
			updateStats({
				upvotes: result.upvotes,
				downvotes: result.downvotes
			});
		}
	};

	return (
		<div className="flex items-center justify-between w-full">
			<div className="flex items-center gap-1.5">
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
					disabled={loading || userVote === "up"}
					onClick={() => handleVote("up")}
				>
					<ArrowUp className="!size-3.5" />
					{loading ? <Skeleton className="h-4 w-3" /> : stats.upvotes}
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={loading || userVote === "down"}
					onClick={() => handleVote("down")}
				>
					<ArrowDown className="!size-3.5" />
					{loading ? <Skeleton className="h-4 w-3" /> : stats.downvotes}
				</Button>
			</div>
		</div>
	);
}