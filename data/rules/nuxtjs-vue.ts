import { Rule } from "../types";

export const rule: Rule = {
	id: "nuxtjs-vue",
	slug: "nuxtjs-vue",
	title: "Nuxt.js Vue Framework",
	description: "Build universal Vue.js applications with Nuxt.js for SSR, SSG, and SPA modes",
	content: `# Nuxtjs Vue

This document provides comprehensive guidelines for nuxtjs vue development and best practices.

---

## Nuxt.js Fundamentals

1. **File-based**
   - File-based routing system
   - Implement proper file-based routing system
   - Follow best practices for optimal results

2. **Auto-generated**
   - Auto-generated routes from pages
   - Implement proper auto-generated routes from pages
   - Follow best practices for optimal results

3. **Server-side**
   - Server-side rendering (SSR) by default
   - Implement proper server-side rendering (ssr) by default
   - Follow best practices for optimal results

4. **Static**
   - Static site generation (SSG) capabilities
   - Implement proper static site generation (ssg) capabilities
   - Follow best practices for optimal results

5. **Single-page**
   - Single-page application (SPA) mode
   - Implement proper single-page application (spa) mode
   - Follow best practices for optimal results

---

## Vue.js Integration

6. **Composition**
   - Composition API with Nuxt
   - Implement proper composition api with nuxt
   - Follow best practices for optimal results

7. **Reactive**
   - Reactive data with ref() and reactive()
   - Implement proper reactive data with ref() and reactive()
   - Follow best practices for optimal results

8. **Computed**
   - Computed properties and watchers
   - Implement proper computed properties and watchers
   - Follow best practices for optimal results

9. **Component**
   - Component communication patterns
   - Implement proper component communication patterns
   - Follow best practices for optimal results

10. **Vue**
   - Vue 3 features and optimizations
   - Implement proper vue 3 features and optimizations
   - Follow best practices for optimal results

---

## Routing & Navigation

11. **Automatic**
   - Automatic route generation
   - Implement proper automatic route generation
   - Follow best practices for optimal results

12. **Dynamic**
   - Dynamic routes with parameters
   - Implement proper dynamic routes with parameters
   - Follow best practices for optimal results

13. **Nested**
   - Nested routes and layouts
   - Implement proper nested routes and layouts
   - Follow best practices for optimal results

14. **Programmatic**
   - Programmatic navigation
   - Implement proper programmatic navigation
   - Follow best practices for optimal results

15. **Route**
   - Route middleware and guards
   - Implement proper route middleware and guards
   - Follow best practices for optimal results

---

## Layouts & Pages

16. **Default**
   - Default and custom layouts
   - Implement proper default and custom layouts
   - Follow best practices for optimal results

17. **Page-specific**
   - Page-specific layouts
   - Implement proper page-specific layouts
   - Follow best practices for optimal results

18. **Error**
   - Error pages and 404 handling
   - Implement proper error pages and 404 handling
   - Follow best practices for optimal results

19. **Layout**
   - Layout transitions
   - Implement proper layout transitions
   - Follow best practices for optimal results

20. **Responsive**
   - Responsive layout strategies
   - Implement proper responsive layout strategies
   - Follow best practices for optimal results

---

## Data Fetching

21. **asyncData**
   - asyncData for server-side data
   - Implement proper asyncdata for server-side data
   - Follow best practices for optimal results

22. **fetch()**
   - fetch() hook for component data
   - Implement proper fetch() hook for component data
   - Follow best practices for optimal results

23. **Static**
   - Static vs dynamic data fetching
   - Implement proper static vs dynamic data fetching
   - Follow best practices for optimal results

24. **API**
   - API integration patterns
   - Implement proper api integration patterns
   - Follow best practices for optimal results

25. **Data**
   - Data caching strategies
   - Implement proper data caching strategies
   - Follow best practices for optimal results

---

## State Management

26. **Pinia**
   - Pinia for state management
   - Implement proper pinia for state management
   - Follow best practices for optimal results

27. **Store**
   - Store composition and modules
   - Implement proper store composition and modules
   - Follow best practices for optimal results

28. **Server-side**
   - Server-side state hydration
   - Implement proper server-side state hydration
   - Follow best practices for optimal results

29. **Persistent**
   - Persistent state with cookies
   - Implement proper persistent state with cookies
   - Follow best practices for optimal results

30. **Real-time**
   - Real-time state synchronization
   - Implement proper real-time state synchronization
   - Follow best practices for optimal results

---

## Styling & UI

31. **CSS**
   - CSS preprocessing (Sass, Less)
   - Implement proper css preprocessing (sass, less)
   - Follow best practices for optimal results

32. **CSS**
   - CSS frameworks integration
   - Implement proper css frameworks integration
   - Follow best practices for optimal results

33. **Tailwind**
   - Tailwind CSS with Nuxt
   - Implement proper tailwind css with nuxt
   - Follow best practices for optimal results

34. **Component-scoped**
   - Component-scoped styles
   - Implement proper component-scoped styles
   - Follow best practices for optimal results

35. **Global**
   - Global styles and variables
   - Implement proper global styles and variables
   - Follow best practices for optimal results

---

## Nuxt Modules

36. **Official**
   - Official modules (@nuxtjs/*)
   - Implement proper official modules (@nuxtjs/*)
   - Follow best practices for optimal results

37. **Community**
   - Community module ecosystem
   - Implement proper community module ecosystem
   - Follow best practices for optimal results

38. **Custom**
   - Custom module development
   - Implement proper custom module development
   - Follow best practices for optimal results

39. **Module**
   - Module configuration and options
   - Implement proper module configuration and options
   - Follow best practices for optimal results

40. **PWA**
   - PWA module for offline functionality
   - Implement proper pwa module for offline functionality
   - Follow best practices for optimal results

---

## SEO & Meta

41. **Head**
   - Head management with useMeta()
   - Implement proper head management with usemeta()
   - Follow best practices for optimal results

42. **Dynamic**
   - Dynamic meta tags
   - Implement proper dynamic meta tags
   - Follow best practices for optimal results

43. **Open**
   - Open Graph optimization
   - Implement proper open graph optimization
   - Follow best practices for optimal results

44. **Structured**
   - Structured data implementation
   - Implement proper structured data implementation
   - Follow best practices for optimal results

45. **Sitemap**
   - Sitemap generation
   - Implement proper sitemap generation
   - Follow best practices for optimal results

---

## Performance Optimization

46. **Code**
   - Code splitting and lazy loading
   - Implement proper code splitting and lazy loading
   - Follow best practices for optimal results

47. **Image**
   - Image optimization
   - Implement proper image optimization
   - Follow best practices for optimal results

48. **Bundle**
   - Bundle analysis and optimization
   - Implement proper bundle analysis and optimization
   - Follow best practices for optimal results

49. **Critical**
   - Critical CSS generation
   - Implement proper critical css generation
   - Follow best practices for optimal results

50. **Service**
   - Service worker integration
   - Implement proper service worker integration
   - Follow best practices for optimal results

---

## Authentication

51. **@nuxtjs/auth**
   - @nuxtjs/auth module
   - Implement proper @nuxtjs/auth module
   - Follow best practices for optimal results

52. **JWT**
   - JWT token handling
   - Implement proper jwt token handling
   - Follow best practices for optimal results

53. **Social**
   - Social authentication
   - Implement proper social authentication
   - Follow best practices for optimal results

54. **Route**
   - Route protection
   - Implement proper route protection
   - Follow best practices for optimal results

55. **Session**
   - Session management
   - Implement proper session management
   - Follow best practices for optimal results

---

## API Development

56. **Server**
   - Server API routes
   - Implement proper server api routes
   - Follow best practices for optimal results

57. **Middleware**
   - Middleware for API requests
   - Implement proper middleware for api requests
   - Follow best practices for optimal results

58. **Database**
   - Database integration
   - Implement proper database integration
   - Follow best practices for optimal results

59. **RESTful**
   - RESTful API patterns
   - Implement proper restful api patterns
   - Follow best practices for optimal results

60. **GraphQL**
   - GraphQL integration
   - Implement proper graphql integration
   - Follow best practices for optimal results

---

## Deployment

61. **Static**
   - Static site deployment
   - Implement proper static site deployment
   - Follow best practices for optimal results

62. **Server**
   - Server deployment options
   - Implement proper server deployment options
   - Follow best practices for optimal results

63. **Vercel**
   - Vercel and Netlify integration
   - Implement proper vercel and netlify integration
   - Follow best practices for optimal results

64. **Docker**
   - Docker containerization
   - Implement proper docker containerization
   - Follow best practices for optimal results

65. **CI/CD**
   - CI/CD pipeline setup
   - Implement proper ci/cd pipeline setup
   - Follow best practices for optimal results

---

## Development Tools

66. **TypeScript**
   - TypeScript integration
   - Implement proper typescript integration
   - Follow best practices for optimal results

67. **ESLint**
   - ESLint and Prettier setup
   - Implement proper eslint and prettier setup
   - Follow best practices for optimal results

68. **Testing**
   - Testing with Jest and Vue Test Utils
   - Implement proper testing with jest and vue test utils
   - Follow best practices for optimal results

69. **Storybook**
   - Storybook for component development
   - Implement proper storybook for component development
   - Follow best practices for optimal results

70. **Hot**
   - Hot module replacement
   - Implement proper hot module replacement
   - Follow best practices for optimal results

---

## Advanced Features

71. **Internationalization**
   - Internationalization (i18n)
   - Implement proper internationalization (i18n)
   - Follow best practices for optimal results

72. **Content**
   - Content management with @nuxt/content
   - Implement proper content management with @nuxt/content
   - Follow best practices for optimal results

73. **E-commerce**
   - E-commerce with @nuxtjs/commerce
   - Implement proper e-commerce with @nuxtjs/commerce
   - Follow best practices for optimal results

74. **Real-time**
   - Real-time features with Socket.IO
   - Implement proper real-time features with socket.io
   - Follow best practices for optimal results

75. **Micro-frontend**
   - Micro-frontend architecture
   - Implement proper micro-frontend architecture
   - Follow best practices for optimal results

---

## Production Considerations

76. **Performance**
   - Performance monitoring
   - Implement proper performance monitoring
   - Follow best practices for optimal results

77. **Error**
   - Error tracking and logging
   - Implement proper error tracking and logging
   - Follow best practices for optimal results

78. **Analytics**
   - Analytics integration
   - Implement proper analytics integration
   - Follow best practices for optimal results

79. **Security**
   - Security best practices
   - Implement proper security best practices
   - Follow best practices for optimal results

80. **Scalability**
   - Scalability planning
   - Implement proper scalability planning
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

Follow these comprehensive guidelines for successful nuxtjs vue implementation.`,
	categories: ["nuxtjs", "vue", "ssr", "fullstack"],
	tags: ["nuxtjs", "vue", "ssr", "universal", "static-generation"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
