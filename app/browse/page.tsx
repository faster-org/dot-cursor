import { prisma } from "@/lib/prisma";
import { BrowseClient } from "./browse-client";

interface RuleWithCategories {
	id: string;
	title: string;
	slug: string;
	description: string;
	content: string;
	viewCount: number;
	copyCount: number;
	upvotes: number;
	downvotes: number;
	createdAt: Date;
	categories: Array<{
		category: {
			id: string;
			name: string;
			slug: string;
		};
	}>;
}

function transformRule(rule: RuleWithCategories) {
	return {
		...rule,
		categories: rule.categories?.map((rc) => rc.category) || [],
	};
}

async function getCategories() {
	const categories = await prisma.category.findMany({
		include: {
			_count: {
				select: {
					rules: {
						where: {
							rule: {
								isPublished: true,
							},
						},
					},
				},
			},
		},
		orderBy: {
			rules: {
				_count: "desc",
			},
		},
	});
	return categories;
}

async function getRules(searchParams: {
	page?: string;
	category?: string;
	search?: string;
	sortBy?: string;
}) {
	const page = parseInt(searchParams.page || "1");
	const limit = 12;
	const skip = (page - 1) * limit;

	const where = {
		isPublished: true,
		...(searchParams.category && {
			categories: {
				some: {
					category: {
						slug: searchParams.category,
					},
				},
			},
		}),
		...(searchParams.search && {
			OR: [
				{ title: { contains: searchParams.search, mode: "insensitive" } },
				{ description: { contains: searchParams.search, mode: "insensitive" } },
				{ content: { contains: searchParams.search, mode: "insensitive" } },
			],
		}),
	};

	const orderBy = searchParams.sortBy === "popular"
		? { copyCount: "desc" }
		: searchParams.sortBy === "votes"
		? { upvotes: "desc" }
		: { createdAt: "desc" };

	const [rules, total] = await Promise.all([
		prisma.rule.findMany({
			where,
			include: {
				categories: {
					include: {
						category: true,
					},
				},
			},
			orderBy,
			skip,
			take: limit,
		}),
		prisma.rule.count({ where }),
	]);

	return {
		rules,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
}

export default async function BrowsePage({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const [categories, initialData] = await Promise.all([
		getCategories(),
		getRules(searchParams),
	]);

	return (
		<div className="w-full max-w-7xl mx-auto px-4 py-4">
			<div className="flex gap-8">
				<BrowseClient
					initialRules={initialData.rules.map(transformRule)}
					initialPagination={initialData.pagination}
					categories={categories}
					initialSearchParams={searchParams}
				/>
			</div>
		</div>
	);
}
