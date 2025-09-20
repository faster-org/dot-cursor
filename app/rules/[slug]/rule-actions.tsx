"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ArrowUp, ArrowDown } from "lucide-react";
import { useVoting } from "@/hooks/use-voting";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RuleActionsProps {
	ruleId: string;
	content: string;
	initialUpvotes: number;
	initialDownvotes: number;
}

export function RuleActions({
	ruleId,
	content,
	initialUpvotes,
	initialDownvotes,
}: RuleActionsProps) {
	const { userVote, hasVoted, vote } = useVoting(ruleId);
	const [copyCount, setCopyCount] = useState(0);
	const [upvotes, setUpvotes] = useState(initialUpvotes);
	const [downvotes, setDownvotes] = useState(initialDownvotes);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(content);
			toast.success("Rule copied to clipboard!");
			// Increment copy count
			const response = await fetch(`/api/rules/${ruleId}/copy`, {
				method: "POST",
			});
			if (response.ok) {
				const data = await response.json();
				setCopyCount(data.copyCount);
			}
		} catch {
			toast.error("Failed to copy rule");
		}
	};

	const handleVote = async (voteType: "up" | "down") => {
		const result = await vote(voteType);

		if (result.error) {
			toast.error(result.error);
			return;
		}

		if (result.success) {
			setUpvotes(result.upvotes);
			setDownvotes(result.downvotes);
		}
	};

	return (
		<div className="flex items-center gap-2">
			<div className="flex items-center gap-1">
				<Button
					variant="outline"
					size="sm"
					onClick={() => handleVote("up")}
					className={cn(
						"text-muted-foreground hover:text-green-600 transition-colors",
						userVote === "up" &&
							"text-green-600 bg-green-50 hover:bg-green-100",
					)}
					title={userVote === "up" ? "Change to downvote" : "Upvote this rule"}
				>
					<ArrowUp className="h-4 w-4" />
					{upvotes > 0 && <span className="ml-1">{upvotes}</span>}
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => handleVote("down")}
					className={cn(
						"text-muted-foreground hover:text-red-600 transition-colors",
						userVote === "down" && "text-red-600 bg-red-50 hover:bg-red-100",
					)}
					title={
						userVote === "down" ? "Change to upvote" : "Downvote this rule"
					}
				>
					<ArrowDown className="h-4 w-4" />
					{downvotes > 0 && <span className="ml-1">{downvotes}</span>}
				</Button>
			</div>

			<Button onClick={handleCopy}>
				<Copy className="h-4 w-4 mr-2" />
				Copy Rule
			</Button>
		</div>
	);
}
