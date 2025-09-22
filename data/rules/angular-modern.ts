import { Rule } from "../types";

export const rule: Rule = {
	id: "angular-modern",
	slug: "angular-modern",
	title: "Modern Angular Development",
	description: "Build scalable web applications with latest Angular features and best practices",
	content: `# Angular Modern

This document provides comprehensive guidelines for angular modern development and best practices.

---

## Angular Architecture

1. **Standalone**
   - Standalone components (Angular 14+)
   - Implement proper standalone components (angular 14+)
   - Follow best practices for optimal results

2. **Signals**
   - Signals for reactive programming (Angular 16+)
   - Implement proper signals for reactive programming (angular 16+)
   - Follow best practices for optimal results

3. **Control**
   - Control flow syntax (@if, @for, @switch)
   - Implement proper control flow syntax (@if, @for, @switch)
   - Follow best practices for optimal results

4. **Dependency**
   - Dependency injection with inject() function
   - Implement proper dependency injection with inject() function
   - Follow best practices for optimal results

5. **Modular**
   - Modular architecture with feature modules
   - Implement proper modular architecture with feature modules
   - Follow best practices for optimal results

---

## Component Development

6. **OnPush**
   - OnPush change detection strategy
   - Implement proper onpush change detection strategy
   - Follow best practices for optimal results

7. **Input/Output**
   - Input/Output decorators for communication
   - Implement proper input/output decorators for communication
   - Follow best practices for optimal results

8. **ViewChild**
   - ViewChild and ContentChild for DOM access
   - Implement proper viewchild and contentchild for dom access
   - Follow best practices for optimal results

9. **Lifecycle**
   - Lifecycle hooks implementation
   - Implement proper lifecycle hooks implementation
   - Follow best practices for optimal results

10. **Reactive**
   - Reactive forms with FormBuilder
   - Implement proper reactive forms with formbuilder
   - Follow best practices for optimal results

---

## State Management

11. **NgRx**
   - NgRx for complex state management
   - Implement proper ngrx for complex state management
   - Follow best practices for optimal results

12. **Akita**
   - Akita for simpler state needs
   - Implement proper akita for simpler state needs
   - Follow best practices for optimal results

13. **Signal-based**
   - Signal-based state with computed values
   - Implement proper signal-based state with computed values
   - Follow best practices for optimal results

14. **Service-based**
   - Service-based state for simple scenarios
   - Implement proper service-based state for simple scenarios
   - Follow best practices for optimal results

15. **RxJS**
   - RxJS operators for reactive programming
   - Implement proper rxjs operators for reactive programming
   - Follow best practices for optimal results

---

## Routing & Navigation

16. **Angular**
   - Angular Router with lazy loading
   - Implement proper angular router with lazy loading
   - Follow best practices for optimal results

17. **Route**
   - Route guards for authentication
   - Implement proper route guards for authentication
   - Follow best practices for optimal results

18. **Resolver**
   - Resolver for data preloading
   - Implement proper resolver for data preloading
   - Follow best practices for optimal results

19. **Nested**
   - Nested routes and child components
   - Implement proper nested routes and child components
   - Follow best practices for optimal results

20. **Route**
   - Route parameters and query strings
   - Implement proper route parameters and query strings
   - Follow best practices for optimal results

---

## HTTP & Data Management

21. **HttpClient**
   - HttpClient for API communication
   - Implement proper httpclient for api communication
   - Follow best practices for optimal results

22. **Interceptors**
   - Interceptors for request/response handling
   - Implement proper interceptors for request/response handling
   - Follow best practices for optimal results

23. **Error**
   - Error handling with catchError
   - Implement proper error handling with catcherror
   - Follow best practices for optimal results

24. **Caching**
   - Caching strategies
   - Implement proper caching strategies
   - Follow best practices for optimal results

25. **Optimistic**
   - Optimistic updates
   - Implement proper optimistic updates
   - Follow best practices for optimal results

---

## Forms & Validation

26. **Reactive**
   - Reactive forms with FormGroup/FormControl
   - Implement proper reactive forms with formgroup/formcontrol
   - Follow best practices for optimal results

27. **Custom**
   - Custom validators
   - Implement proper custom validators
   - Follow best practices for optimal results

28. **Cross-field**
   - Cross-field validation
   - Implement proper cross-field validation
   - Follow best practices for optimal results

29. **Dynamic**
   - Dynamic form generation
   - Implement proper dynamic form generation
   - Follow best practices for optimal results

30. **Async**
   - Async validation
   - Implement proper async validation
   - Follow best practices for optimal results

---

## Testing

31. **Unit**
   - Unit testing with Jasmine and Karma
   - Implement proper unit testing with jasmine and karma
   - Follow best practices for optimal results

32. **Component**
   - Component testing with TestBed
   - Implement proper component testing with testbed
   - Follow best practices for optimal results

33. **Service**
   - Service testing with HttpClientTestingModule
   - Implement proper service testing with httpclienttestingmodule
   - Follow best practices for optimal results

34. **E2E**
   - E2E testing with Cypress or Playwright
   - Implement proper e2e testing with cypress or playwright
   - Follow best practices for optimal results

35. **Mock**
   - Mock data and services
   - Implement proper mock data and services
   - Follow best practices for optimal results

---

## Performance Optimization

36. **OnPush**
   - OnPush change detection
   - Implement proper onpush change detection
   - Follow best practices for optimal results

37. **Lazy**
   - Lazy loading modules and components
   - Implement proper lazy loading modules and components
   - Follow best practices for optimal results

38. **Tree**
   - Tree shaking and bundle optimization
   - Implement proper tree shaking and bundle optimization
   - Follow best practices for optimal results

39. **Image**
   - Image optimization with NgOptimizedImage
   - Implement proper image optimization with ngoptimizedimage
   - Follow best practices for optimal results

40. **Virtual**
   - Virtual scrolling for large lists
   - Implement proper virtual scrolling for large lists
   - Follow best practices for optimal results

---

## Styling & UI

41. **Angular**
   - Angular Material for UI components
   - Implement proper angular material for ui components
   - Follow best practices for optimal results

42. **CSS**
   - CSS custom properties for theming
   - Implement proper css custom properties for theming
   - Follow best practices for optimal results

43. **SCSS**
   - SCSS for advanced styling
   - Implement proper scss for advanced styling
   - Follow best practices for optimal results

44. **Component-scoped**
   - Component-scoped styles
   - Implement proper component-scoped styles
   - Follow best practices for optimal results

45. **Responsive**
   - Responsive design patterns
   - Implement proper responsive design patterns
   - Follow best practices for optimal results

---

## Build & Deployment

46. **Angular**
   - Angular CLI for project management
   - Implement proper angular cli for project management
   - Follow best practices for optimal results

47. **Environment**
   - Environment configurations
   - Implement proper environment configurations
   - Follow best practices for optimal results

48. **Bundle**
   - Bundle analysis and optimization
   - Implement proper bundle analysis and optimization
   - Follow best practices for optimal results

49. **PWA**
   - PWA features with service workers
   - Implement proper pwa features with service workers
   - Follow best practices for optimal results

50. **Docker**
   - Docker containerization
   - Implement proper docker containerization
   - Follow best practices for optimal results

---

## Modern Angular Features

51. **Standalone**
   - Standalone components
   - Implement proper standalone components
   - Follow best practices for optimal results

52. **Signal-based**
   - Signal-based reactivity
   - Implement proper signal-based reactivity
   - Follow best practices for optimal results

53. **New**
   - New control flow syntax
   - Implement proper new control flow syntax
   - Follow best practices for optimal results

54. **inject()**
   - inject() function for DI
   - Implement proper inject() function for di
   - Follow best practices for optimal results

55. **Required**
   - Required inputs and optional inputs
   - Implement proper required inputs and optional inputs
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

Follow these comprehensive guidelines for successful angular modern implementation.`,
	categories: ["angular", "typescript", "frontend", "spa"],
	tags: ["angular", "typescript", "reactive-programming", "ngrx", "signals"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
