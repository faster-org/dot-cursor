export type ApplicationMode = 'always' | 'intelligent' | 'files' | 'manual';

export interface Rule {
	id: string;
	slug: string;
	title: string;
	description: string;
	content: string;
	categories: string[]; // category slugs
	tags?: string[];
	author?: string;
	createdAt: string;
	applicationMode: ApplicationMode;
	globs?: string; // for 'files' mode - comma-separated file patterns
}

export interface Category {
	id: string;
	slug: string;
	name: string;
	description?: string;
}

export interface RuleWithStats extends Rule {
	upvotes: number;
	downvotes: number;
	viewCount: number;
	copyCount: number;
}