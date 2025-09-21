import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Cursor Rules - Community AI Rules Directory",
	description:
		"Browse, share, and discover AI rules for Cursor IDE. A community-driven directory of prompts and configurations.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<div className="relative flex min-h-screen flex-col">
					<Header />
					<main className="flex-1">{children}</main>
					<footer className="border-t py-6 md:py-0">
						<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
							<p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
								Not affiliated with Cursor.
							</p>
						</div>
					</footer>
				</div>
				<Toaster />
			</body>
		</html>
	);
}
