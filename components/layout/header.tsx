"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { ArrowUpRight, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	return (
		<header className="sticky top-0 z-50 w-full bg-background">
			<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center">
				<div className="mr-4 flex">
					<Link href="/" className="mr-6 flex items-center space-x-2">
						<Image
							src="/cursor-dark.png"
							alt="Cursor Rules"
							width={24}
							height={24}
							className="h-5 w-5"
							priority
						/>
						<span className="text-base font-mono font-semibold">.cursor</span>
					</Link>
				</div>

				<div className="flex flex-1 justify-end sm:hidden">
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
							>
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle Menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="p-4">
							<SheetTitle className="sr-only">Navigation Menu</SheetTitle>
							<Link href="/" className="mr-6 flex items-center space-x-2">
								<Image
									src="/cursor-dark.png"
									alt="Cursor Rules"
									width={24}
									height={24}
									className="h-5 w-5"
									priority
								/>
								<span className="text-base font-mono font-semibold">.cursor</span>
							</Link>
							<nav className="flex flex-col space-y-3">
								<Link
									href="/collections"
									className={cn(
										"transition-colors",
										pathname === "/collections" ? "text-foreground" : "text-foreground/60",
									)}
									onClick={() => setIsOpen(false)}
								>
									Collections
								</Link>
								<Link
									href="/rules"
									className={cn(
										"transition-colors",
										pathname === "/rules" ? "text-foreground" : "text-foreground/60",
									)}
									onClick={() => setIsOpen(false)}
								>
									Rules
								</Link>
								<Link
									href="/trending"
									className={cn(
										"transition-colors",
										pathname === "/trending" ? "text-foreground" : "text-foreground/60",
									)}
									onClick={() => setIsOpen(false)}
								>
									Trending
								</Link>
								<Link
									href="https://discord.gg/BVjdzW2psp"
									target="_blank"
									className={cn(
										"flex flex-row items-center gap-1.5 transition-colors text-foreground/60",
									)}
									onClick={() => setIsOpen(false)}
								>
									Community
									<ArrowUpRight className="h-4 w-4" />
								</Link>
								<Link
									href="https://github.com/faster-org/dot-cursor"
									target="_blank"
									rel="noopener noreferrer"
									className={cn(
										"flex flex-row items-center gap-1.5 transition-colors text-foreground/60",
									)}
									onClick={() => setIsOpen(false)}
								>
									<SiGithub className="h-4.5 w-4.5" />
									GitHub
								</Link>
							</nav>
						</SheetContent>
					</Sheet>
				</div>

				<div className="hidden sm:flex flex-1 flex-row gap-5 items-center justify-end">
					<Link
						href="/collections"
						className={cn(
							"font-medium text-sm transition-colors",
							pathname === "/collections" ? "text-foreground" : "text-muted-foreground",
						)}
					>
						Collections
					</Link>
					<Link
						href="/rules"
						className={cn(
							"font-medium text-sm transition-colors",
							pathname === "/rules" ? "text-foreground" : "text-muted-foreground",
						)}
					>
						Rules
					</Link>
					<Link
						href="/trending"
						className={cn(
							"font-medium text-sm transition-colors",
							pathname === "/trending" ? "text-foreground" : "text-muted-foreground",
						)}
					>
						Trending
					</Link>
					<Link
						href="https://discord.gg/BVjdzW2psp"
						target="_blank"
						className={cn(
							"flex flex-row items-center gap-1.5 font-medium text-sm transition-colors text-muted-foreground",
						)}
					>
						Community
						<ArrowUpRight className="h-4 w-4" />
					</Link>
					<Link
						href="https://github.com/faster-org/dot-cursor"
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium text-sm transition-colors text-foreground hover:text-foreground/80"
					>
						<SiGithub className="h-4.5 w-4.5" />
					</Link>
				</div>
			</div>
		</header>
	);
}
