"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export function BackButton() {
	const router = useRouter();
	const [backUrl, setBackUrl] = useState("/");

	useEffect(() => {
		// Check if we have a referrer and if it's from the /rules page
		if (document?.referrer) {
			const referrerUrl = new URL(document.referrer);
			const currentUrl = new URL(window.location.href);

			// Only use referrer if it's from the same origin
			if (referrerUrl.origin === currentUrl.origin) {
				if (referrerUrl.pathname === "/rules" || referrerUrl.pathname.startsWith("/rules?")) {
					setBackUrl("/rules");
				} else {
					setBackUrl("/");
				}
			}
		}
	}, []);

	const handleBack = () => {
		// Try to go back in history if possible, otherwise navigate to the backUrl
		if (window.history.length > 2) {
			router.back();
		} else {
			router.push(backUrl);
		}
	};

	return (
		<Button size="sm" className="mb-6" onClick={handleBack}>
			<ArrowLeft className="!size-3.5" />
			Back
		</Button>
	);
}
