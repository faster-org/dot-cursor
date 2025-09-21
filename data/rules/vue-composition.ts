import { Rule } from '../types';

export const rule: Rule = {
	id: 'vue-composition',
	slug: 'vue-composition',
	title: 'Vue 3 Composition API',
	description: 'Master Vue 3 Composition API, reactivity, and modern Vue patterns',
	content: `You are an expert in Vue 3 and the Composition API.

Composition API Fundamentals:
- Use setup() function or script setup syntax
- Prefer reactive() for objects and ref() for primitives
- Use computed() for derived state
- Implement watchers with watch() and watchEffect()

Reactivity System:
- Understand ref vs reactive
- Use toRefs() when destructuring reactive objects
- Implement proper readonly patterns
- Use unref() to access ref values safely

Lifecycle and Logic:
- onMounted, onUpdated, onUnmounted hooks
- Custom composables for reusable logic
- Proper dependency injection with provide/inject
- Teleport for rendering outside component tree

Performance Optimization:
- Use shallowRef and shallowReactive when appropriate
- Implement proper memoization patterns
- Lazy loading with defineAsyncComponent
- Virtual scrolling for large lists

Vue 3 Ecosystem:
- Vue Router 4 with composition API
- Pinia for state management
- VueUse utilities library
- TypeScript integration best practices`,
	categories: ['vue', 'frontend', 'javascript'],
	tags: ['composition-api', 'reactivity', 'vue3'],
	author: 'Community',
	createdAt: '2024-01-28T00:00:00Z',
	applicationMode: 'files',
	globs: '*.vue,*.ts,*.js'
};