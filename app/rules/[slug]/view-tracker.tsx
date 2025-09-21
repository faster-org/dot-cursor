"use client";

import { useEffect } from "react";
import { useTrackView } from "@/hooks/queries/use-track-view";

interface ViewTrackerProps {
	slug: string;
}

export function ViewTracker({ slug }: ViewTrackerProps) {
	const trackViewMutation = useTrackView();

	useEffect(() => {
		// Track view on component mount
		trackViewMutation.mutate(slug);
	}, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

	// This component doesn't render anything
	return null;
}