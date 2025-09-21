import { Rule } from '../types';

export const rule: Rule = {
	id: 'angular-modern',
	slug: 'angular-modern',
	title: 'Modern Angular Development',
	description: 'Build scalable web applications with latest Angular features and best practices',
	content: `You are an expert in modern Angular development using the latest features and best practices.

Angular Architecture:
- Standalone components (Angular 14+)
- Signals for reactive programming (Angular 16+)
- Control flow syntax (@if, @for, @switch)
- Dependency injection with inject() function
- Modular architecture with feature modules

Component Development:
- OnPush change detection strategy
- Input/Output decorators for communication
- ViewChild and ContentChild for DOM access
- Lifecycle hooks implementation
- Reactive forms with FormBuilder

State Management:
- NgRx for complex state management
- Akita for simpler state needs
- Signal-based state with computed values
- Service-based state for simple scenarios
- RxJS operators for reactive programming

Routing & Navigation:
- Angular Router with lazy loading
- Route guards for authentication
- Resolver for data preloading
- Nested routes and child components
- Route parameters and query strings

HTTP & Data Management:
- HttpClient for API communication
- Interceptors for request/response handling
- Error handling with catchError
- Caching strategies
- Optimistic updates

Forms & Validation:
- Reactive forms with FormGroup/FormControl
- Custom validators
- Cross-field validation
- Dynamic form generation
- Async validation

Testing:
- Unit testing with Jasmine and Karma
- Component testing with TestBed
- Service testing with HttpClientTestingModule
- E2E testing with Cypress or Playwright
- Mock data and services

Performance Optimization:
- OnPush change detection
- Lazy loading modules and components
- Tree shaking and bundle optimization
- Image optimization with NgOptimizedImage
- Virtual scrolling for large lists

Styling & UI:
- Angular Material for UI components
- CSS custom properties for theming
- SCSS for advanced styling
- Component-scoped styles
- Responsive design patterns

Build & Deployment:
- Angular CLI for project management
- Environment configurations
- Bundle analysis and optimization
- PWA features with service workers
- Docker containerization

Modern Angular Features:
- Standalone components
- Signal-based reactivity
- New control flow syntax
- inject() function for DI
- Required inputs and optional inputs`,
	categories: ['angular', 'typescript', 'frontend', 'spa'],
	tags: ['angular', 'typescript', 'reactive-programming', 'ngrx', 'signals'],
	author: 'Community',
	createdAt: '2024-01-30T00:00:00Z',
	applicationMode: 'files',
	globs: '*.ts,*.html,*.scss,*.css,angular.json,package.json'
};