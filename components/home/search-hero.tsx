"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";

interface SearchHeroProps {
	onSearch: (searchTerm: string) => void;
}

export function SearchHero({ onSearch }: SearchHeroProps) {
	const [search, setSearch] = useState("");

	// Instant search - no debouncing for real-time filtering
	useEffect(() => {
		onSearch(search);
	}, [search, onSearch]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			// Search is already happening instantly, no need for special handling
			onSearch(search);
		}
	};

	return (
		<section className="w-full py-12 md:py-16">
			<div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<Image
					className="mx-auto mb-8"
					src="/cursor-dark.png"
					alt="Cursor"
					width={85}
					height={85}
					priority
				/>
				<h1 className="text-4xl font-medium tracking-tight">Community AI Rules for Cursor IDE</h1>
				<p className="mt-4 max-w-2xl mx-auto text-base leading-6 text-muted-foreground">
					Discover, share, and use AI-powered rules to supercharge your development workflow. Browse
					community-created prompts and configurations for Cursor IDE.
				</p>

				<div className="mt-10 max-w-2xl mx-auto">
					<div className="relative">
						<Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
						<Input
							autoFocus
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							onKeyDown={handleKeyDown}
							className="rounded-full h-16 px-8 pl-14 !text-base"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
