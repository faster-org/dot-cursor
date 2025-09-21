import { Rule } from "../types";

export const rule: Rule = {
	id: "svelte-sveltekit",
	slug: "svelte-sveltekit",
	title: "Svelte & SvelteKit Development",
	description: "Build fast, reactive web applications with Svelte and full-stack SvelteKit",
	content: `You are an expert in Svelte and SvelteKit development for modern web applications.

Svelte Core Concepts:
- Reactive declarations with $: syntax
- Component-based architecture
- Compile-time optimizations
- No virtual DOM overhead
- Built-in state management

Component Development:
- Single-file components (.svelte)
- Props for parent-child communication
- Event dispatching with createEventDispatcher
- Slots for content projection
- Context API for data sharing

Reactivity & State:
- Reactive statements with $:
- Stores for global state management
- Writable, readable, and derived stores
- Custom stores with subscribe/update
- Auto-subscriptions with $store syntax

SvelteKit Features:
- File-based routing system
- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes with +page.server.js
- Load functions for data fetching

Routing & Navigation:
- Dynamic routes with [param] syntax
- Nested layouts with +layout.svelte
- Route groups with (group) folders
- Optional parameters with [[param]]
- Programmatic navigation with goto

Forms & Data:
- Form actions with +page.server.js
- Progressive enhancement
- Form validation
- File uploads
- Real-time form updates

Styling & CSS:
- Scoped styles by default
- CSS custom properties
- Sass/SCSS support
- CSS-in-JS alternatives
- Animation and transitions

Performance:
- Automatic code splitting
- Preloading for faster navigation
- Image optimization
- Bundle analysis
- Service workers for caching

Testing:
- Unit testing with Vitest
- Component testing with @testing-library/svelte
- E2E testing with Playwright
- Visual regression testing
- Mock data and API responses

Advanced Features:
- Server-side components
- Streaming with async iterables
- WebSocket integration
- Real-time features
- Progressive web app capabilities

Deployment:
- Static deployment to Netlify/Vercel
- Node.js server deployment
- Docker containerization
- Edge function deployment
- CDN optimization

TypeScript Integration:
- Full TypeScript support
- Type-safe stores
- Component prop types
- API route typing
- Generic components`,
	categories: ["svelte", "sveltekit", "frontend", "fullstack"],
	tags: ["svelte", "sveltekit", "reactive", "ssr", "file-routing"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "files",
	globs: "*.svelte,*.ts,*.js,svelte.config.js,vite.config.js",
};
