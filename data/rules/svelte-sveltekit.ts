import { Rule } from "../types";

export const rule: Rule = {
	id: "svelte-sveltekit",
	slug: "svelte-sveltekit",
	title: "Svelte & SvelteKit Development",
	description: "Build fast, reactive web applications with Svelte and full-stack SvelteKit",
	content: `# Svelte Sveltekit

This document provides comprehensive guidelines for svelte sveltekit development and best practices.

---

## Svelte Core Concepts

1. **Reactive**
   - Reactive declarations with $: syntax
   - Implement proper reactive declarations with $: syntax
   - Follow best practices for optimal results

2. **Component-based**
   - Component-based architecture
   - Implement proper component-based architecture
   - Follow best practices for optimal results

3. **Compile-time**
   - Compile-time optimizations
   - Implement proper compile-time optimizations
   - Follow best practices for optimal results

4. **No**
   - No virtual DOM overhead
   - Implement proper no virtual dom overhead
   - Follow best practices for optimal results

5. **Built-in**
   - Built-in state management
   - Implement proper built-in state management
   - Follow best practices for optimal results

---

## Component Development

6. **Single-file**
   - Single-file components (.svelte)
   - Implement proper single-file components (.svelte)
   - Follow best practices for optimal results

7. **Props**
   - Props for parent-child communication
   - Implement proper props for parent-child communication
   - Follow best practices for optimal results

8. **Event**
   - Event dispatching with createEventDispatcher
   - Implement proper event dispatching with createeventdispatcher
   - Follow best practices for optimal results

9. **Slots**
   - Slots for content projection
   - Implement proper slots for content projection
   - Follow best practices for optimal results

10. **Context**
   - Context API for data sharing
   - Implement proper context api for data sharing
   - Follow best practices for optimal results

---

## Reactivity & State

11. **Reactive**
   - Reactive statements with $:
   - Implement proper reactive statements with $:
   - Follow best practices for optimal results

12. **Stores**
   - Stores for global state management
   - Implement proper stores for global state management
   - Follow best practices for optimal results

13. **Writable,**
   - Writable, readable, and derived stores
   - Implement proper writable, readable, and derived stores
   - Follow best practices for optimal results

14. **Custom**
   - Custom stores with subscribe/update
   - Implement proper custom stores with subscribe/update
   - Follow best practices for optimal results

15. **Auto-subscriptions**
   - Auto-subscriptions with $store syntax
   - Implement proper auto-subscriptions with $store syntax
   - Follow best practices for optimal results

---

## SvelteKit Features

16. **File-based**
   - File-based routing system
   - Implement proper file-based routing system
   - Follow best practices for optimal results

17. **Server-side**
   - Server-side rendering (SSR)
   - Implement proper server-side rendering (ssr)
   - Follow best practices for optimal results

18. **Static**
   - Static site generation (SSG)
   - Implement proper static site generation (ssg)
   - Follow best practices for optimal results

19. **API**
   - API routes with +page.server.js
   - Implement proper api routes with +page.server.js
   - Follow best practices for optimal results

20. **Load**
   - Load functions for data fetching
   - Implement proper load functions for data fetching
   - Follow best practices for optimal results

---

## Routing & Navigation

21. **Dynamic**
   - Dynamic routes with [param] syntax
   - Implement proper dynamic routes with [param] syntax
   - Follow best practices for optimal results

22. **Nested**
   - Nested layouts with +layout.svelte
   - Implement proper nested layouts with +layout.svelte
   - Follow best practices for optimal results

23. **Route**
   - Route groups with (group) folders
   - Implement proper route groups with (group) folders
   - Follow best practices for optimal results

24. **Optional**
   - Optional parameters with [[param]]
   - Implement proper optional parameters with [[param]]
   - Follow best practices for optimal results

25. **Programmatic**
   - Programmatic navigation with goto
   - Implement proper programmatic navigation with goto
   - Follow best practices for optimal results

---

## Forms & Data

26. **Form**
   - Form actions with +page.server.js
   - Implement proper form actions with +page.server.js
   - Follow best practices for optimal results

27. **Progressive**
   - Progressive enhancement
   - Implement proper progressive enhancement
   - Follow best practices for optimal results

28. **Form**
   - Form validation
   - Implement proper form validation
   - Follow best practices for optimal results

29. **File**
   - File uploads
   - Implement proper file uploads
   - Follow best practices for optimal results

30. **Real-time**
   - Real-time form updates
   - Implement proper real-time form updates
   - Follow best practices for optimal results

---

## Styling & CSS

31. **Scoped**
   - Scoped styles by default
   - Implement proper scoped styles by default
   - Follow best practices for optimal results

32. **CSS**
   - CSS custom properties
   - Implement proper css custom properties
   - Follow best practices for optimal results

33. **Sass/SCSS**
   - Sass/SCSS support
   - Implement proper sass/scss support
   - Follow best practices for optimal results

34. **CSS-in-JS**
   - CSS-in-JS alternatives
   - Implement proper css-in-js alternatives
   - Follow best practices for optimal results

35. **Animation**
   - Animation and transitions
   - Implement proper animation and transitions
   - Follow best practices for optimal results

---

## Performance

36. **Automatic**
   - Automatic code splitting
   - Implement proper automatic code splitting
   - Follow best practices for optimal results

37. **Preloading**
   - Preloading for faster navigation
   - Implement proper preloading for faster navigation
   - Follow best practices for optimal results

38. **Image**
   - Image optimization
   - Implement proper image optimization
   - Follow best practices for optimal results

39. **Bundle**
   - Bundle analysis
   - Implement proper bundle analysis
   - Follow best practices for optimal results

40. **Service**
   - Service workers for caching
   - Implement proper service workers for caching
   - Follow best practices for optimal results

---

## Testing

41. **Unit**
   - Unit testing with Vitest
   - Implement proper unit testing with vitest
   - Follow best practices for optimal results

42. **Component**
   - Component testing with @testing-library/svelte
   - Implement proper component testing with @testing-library/svelte
   - Follow best practices for optimal results

43. **E2E**
   - E2E testing with Playwright
   - Implement proper e2e testing with playwright
   - Follow best practices for optimal results

44. **Visual**
   - Visual regression testing
   - Implement proper visual regression testing
   - Follow best practices for optimal results

45. **Mock**
   - Mock data and API responses
   - Implement proper mock data and api responses
   - Follow best practices for optimal results

---

## Advanced Features

46. **Server-side**
   - Server-side components
   - Implement proper server-side components
   - Follow best practices for optimal results

47. **Streaming**
   - Streaming with async iterables
   - Implement proper streaming with async iterables
   - Follow best practices for optimal results

48. **WebSocket**
   - WebSocket integration
   - Implement proper websocket integration
   - Follow best practices for optimal results

49. **Real-time**
   - Real-time features
   - Implement proper real-time features
   - Follow best practices for optimal results

50. **Progressive**
   - Progressive web app capabilities
   - Implement proper progressive web app capabilities
   - Follow best practices for optimal results

---

## Deployment

51. **Static**
   - Static deployment to Netlify/Vercel
   - Implement proper static deployment to netlify/vercel
   - Follow best practices for optimal results

52. **Node.js**
   - Node.js server deployment
   - Implement proper node.js server deployment
   - Follow best practices for optimal results

53. **Docker**
   - Docker containerization
   - Implement proper docker containerization
   - Follow best practices for optimal results

54. **Edge**
   - Edge function deployment
   - Implement proper edge function deployment
   - Follow best practices for optimal results

55. **CDN**
   - CDN optimization
   - Implement proper cdn optimization
   - Follow best practices for optimal results

---

## TypeScript Integration

56. **Full**
   - Full TypeScript support
   - Implement proper full typescript support
   - Follow best practices for optimal results

57. **Type-safe**
   - Type-safe stores
   - Implement proper type-safe stores
   - Follow best practices for optimal results

58. **Component**
   - Component prop types
   - Implement proper component prop types
   - Follow best practices for optimal results

59. **API**
   - API route typing
   - Implement proper api route typing
   - Follow best practices for optimal results

60. **Generic**
   - Generic components
   - Implement proper generic components
   - Follow best practices for optimal results

---

## Summary Checklist

- [ ] Core principles implemented
- [ ] Best practices followed
- [ ] Performance optimized
- [ ] Security measures in place
- [ ] Testing strategy implemented
- [ ] Documentation completed
- [ ] Monitoring configured
- [ ] Production deployment ready

---

Follow these comprehensive guidelines for successful svelte sveltekit implementation.`,
	categories: ["svelte", "sveltekit", "frontend", "fullstack"],
	tags: ["svelte", "sveltekit", "reactive", "ssr", "file-routing"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
