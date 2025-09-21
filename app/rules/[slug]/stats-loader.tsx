"use client";

import { Eye, Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRuleStatsContext } from "./rule-stats-provider";

export function StatsLoader() {
	const { stats, loading } = useRuleStatsContext();

	return (
		<>
			<div className="flex items-center gap-1">
				<Eye className="h-3 w-3" />
				{loading ? <Skeleton className="h-4 w-12" /> : <span>{stats.viewCount} views</span>}
			</div>

			<div className="flex items-center gap-1">
				<Copy className="h-3 w-3" />
				{loading ? <Skeleton className="h-4 w-14" /> : <span>{stats.copyCount} copies</span>}
			</div>
		</>
	);
}
