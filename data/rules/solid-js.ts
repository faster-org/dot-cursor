import { Rule } from "../types";

export const rule: Rule = {
	id: "solid-js",
	slug: "solid-js",
	title: "SolidJS Reactive Framework",
	description:
		"Fine-grained reactivity with SolidJS, signals, stores, and performance optimization",
	content: `# SolidJS Best Practices

Comprehensive guide for building high-performance web applications with SolidJS, featuring fine-grained reactivity, signals, and optimized rendering.

---

## Core SolidJS Principles

1. **Fine-Grained Reactivity**
   - Understand SolidJS's compile-time optimizations
   - Use signals for reactive state management
   - Leverage automatic dependency tracking
   - Example signal patterns:
     \`\`\`tsx
     import { createSignal, createEffect, createMemo } from 'solid-js';

     function Counter() {
       const [count, setCount] = createSignal(0);
       const [multiplier, setMultiplier] = createSignal(2);

       // Derived state with automatic dependency tracking
       const doubledCount = createMemo(() => count() * multiplier());

       // Effects run when dependencies change
       createEffect(() => {
         console.log(\`Count is now: \${count()}\`);
       });

       // Effect with explicit dependencies
       createEffect(() => {
         if (count() > 10) {
           console.log('Count is getting high!');
         }
       });

       return (
         <div>
           <p>Count: {count()}</p>
           <p>Doubled: {doubledCount()}</p>
           <p>Multiplier: {multiplier()}</p>

           <button onClick={() => setCount(c => c + 1)}>
             Increment
           </button>
           <button onClick={() => setMultiplier(m => m + 1)}>
             Increase Multiplier
           </button>
           <button onClick={() => setCount(0)}>
             Reset
           </button>
         </div>
       );
     }
     \`\`\`

2. **Component Architecture**
   - Write functional components with reactive primitives
   - Use props destructuring with proper reactivity
   - Implement proper component composition
   - Example component patterns:
     \`\`\`tsx
     import { Component, JSX, splitProps, mergeProps } from 'solid-js';
     import { createSignal, createMemo } from 'solid-js';

     interface UserCardProps {
       user: {
         id: string;
         name: string;
         email: string;
         avatar?: string;
       };
       selected?: boolean;
       onSelect?: (userId: string) => void;
       onEdit?: (userId: string) => void;
       class?: string;
     }

     const UserCard: Component<UserCardProps> = (props) => {
       // Split props to handle reactivity correctly
       const [local, others] = splitProps(props, ['user', 'selected', 'onSelect', 'onEdit']);

       // Merge with default props
       const merged = mergeProps({ selected: false }, props);

       // Derived state
       const displayName = createMemo(() =>
         local.user.name || local.user.email.split('@')[0]
       );

       const avatarUrl = createMemo(() =>
         local.user.avatar || \`https://avatar.vercel.sh/\${local.user.id}\`
       );

       const handleSelect = () => {
         local.onSelect?.(local.user.id);
       };

       const handleEdit = () => {
         local.onEdit?.(local.user.id);
       };

       return (
         <div
           class={\`user-card \${merged.selected ? 'selected' : ''} \${others.class || ''}\`}
           classList={{
             'user-card': true,
             'selected': merged.selected,
             'has-avatar': !!local.user.avatar
           }}
         >
           <img
             src={avatarUrl()}
             alt={\`\${displayName()} avatar\`}
             class="avatar"
           />

           <div class="user-info">
             <h3 class="name">{displayName()}</h3>
             <p class="email">{local.user.email}</p>
           </div>

           <div class="actions">
             <button
               onClick={handleSelect}
               class="select-btn"
               type="button"
             >
               {merged.selected ? 'Deselect' : 'Select'}
             </button>
             <button
               onClick={handleEdit}
               class="edit-btn"
               type="button"
             >
               Edit
             </button>
           </div>
         </div>
       );
     };

     export default UserCard;
     \`\`\`

3. **Control Flow and Conditional Rendering**
   - Use SolidJS control flow components for optimal performance
   - Implement proper conditional rendering patterns
   - Handle lists with For component and proper keying
   - Example control flow patterns:
     \`\`\`tsx
     import { Component, createSignal, For, Show, Switch, Match } from 'solid-js';

     interface User {
       id: string;
       name: string;
       status: 'online' | 'offline' | 'away';
       role: 'admin' | 'user' | 'guest';
     }

     const UserList: Component = () => {
       const [users, setUsers] = createSignal<User[]>([]);
       const [loading, setLoading] = createSignal(true);
       const [error, setError] = createSignal<string | null>(null);
       const [filter, setFilter] = createSignal<'all' | 'online' | 'offline'>('all');

       // Filtered users with reactive computation
       const filteredUsers = createMemo(() => {
         const allUsers = users();
         const currentFilter = filter();

         if (currentFilter === 'all') return allUsers;
         return allUsers.filter(user => user.status === currentFilter);
       });

       // Load users effect
       createEffect(async () => {
         try {
           setLoading(true);
           setError(null);
           const response = await fetch('/api/users');
           const userData = await response.json();
           setUsers(userData);
         } catch (err) {
           setError('Failed to load users');
         } finally {
           setLoading(false);
         }
       });

       return (
         <div class="user-list">
           <div class="filters">
             <button
               onClick={() => setFilter('all')}
               classList={{ active: filter() === 'all' }}
             >
               All Users
             </button>
             <button
               onClick={() => setFilter('online')}
               classList={{ active: filter() === 'online' }}
             >
               Online
             </button>
             <button
               onClick={() => setFilter('offline')}
               classList={{ active: filter() === 'offline' }}
             >
               Offline
             </button>
           </div>

           <Show when={!loading()} fallback={<div class="loading">Loading users...</div>}>
             <Show when={!error()} fallback={<div class="error">{error()}</div>}>
               <Show
                 when={filteredUsers().length > 0}
                 fallback={<div class="empty">No users found</div>}
               >
                 <div class="user-grid">
                   <For each={filteredUsers()}>
                     {(user) => (
                       <div class="user-item">
                         <div class="user-avatar">
                           {user.name.charAt(0).toUpperCase()}
                         </div>
                         <div class="user-details">
                           <h4>{user.name}</h4>
                           <Switch>
                             <Match when={user.status === 'online'}>
                               <span class="status online">Online</span>
                             </Match>
                             <Match when={user.status === 'away'}>
                               <span class="status away">Away</span>
                             </Match>
                             <Match when={user.status === 'offline'}>
                               <span class="status offline">Offline</span>
                             </Match>
                           </Switch>
                           <Switch>
                             <Match when={user.role === 'admin'}>
                               <span class="role admin">Administrator</span>
                             </Match>
                             <Match when={user.role === 'user'}>
                               <span class="role user">User</span>
                             </Match>
                             <Match when={user.role === 'guest'}>
                               <span class="role guest">Guest</span>
                             </Match>
                           </Switch>
                         </div>
                       </div>
                     )}
                   </For>
                 </div>
               </Show>
             </Show>
           </Show>
         </div>
       );
     };
     \`\`\`

---

## State Management with Stores

4. **Creating and Using Stores**
   - Implement global state with stores
   - Use context for dependency injection
   - Create reactive store patterns
   - Example store implementation:
     \`\`\`tsx
     // stores/auth.tsx
     import { createSignal, createContext, useContext, JSX, Component } from 'solid-js';
     import { createStore, produce } from 'solid-js/store';

     interface User {
       id: string;
       name: string;
       email: string;
       role: 'admin' | 'user';
     }

     interface AuthState {
       user: User | null;
       loading: boolean;
       error: string | null;
     }

     interface AuthContextValue {
       state: AuthState;
       login: (email: string, password: string) => Promise<void>;
       logout: () => void;
       register: (userData: RegisterData) => Promise<void>;
       clearError: () => void;
     }

     const AuthContext = createContext<AuthContextValue>();

     export const AuthProvider: Component<{ children: JSX.Element }> = (props) => {
       const [state, setState] = createStore<AuthState>({
         user: null,
         loading: false,
         error: null
       });

       const login = async (email: string, password: string) => {
         setState('loading', true);
         setState('error', null);

         try {
           const response = await fetch('/api/auth/login', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ email, password })
           });

           if (!response.ok) {
             throw new Error('Login failed');
           }

           const { user, token } = await response.json();

           // Store token
           localStorage.setItem('authToken', token);

           setState('user', user);
         } catch (error) {
           setState('error', error.message);
         } finally {
           setState('loading', false);
         }
       };

       const logout = () => {
         localStorage.removeItem('authToken');
         setState(produce(s => {
           s.user = null;
           s.error = null;
         }));
       };

       const register = async (userData: RegisterData) => {
         setState('loading', true);
         setState('error', null);

         try {
           const response = await fetch('/api/auth/register', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(userData)
           });

           if (!response.ok) {
             const errorData = await response.json();
             throw new Error(errorData.message);
           }

           const { user, token } = await response.json();

           localStorage.setItem('authToken', token);
           setState('user', user);
         } catch (error) {
           setState('error', error.message);
         } finally {
           setState('loading', false);
         }
       };

       const clearError = () => {
         setState('error', null);
       };

       // Check for existing token on mount
       const token = localStorage.getItem('authToken');
       if (token) {
         // Verify token and get user data
         fetch('/api/auth/me', {
           headers: { Authorization: \`Bearer \${token}\` }
         })
         .then(response => {
           if (response.ok) {
             return response.json();
           } else {
             localStorage.removeItem('authToken');
           }
         })
         .then(user => {
           if (user) setState('user', user);
         })
         .catch(() => {
           localStorage.removeItem('authToken');
         });
       }

       const contextValue: AuthContextValue = {
         state,
         login,
         logout,
         register,
         clearError
       };

       return (
         <AuthContext.Provider value={contextValue}>
           {props.children}
         </AuthContext.Provider>
       );
     };

     export const useAuth = () => {
       const context = useContext(AuthContext);
       if (!context) {
         throw new Error('useAuth must be used within AuthProvider');
       }
       return context;
     };

     // Usage in components
     const LoginForm: Component = () => {
       const auth = useAuth();
       const [email, setEmail] = createSignal('');
       const [password, setPassword] = createSignal('');

       const handleSubmit = (e: Event) => {
         e.preventDefault();
         auth.login(email(), password());
       };

       return (
         <form onSubmit={handleSubmit}>
           <Show when={auth.state.error}>
             <div class="error">{auth.state.error}</div>
           </Show>

           <input
             type="email"
             placeholder="Email"
             value={email()}
             onInput={(e) => setEmail(e.currentTarget.value)}
             required
           />

           <input
             type="password"
             placeholder="Password"
             value={password()}
             onInput={(e) => setPassword(e.currentTarget.value)}
             required
           />

           <button type="submit" disabled={auth.state.loading}>
             {auth.state.loading ? 'Logging in...' : 'Login'}
           </button>
         </form>
       );
     };
     \`\`\`

5. **Resource Pattern for Data Fetching**
   - Use createResource for async data fetching
   - Implement proper loading and error states
   - Handle data refetching and caching
   - Example resource patterns:
     \`\`\`tsx
     import { createResource, createSignal, For, Show, Suspense } from 'solid-js';

     interface Post {
       id: string;
       title: string;
       content: string;
       authorId: string;
       createdAt: string;
     }

     interface PostsParams {
       page: number;
       category?: string;
       search?: string;
     }

     const PostList: Component = () => {
       const [params, setParams] = createSignal<PostsParams>({ page: 1 });

       // Resource for fetching posts
       const [posts, { mutate, refetch }] = createResource(
         params,
         async (params): Promise<{ posts: Post[]; totalPages: number }> => {
           const searchParams = new URLSearchParams({
             page: params.page.toString(),
             ...(params.category && { category: params.category }),
             ...(params.search && { search: params.search })
           });

           const response = await fetch(\`/api/posts?\${searchParams}\`);
           if (!response.ok) {
             throw new Error('Failed to fetch posts');
           }

           return response.json();
         }
       );

       // Resource for fetching categories
       const [categories] = createResource(async (): Promise<string[]> => {
         const response = await fetch('/api/categories');
         if (!response.ok) {
           throw new Error('Failed to fetch categories');
         }
         return response.json();
       });

       const handleCategoryChange = (category: string) => {
         setParams(prev => ({ ...prev, category: category || undefined, page: 1 }));
       };

       const handleSearch = (search: string) => {
         setParams(prev => ({ ...prev, search: search || undefined, page: 1 }));
       };

       const handlePageChange = (page: number) => {
         setParams(prev => ({ ...prev, page }));
       };

       const addOptimisticPost = (newPost: Post) => {
         mutate(prev => ({
           posts: [newPost, ...(prev?.posts || [])],
           totalPages: prev?.totalPages || 1
         }));
       };

       return (
         <div class="post-list">
           <div class="filters">
             <Suspense fallback={<div>Loading categories...</div>}>
               <select onChange={(e) => handleCategoryChange(e.currentTarget.value)}>
                 <option value="">All Categories</option>
                 <For each={categories()}>
                   {(category) => <option value={category}>{category}</option>}
                 </For>
               </select>
             </Suspense>

             <input
               type="search"
               placeholder="Search posts..."
               onInput={(e) => handleSearch(e.currentTarget.value)}
             />

             <button onClick={() => refetch()}>
               Refresh
             </button>
           </div>

           <Suspense fallback={<div class="loading">Loading posts...</div>}>
             <Show
               when={posts()}
               fallback={<div class="error">Failed to load posts</div>}
             >
               {(postsData) => (
                 <>
                   <Show
                     when={postsData().posts.length > 0}
                     fallback={<div class="empty">No posts found</div>}
                   >
                     <div class="posts">
                       <For each={postsData().posts}>
                         {(post) => (
                           <article class="post-card">
                             <h2>{post.title}</h2>
                             <p>{post.content.substring(0, 150)}...</p>
                             <time>{new Date(post.createdAt).toLocaleDateString()}</time>
                           </article>
                         )}
                       </For>
                     </div>

                     <Show when={postsData().totalPages > 1}>
                       <div class="pagination">
                         <For each={Array.from({ length: postsData().totalPages }, (_, i) => i + 1)}>
                           {(page) => (
                             <button
                               onClick={() => handlePageChange(page)}
                               classList={{
                                 active: page === params().page
                               }}
                             >
                               {page}
                             </button>
                           )}
                         </For>
                       </div>
                     </Show>
                   </Show>
                 </>
               )}
             </Show>
           </Suspense>
         </div>
       );
     };
     \`\`\`

---

## Routing and Navigation

6. **Client-Side Routing with Solid Router**
   - Set up routing with @solidjs/router
   - Implement nested routes and layouts
   - Handle route parameters and query strings
   - Example routing setup:
     \`\`\`tsx
     // App.tsx
     import { Router, Routes, Route } from '@solidjs/router';
     import { lazy } from 'solid-js';

     // Lazy load components
     const Home = lazy(() => import('./pages/Home'));
     const About = lazy(() => import('./pages/About'));
     const Blog = lazy(() => import('./pages/Blog'));
     const BlogPost = lazy(() => import('./pages/BlogPost'));
     const Dashboard = lazy(() => import('./pages/Dashboard'));
     const Profile = lazy(() => import('./pages/Profile'));

     function App() {
       return (
         <Router>
           <Routes>
             <Route path="/" component={Home} />
             <Route path="/about" component={About} />
             <Route path="/blog" component={Blog} />
             <Route path="/blog/:slug" component={BlogPost} />
             <Route path="/dashboard" component={Dashboard}>
               <Route path="/profile" component={Profile} />
               <Route path="/settings" component={Settings} />
             </Route>
             <Route path="*" component={NotFound} />
           </Routes>
         </Router>
       );
     }

     // pages/BlogPost.tsx
     import { useParams, useSearchParams, useNavigate } from '@solidjs/router';
     import { createResource, Show, createEffect } from 'solid-js';

     const BlogPost: Component = () => {
       const params = useParams();
       const [searchParams, setSearchParams] = useSearchParams();
       const navigate = useNavigate();

       // Resource that depends on route params
       const [post] = createResource(
         () => params.slug,
         async (slug: string) => {
           const response = await fetch(\`/api/posts/\${slug}\`);
           if (!response.ok) {
             throw new Error('Post not found');
           }
           return response.json();
         }
       );

       // Handle query parameters
       const commentId = () => searchParams.comment;

       createEffect(() => {
         if (commentId()) {
           // Scroll to comment
           const element = document.getElementById(\`comment-\${commentId()}\`);
           if (element) {
             element.scrollIntoView({ behavior: 'smooth' });
           }
         }
       });

       const handleShare = () => {
         const url = window.location.href;
         navigator.clipboard.writeText(url);
       };

       const goBack = () => {
         navigate('/blog');
       };

       return (
         <div class="blog-post">
           <button onClick={goBack} class="back-btn">
             ← Back to Blog
           </button>

           <Show when={post()} fallback={<div>Loading post...</div>}>
             {(postData) => (
               <>
                 <article>
                   <header>
                     <h1>{postData().title}</h1>
                     <div class="meta">
                       <time>{new Date(postData().createdAt).toLocaleDateString()}</time>
                       <button onClick={handleShare}>Share</button>
                     </div>
                   </header>

                   <div class="content">
                     {postData().content}
                   </div>
                 </article>

                 <section class="comments">
                   <h3>Comments</h3>
                   <For each={postData().comments}>
                     {(comment) => (
                       <div
                         id={\`comment-\${comment.id}\`}
                         class="comment"
                         classList={{ highlighted: comment.id === commentId() }}
                       >
                         <div class="comment-author">{comment.author}</div>
                         <div class="comment-content">{comment.content}</div>
                       </div>
                     )}
                   </For>
                 </section>
               </>
             )}
           </Show>
         </div>
       );
     };
     \`\`\`

---

## Performance Optimization

7. **Compilation and Bundle Optimization**
   - Leverage SolidJS's compile-time optimizations
   - Use lazy loading for code splitting
   - Implement proper bundling strategies
   - Example optimization techniques:
     \`\`\`tsx
     // Lazy loading with Suspense
     import { lazy, Suspense } from 'solid-js';

     const HeavyComponent = lazy(() => import('./HeavyComponent'));
     const Chart = lazy(() => import('./Chart'));

     const Dashboard: Component = () => {
       const [activeTab, setActiveTab] = createSignal<'overview' | 'analytics'>('overview');

       return (
         <div class="dashboard">
           <nav class="tabs">
             <button
               onClick={() => setActiveTab('overview')}
               classList={{ active: activeTab() === 'overview' }}
             >
               Overview
             </button>
             <button
               onClick={() => setActiveTab('analytics')}
               classList={{ active: activeTab() === 'analytics' }}
             >
               Analytics
             </button>
           </nav>

           <div class="tab-content">
             <Show when={activeTab() === 'overview'}>
               <Suspense fallback={<div>Loading overview...</div>}>
                 <HeavyComponent />
               </Suspense>
             </Show>

             <Show when={activeTab() === 'analytics'}>
               <Suspense fallback={<div>Loading analytics...</div>}>
                 <Chart />
               </Suspense>
             </Show>
           </div>
         </div>
       );
     };

     // Memoization for expensive computations
     import { createMemo } from 'solid-js';

     const ExpensiveComponent: Component<{ data: number[] }> = (props) => {
       const processedData = createMemo(() => {
         console.log('Processing data...'); // Only runs when data changes
         return props.data
           .filter(x => x > 0)
           .map(x => x * 2)
           .sort((a, b) => b - a);
       });

       const statistics = createMemo(() => {
         const data = processedData();
         return {
           sum: data.reduce((acc, val) => acc + val, 0),
           average: data.length > 0 ? data.reduce((acc, val) => acc + val, 0) / data.length : 0,
           max: Math.max(...data),
           min: Math.min(...data)
         };
       });

       return (
         <div class="expensive-component">
           <div class="stats">
             <div>Sum: {statistics().sum}</div>
             <div>Average: {statistics().average.toFixed(2)}</div>
             <div>Max: {statistics().max}</div>
             <div>Min: {statistics().min}</div>
           </div>

           <ul class="data-list">
             <For each={processedData()}>
               {(item) => <li>{item}</li>}
             </For>
           </ul>
         </div>
       );
     };
     \`\`\`

8. **Memory Management and Cleanup**
   - Properly clean up effects and subscriptions
   - Use onCleanup for resource disposal
   - Handle component unmounting gracefully
   - Example cleanup patterns:
     \`\`\`tsx
     import { createSignal, createEffect, onCleanup, onMount } from 'solid-js';

     const TimerComponent: Component = () => {
       const [time, setTime] = createSignal(new Date());
       const [isRunning, setIsRunning] = createSignal(true);

       let intervalId: number;

       onMount(() => {
         // Start timer when component mounts
         intervalId = setInterval(() => {
           if (isRunning()) {
             setTime(new Date());
           }
         }, 1000);
       });

       // Cleanup when component unmounts
       onCleanup(() => {
         if (intervalId) {
           clearInterval(intervalId);
         }
       });

       // Effect with cleanup for event listeners
       createEffect(() => {
         const handleVisibilityChange = () => {
           setIsRunning(!document.hidden);
         };

         document.addEventListener('visibilitychange', handleVisibilityChange);

         onCleanup(() => {
           document.removeEventListener('visibilitychange', handleVisibilityChange);
         });
       });

       return (
         <div class="timer">
           <h2>Current Time</h2>
           <p>{time().toLocaleTimeString()}</p>
           <p>Status: {isRunning() ? 'Running' : 'Paused'}</p>
           <button onClick={() => setIsRunning(!isRunning())}>
             {isRunning() ? 'Pause' : 'Resume'}
           </button>
         </div>
       );
     };

     // WebSocket connection with cleanup
     const useWebSocket = (url: string) => {
       const [socket, setSocket] = createSignal<WebSocket | null>(null);
       const [connected, setConnected] = createSignal(false);
       const [messages, setMessages] = createSignal<string[]>([]);

       createEffect(() => {
         const ws = new WebSocket(url);

         ws.onopen = () => {
           setConnected(true);
           setSocket(ws);
         };

         ws.onclose = () => {
           setConnected(false);
           setSocket(null);
         };

         ws.onmessage = (event) => {
           setMessages(prev => [...prev, event.data]);
         };

         onCleanup(() => {
           ws.close();
         });
       });

       const sendMessage = (message: string) => {
         const ws = socket();
         if (ws && ws.readyState === WebSocket.OPEN) {
           ws.send(message);
         }
       };

       return {
         connected,
         messages,
         sendMessage
       };
     };
     \`\`\`

---

## Testing SolidJS Applications

9. **Component Testing Strategies**
   - Test reactive behavior and signal updates
   - Mock external dependencies and resources
   - Test component props and event handling
   - Example testing setup:
     \`\`\`tsx
     // __tests__/Counter.test.tsx
     import { render, fireEvent, screen } from 'solid-testing-library';
     import { describe, it, expect } from 'vitest';
     import Counter from '../Counter';

     describe('Counter', () => {
       it('renders initial count', () => {
         render(() => <Counter initialCount={5} />);
         expect(screen.getByText('Count: 5')).toBeInTheDocument();
       });

       it('increments count when button is clicked', async () => {
         render(() => <Counter initialCount={0} />);

         const incrementButton = screen.getByText('Increment');
         await fireEvent.click(incrementButton);

         expect(screen.getByText('Count: 1')).toBeInTheDocument();
       });

       it('calls onCountChange when count updates', async () => {
         const mockCallback = vi.fn();
         render(() => <Counter initialCount={0} onCountChange={mockCallback} />);

         const incrementButton = screen.getByText('Increment');
         await fireEvent.click(incrementButton);

         expect(mockCallback).toHaveBeenCalledWith(1);
       });

       it('disables button when maxCount is reached', async () => {
         render(() => <Counter initialCount={9} maxCount={10} />);

         const incrementButton = screen.getByText('Increment');
         await fireEvent.click(incrementButton);

         expect(incrementButton).toBeDisabled();
         expect(screen.getByText('Count: 10')).toBeInTheDocument();
       });
     });

     // __tests__/store.test.ts
     import { createRoot } from 'solid-js';
     import { describe, it, expect, beforeEach } from 'vitest';
     import { createAuthStore } from '../stores/auth';

     describe('Auth Store', () => {
       it('should initialize with empty state', () => {
         createRoot(() => {
           const [state, actions] = createAuthStore();
           expect(state.user).toBeNull();
           expect(state.loading).toBe(false);
           expect(state.error).toBeNull();
         });
       });

       it('should set loading state during login', () => {
         createRoot(async () => {
           const [state, actions] = createAuthStore();

           // Mock fetch
           global.fetch = vi.fn().mockImplementation(() =>
             new Promise(resolve => setTimeout(() => resolve({
               ok: true,
               json: () => Promise.resolve({ user: { id: '1', name: 'John' }, token: 'abc' })
             }), 100))
           );

           const loginPromise = actions.login('test@example.com', 'password');
           expect(state.loading).toBe(true);

           await loginPromise;
           expect(state.loading).toBe(false);
           expect(state.user).toEqual({ id: '1', name: 'John' });
         });
       });
     });

     // __tests__/resources.test.tsx
     import { render, waitFor } from 'solid-testing-library';
     import { describe, it, expect, vi } from 'vitest';
     import PostList from '../PostList';

     describe('PostList Resource', () => {
       it('should load and display posts', async () => {
         const mockPosts = [
           { id: '1', title: 'Post 1', content: 'Content 1' },
           { id: '2', title: 'Post 2', content: 'Content 2' }
         ];

         global.fetch = vi.fn().mockResolvedValue({
           ok: true,
           json: () => Promise.resolve({ posts: mockPosts, totalPages: 1 })
         });

         render(() => <PostList />);

         await waitFor(() => {
           expect(screen.getByText('Post 1')).toBeInTheDocument();
           expect(screen.getByText('Post 2')).toBeInTheDocument();
         });
       });

       it('should handle loading state', () => {
         global.fetch = vi.fn().mockImplementation(() =>
           new Promise(resolve => setTimeout(resolve, 1000))
         );

         render(() => <PostList />);
         expect(screen.getByText('Loading posts...')).toBeInTheDocument();
       });

       it('should handle error state', async () => {
         global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

         render(() => <PostList />);

         await waitFor(() => {
           expect(screen.getByText('Failed to load posts')).toBeInTheDocument();
         });
       });
     });
     \`\`\`

---

## Summary Checklist

- [ ] Use signals for reactive state management
- [ ] Leverage createMemo for derived computations
- [ ] Implement proper component composition with splitProps
- [ ] Use SolidJS control flow components (Show, For, Switch)
- [ ] Create stores for global state management
- [ ] Use createResource for async data fetching
- [ ] Implement client-side routing with Solid Router
- [ ] Use lazy loading for code splitting and performance
- [ ] Properly clean up effects and subscriptions
- [ ] Write comprehensive tests for components and stores
- [ ] Optimize bundle size with tree shaking
- [ ] Handle error boundaries and loading states
- [ ] Use TypeScript for better development experience
- [ ] Implement proper accessibility patterns

---

Follow these practices to build high-performance, reactive web applications with SolidJS's fine-grained reactivity system.`,
	categories: ["solidjs", "frontend", "javascript", "reactive"],
	tags: ["signals", "fine-grained-reactivity", "performance"],
	author: "Community",
	createdAt: "2024-01-15T00:00:00Z",
	applicationMode: "files",
	globs: "*.tsx,*.ts,*.jsx,*.js",
};
