import { Rule } from "../types";

export const rule: Rule = {
	id: "react-testing-library",
	slug: "react-testing-library",
	title: "React Testing Library Best Practices",
	description:
		"Comprehensive testing strategies with React Testing Library, Jest, and modern testing patterns",
	content: `# React Testing Library Best Practices

Comprehensive guide for testing React applications with React Testing Library, focusing on user-centric testing patterns and best practices.

---

## Core Testing Principles

1. **Test User Behavior, Not Implementation**
   - Focus on what users see and interact with
   - Avoid testing internal component state or implementation details
   - Write tests that give confidence in real user interactions
   - Example user-focused tests:
     \`\`\`tsx
     import { render, screen, fireEvent, waitFor } from '@testing-library/react';
     import userEvent from '@testing-library/user-event';
     import { describe, it, expect, vi } from 'vitest';
     import LoginForm from './LoginForm';

     describe('LoginForm', () => {
       // Good: Tests user behavior
       it('allows user to login with valid credentials', async () => {
         const user = userEvent.setup();
         const mockOnLogin = vi.fn();

         render(<LoginForm onLogin={mockOnLogin} />);

         // Find elements by their accessible roles/labels
         const emailInput = screen.getByLabelText(/email/i);
         const passwordInput = screen.getByLabelText(/password/i);
         const loginButton = screen.getByRole('button', { name: /login/i });

         // Simulate user interactions
         await user.type(emailInput, 'user@example.com');
         await user.type(passwordInput, 'password123');
         await user.click(loginButton);

         // Assert on observable behavior
         expect(mockOnLogin).toHaveBeenCalledWith({
           email: 'user@example.com',
           password: 'password123'
         });
       });

       // Bad: Tests implementation details
       it('should not test internal state directly', () => {
         // Don't test useState, component methods, or internal state
         // These are implementation details that can change
       });
     });
     \`\`\`

2. **Query Priorities and Accessibility**
   - Use queries that mirror how users and assistive technologies find elements
   - Follow the query priority order: getByRole > getByLabelText > getByPlaceholderText > getByText > getByTestId
   - Ensure tests promote accessible markup
   - Example query usage:
     \`\`\`tsx
     import { render, screen } from '@testing-library/react';
     import ProductCard from './ProductCard';

     describe('ProductCard', () => {
       const mockProduct = {
         id: '1',
         name: 'Laptop',
         price: 999.99,
         description: 'High-performance laptop',
         inStock: true
       };

       it('displays product information accessibly', () => {
         render(<ProductCard product={mockProduct} />);

         // 1. getByRole - Most preferred
         const heading = screen.getByRole('heading', { name: 'Laptop' });
         const buyButton = screen.getByRole('button', { name: /add to cart/i });

         // 2. getByLabelText - For form elements
         const quantityInput = screen.getByLabelText(/quantity/i);

         // 3. getByText - For non-interactive content
         const price = screen.getByText('$999.99');

         // 4. getByTestId - Last resort
         const productContainer = screen.getByTestId('product-card');

         expect(heading).toBeInTheDocument();
         expect(buyButton).toBeEnabled();
         expect(quantityInput).toHaveValue(1);
         expect(price).toBeInTheDocument();
       });

       it('shows out of stock state correctly', () => {
         const outOfStockProduct = { ...mockProduct, inStock: false };
         render(<ProductCard product={outOfStockProduct} />);

         const buyButton = screen.getByRole('button', { name: /add to cart/i });
         expect(buyButton).toBeDisabled();

         // Check for accessible out of stock indication
         expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
       });
     });
     \`\`\`

3. **Async Testing Patterns**
   - Use waitFor for elements that appear asynchronously
   - Use findBy queries for elements that will eventually appear
   - Handle loading states and async operations properly
   - Example async testing:
     \`\`\`tsx
     import { render, screen, waitFor } from '@testing-library/react';
     import userEvent from '@testing-library/user-event';
     import { rest } from 'msw';
     import { setupServer } from 'msw/node';
     import UserProfile from './UserProfile';

     // Setup Mock Service Worker
     const server = setupServer(
       rest.get('/api/users/:id', (req, res, ctx) => {
         return res(ctx.json({
           id: '1',
           name: 'John Doe',
           email: 'john@example.com'
         }));
       })
     );

     beforeAll(() => server.listen());
     afterEach(() => server.resetHandlers());
     afterAll(() => server.close());

     describe('UserProfile', () => {
       it('loads and displays user data', async () => {
         render(<UserProfile userId="1" />);

         // Initially shows loading state
         expect(screen.getByText(/loading/i)).toBeInTheDocument();

         // Wait for user data to load and display
         const userName = await screen.findByText('John Doe');
         const userEmail = await screen.findByText('john@example.com');

         expect(userName).toBeInTheDocument();
         expect(userEmail).toBeInTheDocument();

         // Loading indicator should be gone
         expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
       });

       it('handles loading errors gracefully', async () => {
         // Override the handler to return an error
         server.use(
           rest.get('/api/users/:id', (req, res, ctx) => {
             return res(ctx.status(500));
           })
         );

         render(<UserProfile userId="1" />);

         // Wait for error message to appear
         await waitFor(() => {
           expect(screen.getByText(/failed to load user/i)).toBeInTheDocument();
         });

         // Should have a retry button
         const retryButton = screen.getByRole('button', { name: /retry/i });
         expect(retryButton).toBeInTheDocument();
       });

       it('allows retrying failed requests', async () => {
         const user = userEvent.setup();

         // First request fails
         server.use(
           rest.get('/api/users/:id', (req, res, ctx) => {
             return res(ctx.status(500));
           })
         );

         render(<UserProfile userId="1" />);

         await waitFor(() => {
           expect(screen.getByText(/failed to load user/i)).toBeInTheDocument();
         });

         // Reset to successful response
         server.use(
           rest.get('/api/users/:id', (req, res, ctx) => {
             return res(ctx.json({
               id: '1',
               name: 'John Doe',
               email: 'john@example.com'
             }));
           })
         );

         // Click retry
         const retryButton = screen.getByRole('button', { name: /retry/i });
         await user.click(retryButton);

         // Should show user data after retry
         await waitFor(() => {
           expect(screen.getByText('John Doe')).toBeInTheDocument();
         });
       });
     });
     \`\`\`

---

## Component Testing Patterns

4. **Form Testing**
   - Test form validation, submission, and error handling
   - Use userEvent for realistic user interactions
   - Test accessibility of form elements
   - Example form testing:
     \`\`\`tsx
     import { render, screen, waitFor } from '@testing-library/react';
     import userEvent from '@testing-library/user-event';
     import ContactForm from './ContactForm';

     describe('ContactForm', () => {
       it('validates required fields', async () => {
         const user = userEvent.setup();
         const mockOnSubmit = vi.fn();

         render(<ContactForm onSubmit={mockOnSubmit} />);

         const submitButton = screen.getByRole('button', { name: /submit/i });
         await user.click(submitButton);

         // Should show validation errors
         expect(screen.getByText(/name is required/i)).toBeInTheDocument();
         expect(screen.getByText(/email is required/i)).toBeInTheDocument();
         expect(screen.getByText(/message is required/i)).toBeInTheDocument();

         // Should not have called onSubmit
         expect(mockOnSubmit).not.toHaveBeenCalled();
       });

       it('validates email format', async () => {
         const user = userEvent.setup();

         render(<ContactForm onSubmit={vi.fn()} />);

         const emailInput = screen.getByLabelText(/email/i);
         await user.type(emailInput, 'invalid-email');
         await user.tab(); // Trigger blur event

         expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
       });

       it('submits form with valid data', async () => {
         const user = userEvent.setup();
         const mockOnSubmit = vi.fn();

         render(<ContactForm onSubmit={mockOnSubmit} />);

         // Fill out form
         await user.type(screen.getByLabelText(/name/i), 'John Doe');
         await user.type(screen.getByLabelText(/email/i), 'john@example.com');
         await user.type(screen.getByLabelText(/message/i), 'Hello, this is a test message.');

         // Submit form
         await user.click(screen.getByRole('button', { name: /submit/i }));

         await waitFor(() => {
           expect(mockOnSubmit).toHaveBeenCalledWith({
             name: 'John Doe',
             email: 'john@example.com',
             message: 'Hello, this is a test message.'
           });
         });
       });

       it('disables submit button during submission', async () => {
         const user = userEvent.setup();
         const mockOnSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));

         render(<ContactForm onSubmit={mockOnSubmit} />);

         // Fill out form
         await user.type(screen.getByLabelText(/name/i), 'John Doe');
         await user.type(screen.getByLabelText(/email/i), 'john@example.com');
         await user.type(screen.getByLabelText(/message/i), 'Test message');

         const submitButton = screen.getByRole('button', { name: /submit/i });
         await user.click(submitButton);

         // Button should be disabled during submission
         expect(submitButton).toBeDisabled();
         expect(screen.getByText(/submitting/i)).toBeInTheDocument();
       });

       it('handles submission errors', async () => {
         const user = userEvent.setup();
         const mockOnSubmit = vi.fn().mockRejectedValue(new Error('Server error'));

         render(<ContactForm onSubmit={mockOnSubmit} />);

         // Fill out and submit form
         await user.type(screen.getByLabelText(/name/i), 'John Doe');
         await user.type(screen.getByLabelText(/email/i), 'john@example.com');
         await user.type(screen.getByLabelText(/message/i), 'Test message');
         await user.click(screen.getByRole('button', { name: /submit/i }));

         // Should show error message
         await waitFor(() => {
           expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
         });

         // Form should be re-enabled
         expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
       });
     });
     \`\`\`

5. **Testing Custom Hooks**
   - Use renderHook for testing custom hooks in isolation
   - Test hook state changes and side effects
   - Mock dependencies and external APIs
   - Example hook testing:
     \`\`\`tsx
     import { renderHook, act, waitFor } from '@testing-library/react';
     import { rest } from 'msw';
     import { setupServer } from 'msw/node';
     import { useUserData } from './useUserData';

     const server = setupServer(
       rest.get('/api/users/:id', (req, res, ctx) => {
         return res(ctx.json({
           id: req.params.id,
           name: 'John Doe',
           email: 'john@example.com'
         }));
       })
     );

     beforeAll(() => server.listen());
     afterEach(() => server.resetHandlers());
     afterAll(() => server.close());

     describe('useUserData', () => {
       it('loads user data successfully', async () => {
         const { result } = renderHook(() => useUserData('1'));

         // Initially loading
         expect(result.current.loading).toBe(true);
         expect(result.current.user).toBeNull();
         expect(result.current.error).toBeNull();

         // Wait for data to load
         await waitFor(() => {
           expect(result.current.loading).toBe(false);
         });

         expect(result.current.user).toEqual({
           id: '1',
           name: 'John Doe',
           email: 'john@example.com'
         });
         expect(result.current.error).toBeNull();
       });

       it('handles loading errors', async () => {
         server.use(
           rest.get('/api/users/:id', (req, res, ctx) => {
             return res(ctx.status(500));
           })
         );

         const { result } = renderHook(() => useUserData('1'));

         await waitFor(() => {
           expect(result.current.loading).toBe(false);
         });

         expect(result.current.user).toBeNull();
         expect(result.current.error).toBe('Failed to load user');
       });

       it('refetches data when userId changes', async () => {
         const { result, rerender } = renderHook(
           ({ userId }) => useUserData(userId),
           { initialProps: { userId: '1' } }
         );

         // Wait for initial load
         await waitFor(() => {
           expect(result.current.user?.id).toBe('1');
         });

         // Setup different response for user 2
         server.use(
           rest.get('/api/users/2', (req, res, ctx) => {
             return res(ctx.json({
               id: '2',
               name: 'Jane Doe',
               email: 'jane@example.com'
             }));
           })
         );

         // Change userId
         rerender({ userId: '2' });

         await waitFor(() => {
           expect(result.current.user?.id).toBe('2');
         });

         expect(result.current.user?.name).toBe('Jane Doe');
       });

       it('allows manual refresh', async () => {
         const fetchSpy = vi.fn();
         server.use(
           rest.get('/api/users/:id', (req, res, ctx) => {
             fetchSpy();
             return res(ctx.json({
               id: req.params.id,
               name: 'John Doe',
               email: 'john@example.com'
             }));
           })
         );

         const { result } = renderHook(() => useUserData('1'));

         await waitFor(() => {
           expect(result.current.loading).toBe(false);
         });

         expect(fetchSpy).toHaveBeenCalledTimes(1);

         // Trigger refresh
         act(() => {
           result.current.refresh();
         });

         await waitFor(() => {
           expect(fetchSpy).toHaveBeenCalledTimes(2);
         });
       });
     });

     // Testing hooks with context
     import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

     describe('useUserData with React Query', () => {
       it('uses React Query context', async () => {
         const queryClient = new QueryClient({
           defaultOptions: {
             queries: { retry: false },
           },
         });

         const wrapper = ({ children }: { children: React.ReactNode }) => (
           <QueryClientProvider client={queryClient}>
             {children}
           </QueryClientProvider>
         );

         const { result } = renderHook(() => useUserData('1'), { wrapper });

         await waitFor(() => {
           expect(result.current.isLoading).toBe(false);
         });

         expect(result.current.data).toBeDefined();
       });
     });
     \`\`\`

---

## Integration Testing

6. **Testing Component Integration**
   - Test how components work together
   - Mock external dependencies and APIs
   - Test user workflows end-to-end
   - Example integration tests:
     \`\`\`tsx
     import { render, screen, waitFor } from '@testing-library/react';
     import userEvent from '@testing-library/user-event';
     import { BrowserRouter } from 'react-router-dom';
     import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
     import { rest } from 'msw';
     import { setupServer } from 'msw/node';
     import App from './App';

     const server = setupServer(
       rest.get('/api/products', (req, res, ctx) => {
         return res(ctx.json([
           { id: '1', name: 'Laptop', price: 999.99, category: 'electronics' },
           { id: '2', name: 'Book', price: 19.99, category: 'books' }
         ]));
       }),
       rest.post('/api/cart/items', (req, res, ctx) => {
         return res(ctx.json({ success: true }));
       })
     );

     beforeAll(() => server.listen());
     afterEach(() => server.resetHandlers());
     afterAll(() => server.close());

     const renderWithProviders = (ui: React.ReactElement) => {
       const queryClient = new QueryClient({
         defaultOptions: {
           queries: { retry: false },
           mutations: { retry: false },
         },
       });

       return render(
         <QueryClientProvider client={queryClient}>
           <BrowserRouter>
             {ui}
           </BrowserRouter>
         </QueryClientProvider>
       );
     };

     describe('Shopping workflow', () => {
       it('allows user to browse products and add to cart', async () => {
         const user = userEvent.setup();

         renderWithProviders(<App />);

         // Navigate to products page
         const productsLink = await screen.findByRole('link', { name: /products/i });
         await user.click(productsLink);

         // Wait for products to load
         await waitFor(() => {
           expect(screen.getByText('Laptop')).toBeInTheDocument();
           expect(screen.getByText('Book')).toBeInTheDocument();
         });

         // Add laptop to cart
         const laptopAddButton = screen.getByRole('button', {
           name: /add laptop to cart/i
         });
         await user.click(laptopAddButton);

         // Check for success feedback
         await waitFor(() => {
           expect(screen.getByText(/added to cart/i)).toBeInTheDocument();
         });

         // Verify cart counter updated
         const cartCounter = screen.getByText(/cart.*1/i);
         expect(cartCounter).toBeInTheDocument();
       });

       it('handles network errors gracefully', async () => {
         // Simulate network error
         server.use(
           rest.get('/api/products', (req, res, ctx) => {
             return res(ctx.status(500));
           })
         );

         renderWithProviders(<App />);

         const productsLink = await screen.findByRole('link', { name: /products/i });
         await user.click(productsLink);

         await waitFor(() => {
           expect(screen.getByText(/failed to load products/i)).toBeInTheDocument();
         });

         // Should have retry button
         const retryButton = screen.getByRole('button', { name: /retry/i });
         expect(retryButton).toBeInTheDocument();
       });

       it('filters products by category', async () => {
         const user = userEvent.setup();

         renderWithProviders(<App />);

         const productsLink = await screen.findByRole('link', { name: /products/i });
         await user.click(productsLink);

         // Wait for products to load
         await waitFor(() => {
           expect(screen.getByText('Laptop')).toBeInTheDocument();
           expect(screen.getByText('Book')).toBeInTheDocument();
         });

         // Filter by electronics category
         const electronicsFilter = screen.getByRole('button', { name: /electronics/i });
         await user.click(electronicsFilter);

         // Should only show laptop
         expect(screen.getByText('Laptop')).toBeInTheDocument();
         expect(screen.queryByText('Book')).not.toBeInTheDocument();

         // Clear filter
         const allFilter = screen.getByRole('button', { name: /all/i });
         await user.click(allFilter);

         // Should show all products again
         expect(screen.getByText('Laptop')).toBeInTheDocument();
         expect(screen.getByText('Book')).toBeInTheDocument();
       });
     });
     \`\`\`

7. **Mocking Strategies**
   - Use MSW for API mocking
   - Mock third-party libraries appropriately
   - Create reusable mock factories
   - Example mocking patterns:
     \`\`\`tsx
     // __mocks__/handlers.ts
     import { rest } from 'msw';

     export const handlers = [
       rest.get('/api/users', (req, res, ctx) => {
         const page = req.url.searchParams.get('page') || '1';
         const limit = req.url.searchParams.get('limit') || '10';

         const users = Array.from({ length: parseInt(limit) }, (_, i) => ({
           id: \`\${(parseInt(page) - 1) * parseInt(limit) + i + 1}\`,
           name: \`User \${i + 1}\`,
           email: \`user\${i + 1}@example.com\`
         }));

         return res(ctx.json({
           users,
           total: 100,
           page: parseInt(page),
           totalPages: Math.ceil(100 / parseInt(limit))
         }));
       }),

       rest.post('/api/users', (req, res, ctx) => {
         return res(ctx.json({
           id: '123',
           ...req.body,
           createdAt: new Date().toISOString()
         }));
       }),

       rest.get('/api/users/:id', (req, res, ctx) => {
         const { id } = req.params;
         return res(ctx.json({
           id,
           name: \`User \${id}\`,
           email: \`user\${id}@example.com\`
         }));
       })
     ];

     // __mocks__/factories.ts
     export const createMockUser = (overrides = {}) => ({
       id: '1',
       name: 'John Doe',
       email: 'john@example.com',
       createdAt: '2023-01-01T00:00:00Z',
       ...overrides
     });

     export const createMockProduct = (overrides = {}) => ({
       id: '1',
       name: 'Test Product',
       price: 29.99,
       description: 'A test product',
       inStock: true,
       category: 'test',
       ...overrides
     });

     // Custom render with common providers
     // __tests__/test-utils.tsx
     import { render, RenderOptions } from '@testing-library/react';
     import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
     import { BrowserRouter } from 'react-router-dom';
     import { AuthProvider } from '../contexts/AuthContext';

     interface CustomRenderOptions extends RenderOptions {
       initialEntries?: string[];
       user?: any;
     }

     export const renderWithProviders = (
       ui: React.ReactElement,
       {
         initialEntries = ['/'],
         user = null,
         ...renderOptions
       }: CustomRenderOptions = {}
     ) => {
       const queryClient = new QueryClient({
         defaultOptions: {
           queries: { retry: false },
           mutations: { retry: false },
         },
       });

       const Wrapper = ({ children }: { children: React.ReactNode }) => (
         <QueryClientProvider client={queryClient}>
           <BrowserRouter>
             <AuthProvider initialUser={user}>
               {children}
             </AuthProvider>
           </BrowserRouter>
         </QueryClientProvider>
       );

       return {
         ...render(ui, { wrapper: Wrapper, ...renderOptions }),
         queryClient
       };
     };

     // Re-export everything
     export * from '@testing-library/react';
     export { renderWithProviders as render };
     \`\`\`

---

## Advanced Testing Patterns

8. **Testing Error Boundaries**
   - Test error boundary behavior
   - Verify error reporting and fallback UI
   - Test error recovery mechanisms
   - Example error boundary testing:
     \`\`\`tsx
     import { render, screen } from '@testing-library/react';
     import ErrorBoundary from './ErrorBoundary';

     const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
       if (shouldThrow) {
         throw new Error('Test error');
       }
       return <div>No error</div>;
     };

     describe('ErrorBoundary', () => {
       // Suppress console.error for these tests
       const originalError = console.error;
       beforeAll(() => {
         console.error = vi.fn();
       });
       afterAll(() => {
         console.error = originalError;
       });

       it('renders children when there is no error', () => {
         render(
           <ErrorBoundary>
             <ThrowError shouldThrow={false} />
           </ErrorBoundary>
         );

         expect(screen.getByText('No error')).toBeInTheDocument();
       });

       it('renders error UI when there is an error', () => {
         const mockOnError = vi.fn();

         render(
           <ErrorBoundary onError={mockOnError}>
             <ThrowError shouldThrow={true} />
           </ErrorBoundary>
         );

         expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
         expect(mockOnError).toHaveBeenCalledWith(
           expect.any(Error),
           expect.objectContaining({
             componentStack: expect.any(String)
           })
         );
       });

       it('allows error recovery', async () => {
         const user = userEvent.setup();
         const { rerender } = render(
           <ErrorBoundary>
             <ThrowError shouldThrow={true} />
           </ErrorBoundary>
         );

         expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

         const retryButton = screen.getByRole('button', { name: /try again/i });
         await user.click(retryButton);

         // Re-render with no error
         rerender(
           <ErrorBoundary>
             <ThrowError shouldThrow={false} />
           </ErrorBoundary>
         );

         expect(screen.getByText('No error')).toBeInTheDocument();
       });
     });
     \`\`\`

9. **Performance Testing**
   - Test component rendering performance
   - Verify memoization and optimization
   - Test for unnecessary re-renders
   - Example performance testing:
     \`\`\`tsx
     import { render, act } from '@testing-library/react';
     import { vi } from 'vitest';
     import OptimizedList from './OptimizedList';

     describe('OptimizedList performance', () => {
       it('does not re-render child components unnecessarily', () => {
         const renderSpy = vi.fn();

         const ListItem = ({ item }: { item: any }) => {
           renderSpy();
           return <div>{item.name}</div>;
         };

         const items = [
           { id: 1, name: 'Item 1' },
           { id: 2, name: 'Item 2' },
           { id: 3, name: 'Item 3' }
         ];

         const { rerender } = render(
           <OptimizedList items={items} renderItem={ListItem} />
         );

         expect(renderSpy).toHaveBeenCalledTimes(3);

         // Add new item - only new item should render
         const newItems = [...items, { id: 4, name: 'Item 4' }];
         rerender(<OptimizedList items={newItems} renderItem={ListItem} />);

         expect(renderSpy).toHaveBeenCalledTimes(4); // Only one additional call
       });

       it('memoizes expensive calculations', () => {
         const expensiveCalculation = vi.fn(() => 'calculated value');

         const ExpensiveComponent = ({ data }: { data: any }) => {
           const result = useMemo(() => expensiveCalculation(data), [data]);
           return <div>{result}</div>;
         };

         const { rerender } = render(<ExpensiveComponent data="test" />);

         expect(expensiveCalculation).toHaveBeenCalledTimes(1);

         // Re-render with same data - should not recalculate
         rerender(<ExpensiveComponent data="test" />);

         expect(expensiveCalculation).toHaveBeenCalledTimes(1);

         // Re-render with different data - should recalculate
         rerender(<ExpensiveComponent data="new-test" />);

         expect(expensiveCalculation).toHaveBeenCalledTimes(2);
       });
     });
     \`\`\`

---

## Test Organization and Setup

10. **Test Configuration**
    - Set up proper test environment
    - Configure test utilities and helpers
    - Implement proper test cleanup
    - Example test setup:
      \`\`\`typescript
      // vitest.config.ts
      import { defineConfig } from 'vitest/config';
      import react from '@vitejs/plugin-react';

      export default defineConfig({
        plugins: [react()],
        test: {
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
          globals: true,
          css: true,
        },
      });

      // src/test/setup.ts
      import '@testing-library/jest-dom';
      import { cleanup } from '@testing-library/react';
      import { afterEach, beforeAll, afterAll } from 'vitest';
      import { server } from './mocks/server';

      // Start mock service worker
      beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
      afterEach(() => {
        server.resetHandlers();
        cleanup();
      });
      afterAll(() => server.close());

      // src/test/mocks/server.ts
      import { setupServer } from 'msw/node';
      import { handlers } from './handlers';

      export const server = setupServer(...handlers);

      // package.json scripts
      {
        "scripts": {
          "test": "vitest",
          "test:ui": "vitest --ui",
          "test:coverage": "vitest --coverage",
          "test:watch": "vitest --watch"
        }
      }
      \`\`\`

11. **Test Best Practices Checklist**
    - Organize tests logically and consistently
    - Use descriptive test names and structure
    - Keep tests focused and independent
    - Example test organization:
      \`\`\`typescript
      describe('UserProfileComponent', () => {
        // Setup and shared state
        const mockUser = createMockUser();

        beforeEach(() => {
          // Common setup for all tests
        });

        describe('rendering', () => {
          it('displays user information correctly', () => {
            // Test rendering behavior
          });

          it('shows loading state initially', () => {
            // Test loading state
          });

          it('handles missing user data gracefully', () => {
            // Test edge cases
          });
        });

        describe('user interactions', () => {
          it('allows editing profile when edit button is clicked', async () => {
            // Test user interactions
          });

          it('cancels edit mode when cancel is clicked', async () => {
            // Test interaction flows
          });
        });

        describe('error handling', () => {
          it('displays error message when update fails', async () => {
            // Test error scenarios
          });

          it('allows retrying failed operations', async () => {
            // Test error recovery
          });
        });
      });
      \`\`\`

---

## Summary Checklist

- [ ] Test user behavior, not implementation details
- [ ] Use semantic queries that mirror user interactions
- [ ] Write tests that promote accessible markup
- [ ] Handle async operations with waitFor and findBy queries
- [ ] Test form validation, submission, and error handling
- [ ] Use MSW for realistic API mocking
- [ ] Test custom hooks in isolation with renderHook
- [ ] Write integration tests for user workflows
- [ ] Test error boundaries and error recovery
- [ ] Verify performance optimizations work correctly
- [ ] Set up proper test environment and utilities
- [ ] Organize tests logically with clear descriptions
- [ ] Keep tests focused, independent, and maintainable
- [ ] Mock external dependencies appropriately
- [ ] Test loading states, error states, and edge cases

---

Follow these practices to write comprehensive, maintainable tests that give confidence in your React applications and promote better accessibility and user experience.`,
	categories: ["testing", "react", "javascript"],
	tags: ["react-testing-library", "jest", "user-testing"],
	author: "Community",
	createdAt: "2024-01-15T00:00:00Z",
	applicationMode: "files",
	globs: "*.test.ts,*.test.tsx,*.spec.ts,*.spec.tsx",
};
