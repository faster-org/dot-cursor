"use client";

import { useEffect } from "react";
import { useRuleStatsContext } from "./rule-stats-provider";

interface ViewTrackerProps {
	slug: string;
}

export function ViewTracker({ slug }: ViewTrackerProps) {
	const { updateStats } = useRuleStatsContext();

	useEffect(() => {
		// Track view on component mount
		const trackView = async () => {
			try {
				const response = await fetch(`/api/rules/${slug}/view`, {
					method: "POST",
				});
				if (response.ok) {
					const data = await response.json();
					if (data.viewCount) {
						updateStats({ viewCount: data.viewCount });
					}
				}
			} catch (error) {
				// Fail silently - view tracking shouldn't affect user experience
				console.warn("Failed to track view:", error);
			}
		};

		trackView();
	}, [slug, updateStats]);

	// This component doesn't render anything
	return null;
}