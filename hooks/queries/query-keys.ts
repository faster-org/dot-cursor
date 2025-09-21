// Query Keys Factory for React Query
// Centralized query keys to ensure consistency and avoid duplication

export const queryKeys = {
	rules: {
		all: ['rules'] as const,
		stats: (slug: string) => ['rules', 'stats', slug] as const,
		single: (slug: string) => ['rules', slug] as const,
	},
	voting: {
		vote: (ruleId: string) => ['voting', ruleId] as const,
	},
	copy: {
		track: (slug: string) => ['copy', slug] as const,
	},
	view: {
		track: (slug: string) => ['view', slug] as const,
	},
} as const;