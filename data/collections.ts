import { Collection } from './types';

export const collections: Collection[] = [
	{
		id: 'fullstack-nextjs',
		slug: 'fullstack-nextjs',
		name: 'Full-Stack Next.js',
		description: 'Complete setup for building modern Next.js applications',
		icon: '🚀',
		color: 'blue',
		rules: ['nextjs-app-router', 'tailwind-css', 'react-hooks'],
		featured: true,
		createdAt: '2024-01-01'
	},
	{
		id: 'python-backend',
		slug: 'python-backend',
		name: 'Python Backend',
		description: 'Essential rules for Python API development',
		icon: '🐍',
		color: 'green',
		rules: ['python-fastapi'],
		featured: true,
		createdAt: '2024-01-02'
	},
	{
		id: 'react-essentials',
		slug: 'react-essentials',
		name: 'React Essentials',
		description: 'Core React patterns and best practices',
		icon: '⚛️',
		color: 'cyan',
		rules: ['react-hooks'],
		featured: false,
		createdAt: '2024-01-03'
	},
	{
		id: 'frontend-starter',
		slug: 'frontend-starter',
		name: 'Frontend Starter',
		description: 'Everything you need to start a frontend project',
		icon: '🎨',
		color: 'purple',
		rules: ['tailwind-css', 'react-hooks', 'nextjs-app-router'],
		featured: true,
		createdAt: '2024-01-04'
	}
];