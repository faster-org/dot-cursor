import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRuleBySlug } from "@/lib/data-loader";

export async function POST(
	_request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> },
) {
	try {
		const { slug } = await params;

		// Check if rule exists in our file system
		const fileRule = await getRuleBySlug(slug);
		if (!fileRule) {
			return NextResponse.json({ error: "Rule not found" }, { status: 404 });
		}

		// Increment copy count in Supabase (create record if doesn't exist)
		const rule = await prisma.rule.upsert({
			where: { slug },
			update: {
				copyCount: { increment: 1 },
			},
			create: {
				slug,
				title: fileRule.title,
				description: fileRule.description,
				content: fileRule.content,
				viewCount: 0,
				copyCount: 1,
				upvotes: 0,
				downvotes: 0,
				isPublished: true,
			},
		});

		return NextResponse.json({ success: true, copyCount: rule.copyCount });
	} catch (error) {
		console.error("Error incrementing copy count:", error);
		return NextResponse.json({ error: "Failed to increment copy count" }, { status: 500 });
	}
}
