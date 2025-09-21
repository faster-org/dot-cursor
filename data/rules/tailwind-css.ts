import { Rule } from '../types';

export const rule: Rule = {
	id: 'tailwind-css',
	slug: 'tailwind-css',
	title: 'Tailwind CSS Best Practices',
	description: 'Expert in Tailwind CSS, responsive design, and utility-first CSS architecture',
	content: `You are an expert in Tailwind CSS, responsive web design, and modern CSS practices.

Core Principles:
- Use Tailwind utility classes exclusively, avoid custom CSS when possible
- Implement responsive design with mobile-first approach
- Leverage Tailwind's design system for consistency
- Use component composition for reusable UI patterns

Tailwind Best Practices:
- Use Tailwind's spacing scale consistently (p-4, m-2, etc.)
- Implement dark mode with dark: variant classes
- Use @apply sparingly, only for truly reusable component classes
- Leverage Tailwind plugins for extended functionality

Responsive Design:
- Start with mobile layout (no prefix), then add sm:, md:, lg:, xl: breakpoints
- Use container class with responsive padding
- Implement fluid typography with prose or custom scales
- Use grid and flexbox utilities for layouts

Performance & Organization:
- Purge unused styles in production builds
- Organize utility classes logically: layout, spacing, typography, colors
- Use Tailwind config for custom design tokens
- Implement component classes in separate files when needed`,
	categories: ['css', 'design', 'frontend'],
	tags: ['tailwind', 'responsive', 'utility-first'],
	author: 'Community',
	createdAt: '2024-01-20T00:00:00Z',
	applicationMode: 'files',
	globs: '*.css,*.scss,*.tsx,*.jsx'
};