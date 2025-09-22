import { Rule } from "../types";

export const rule: Rule = {
	id: "svelte-kit",
	slug: "svelte-kit",
	title: "SvelteKit Full-Stack Framework",
	description: "Modern web development with SvelteKit, stores, routing, and SSR patterns",
	content: `# SvelteKit Best Practices

Comprehensive guide for building full-stack web applications with SvelteKit, including routing, stores, SSR, and modern development patterns.

---

## Core SvelteKit Principles

1. **File-Based Routing System**
   - Use the file system for automatic route generation
   - Implement layouts for shared UI components
   - Handle dynamic routes with parameter brackets
   - Example routing structure:
     \`\`\`
     src/routes/
       +layout.svelte          // Root layout
       +page.svelte           // Home page (/)
       about/
         +page.svelte         // About page (/about)
       blog/
         +layout.svelte       // Blog layout
         +page.svelte         // Blog list (/blog)
         [slug]/
           +page.svelte       // Blog post (/blog/[slug])
       dashboard/
         (authenticated)/     // Route group
           +layout.svelte     // Auth layout
           profile/
             +page.svelte     // Profile (/dashboard/profile)
           settings/
             +page.svelte     // Settings (/dashboard/settings)
     \`\`\`

2. **Page and Layout Components**
   - Create reusable layouts with slots
   - Implement nested layouts for complex UIs
   - Handle layout-specific styles and logic
   - Example layout implementation:
     \`\`\`svelte
     <!-- src/routes/+layout.svelte -->
     <script lang="ts">
       import { page } from '$app/stores';
       import { onMount } from 'svelte';
       import Navigation from '$lib/components/Navigation.svelte';
       import Footer from '$lib/components/Footer.svelte';
       import { authStore } from '$lib/stores/auth';

       onMount(() => {
         // Initialize app-wide logic
         authStore.checkAuthStatus();
       });

       $: currentPath = $page.url.pathname;
     </script>

     <div class="app">
       <Navigation {currentPath} />

       <main class="main-content">
         <slot />
       </main>

       <Footer />
     </div>

     <style>
       .app {
         min-height: 100vh;
         display: flex;
         flex-direction: column;
       }

       .main-content {
         flex: 1;
         padding: 2rem;
       }
     </style>

     <!-- src/routes/blog/+layout.svelte -->
     <script lang="ts">
       import type { LayoutData } from './$types';

       export let data: LayoutData;
     </script>

     <div class="blog-layout">
       <aside class="sidebar">
         <h3>Categories</h3>
         {#each data.categories as category}
           <a href="/blog/category/{category.slug}">
             {category.name}
           </a>
         {/each}
       </aside>

       <div class="content">
         <slot />
       </div>
     </div>

     <style>
       .blog-layout {
         display: grid;
         grid-template-columns: 250px 1fr;
         gap: 2rem;
         max-width: 1200px;
         margin: 0 auto;
       }

       .sidebar {
         background: #f5f5f5;
         padding: 1rem;
         border-radius: 8px;
       }
     </style>
     \`\`\`

3. **Load Functions for Data Fetching**
   - Use load functions for server-side data fetching
   - Implement client-side data loading when needed
   - Handle loading states and errors gracefully
   - Example load function patterns:
     \`\`\`typescript
     // src/routes/blog/+page.ts
     import type { PageLoad } from './$types';
     import { error } from '@sveltejs/kit';

     export const load: PageLoad = async ({ fetch, url }) => {
       try {
         const page = url.searchParams.get('page') || '1';
         const category = url.searchParams.get('category') || '';

         const response = await fetch(\`/api/posts?page=\${page}&category=\${category}\`);

         if (!response.ok) {
           throw error(response.status, 'Failed to load blog posts');
         }

         const { posts, totalPages, currentPage } = await response.json();

         return {
           posts,
           pagination: {
             currentPage: parseInt(currentPage),
             totalPages,
             hasNextPage: currentPage < totalPages,
             hasPrevPage: currentPage > 1
           }
         };
       } catch (err) {
         throw error(500, 'Failed to load blog posts');
       }
     };

     // src/routes/blog/[slug]/+page.server.ts
     import type { PageServerLoad } from './$types';
     import { error } from '@sveltejs/kit';
     import { db } from '$lib/server/database';

     export const load: PageServerLoad = async ({ params, locals }) => {
       try {
         const post = await db.posts.findBySlug(params.slug);

         if (!post) {
           throw error(404, 'Post not found');
         }

         // Only show drafts to authenticated users
         if (post.status === 'draft' && !locals.user?.isAdmin) {
           throw error(403, 'Access denied');
         }

         const relatedPosts = await db.posts.findRelated(post.id, 3);

         return {
           post,
           relatedPosts
         };
       } catch (err) {
         if (err.status) throw err;
         throw error(500, 'Failed to load post');
       }
     };
     \`\`\`

---

## State Management with Stores

4. **Svelte Stores for Global State**
   - Use writable stores for mutable state
   - Implement derived stores for computed values
   - Create custom stores for complex logic
   - Example store implementations:
     \`\`\`typescript
     // src/lib/stores/auth.ts
     import { writable, derived } from 'svelte/store';
     import type { User } from '$lib/types';

     interface AuthState {
       user: User | null;
       loading: boolean;
       error: string | null;
     }

     function createAuthStore() {
       const { subscribe, set, update } = writable<AuthState>({
         user: null,
         loading: false,
         error: null
       });

       return {
         subscribe,
         login: async (email: string, password: string) => {
           update(state => ({ ...state, loading: true, error: null }));

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

             // Store token in localStorage
             localStorage.setItem('token', token);

             update(state => ({ ...state, user, loading: false }));
           } catch (error) {
             update(state => ({
               ...state,
               loading: false,
               error: error.message
             }));
           }
         },
         logout: () => {
           localStorage.removeItem('token');
           set({ user: null, loading: false, error: null });
         },
         checkAuthStatus: async () => {
           const token = localStorage.getItem('token');
           if (!token) return;

           try {
             const response = await fetch('/api/auth/me', {
               headers: { Authorization: \`Bearer \${token}\` }
             });

             if (response.ok) {
               const user = await response.json();
               update(state => ({ ...state, user }));
             } else {
               localStorage.removeItem('token');
             }
           } catch (error) {
             console.error('Auth check failed:', error);
           }
         }
       };
     }

     export const authStore = createAuthStore();

     // Derived stores for computed values
     export const isAuthenticated = derived(
       authStore,
       $auth => !!$auth.user
     );

     export const isAdmin = derived(
       authStore,
       $auth => $auth.user?.role === 'admin'
     );
     \`\`\`

5. **Custom Stores for Complex State**
   - Create domain-specific stores
   - Implement store composition patterns
   - Handle async operations in stores
   - Example custom store:
     \`\`\`typescript
     // src/lib/stores/shopping-cart.ts
     import { writable, derived } from 'svelte/store';
     import type { Product, CartItem } from '$lib/types';

     function createCartStore() {
       const { subscribe, set, update } = writable<CartItem[]>([]);

       return {
         subscribe,
         addItem: (product: Product, quantity: number = 1) => {
           update(items => {
             const existingItem = items.find(item => item.product.id === product.id);

             if (existingItem) {
               return items.map(item =>
                 item.product.id === product.id
                   ? { ...item, quantity: item.quantity + quantity }
                   : item
               );
             } else {
               return [...items, { product, quantity }];
             }
           });
         },
         removeItem: (productId: string) => {
           update(items => items.filter(item => item.product.id !== productId));
         },
         updateQuantity: (productId: string, quantity: number) => {
           if (quantity <= 0) {
             cartStore.removeItem(productId);
             return;
           }

           update(items =>
             items.map(item =>
               item.product.id === productId
                 ? { ...item, quantity }
                 : item
             )
           );
         },
         clear: () => set([]),
         loadFromStorage: () => {
           if (typeof localStorage !== 'undefined') {
             const stored = localStorage.getItem('cart');
             if (stored) {
               set(JSON.parse(stored));
             }
           }
         }
       };
     }

     export const cartStore = createCartStore();

     // Derived stores for cart calculations
     export const cartTotal = derived(
       cartStore,
       $cart => $cart.reduce((total, item) =>
         total + (item.product.price * item.quantity), 0
       )
     );

     export const cartItemCount = derived(
       cartStore,
       $cart => $cart.reduce((count, item) => count + item.quantity, 0)
     );

     // Auto-save to localStorage
     cartStore.subscribe(items => {
       if (typeof localStorage !== 'undefined') {
         localStorage.setItem('cart', JSON.stringify(items));
       }
     });
     \`\`\`

6. **Store Persistence and Synchronization**
   - Persist store state across sessions
   - Sync stores with server state
   - Handle offline scenarios
   - Example persistence patterns:
     \`\`\`typescript
     // src/lib/stores/persisted.ts
     import { writable, type Writable } from 'svelte/store';
     import { browser } from '$app/environment';

     export function persisted<T>(
       key: string,
       initialValue: T,
       storage: Storage = localStorage
     ): Writable<T> {
       let storedValue = initialValue;

       if (browser) {
         const item = storage.getItem(key);
         if (item) {
           try {
             storedValue = JSON.parse(item);
           } catch (e) {
             console.warn(\`Failed to parse stored value for \${key}\`, e);
           }
         }
       }

       const store = writable(storedValue);

       if (browser) {
         store.subscribe(value => {
           try {
             storage.setItem(key, JSON.stringify(value));
           } catch (e) {
             console.warn(\`Failed to store value for \${key}\`, e);
           }
         });
       }

       return store;
     }

     // Usage
     export const userPreferences = persisted('userPreferences', {
       theme: 'light',
       language: 'en',
       notifications: true
     });
     \`\`\`

---

## Component Patterns

7. **Reactive Component Architecture**
   - Use reactive statements for computed values
   - Implement proper component lifecycle
   - Handle component communication effectively
   - Example component patterns:
     \`\`\`svelte
     <!-- src/lib/components/ProductCard.svelte -->
     <script lang="ts">
       import { createEventDispatcher } from 'svelte';
       import { cartStore } from '$lib/stores/shopping-cart';
       import type { Product } from '$lib/types';

       export let product: Product;
       export let showDetails: boolean = false;

       const dispatch = createEventDispatcher<{
         addToCart: { product: Product; quantity: number };
         viewDetails: { product: Product };
       }>();

       let quantity: number = 1;
       let imageLoaded: boolean = false;

       // Reactive statements
       $: discountedPrice = product.discount
         ? product.price * (1 - product.discount)
         : product.price;

       $: isOnSale = product.discount > 0;
       $: isInStock = product.stock > 0;

       function handleAddToCart() {
         if (isInStock) {
           cartStore.addItem(product, quantity);
           dispatch('addToCart', { product, quantity });
         }
       }

       function handleViewDetails() {
         dispatch('viewDetails', { product });
       }

       function handleImageLoad() {
         imageLoaded = true;
       }
     </script>

     <article class="product-card" class:on-sale={isOnSale}>
       <div class="image-container">
         {#if !imageLoaded}
           <div class="image-placeholder">Loading...</div>
         {/if}
         <img
           src={product.image}
           alt={product.name}
           on:load={handleImageLoad}
           class:loaded={imageLoaded}
         />
         {#if isOnSale}
           <span class="sale-badge">
             {Math.round(product.discount * 100)}% OFF
           </span>
         {/if}
       </div>

       <div class="content">
         <h3 class="title">{product.name}</h3>

         {#if showDetails}
           <p class="description">{product.description}</p>
         {/if}

         <div class="price-section">
           {#if isOnSale}
             <span class="original-price">\${product.price}</span>
           {/if}
           <span class="current-price">\${discountedPrice.toFixed(2)}</span>
         </div>

         <div class="actions">
           {#if isInStock}
             <div class="quantity-selector">
               <label for="quantity-{product.id}">Qty:</label>
               <input
                 id="quantity-{product.id}"
                 type="number"
                 min="1"
                 max={product.stock}
                 bind:value={quantity}
               />
             </div>
             <button class="add-to-cart" on:click={handleAddToCart}>
               Add to Cart
             </button>
           {:else}
             <button class="out-of-stock" disabled>
               Out of Stock
             </button>
           {/if}

           <button class="view-details" on:click={handleViewDetails}>
             View Details
           </button>
         </div>
       </div>
     </article>

     <style>
       .product-card {
         border: 1px solid #e2e8f0;
         border-radius: 8px;
         overflow: hidden;
         transition: transform 0.2s, box-shadow 0.2s;
       }

       .product-card:hover {
         transform: translateY(-2px);
         box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
       }

       .image-container {
         position: relative;
         height: 200px;
       }

       .image-placeholder {
         display: flex;
         align-items: center;
         justify-content: center;
         height: 100%;
         background: #f7fafc;
         color: #a0aec0;
       }

       img {
         width: 100%;
         height: 100%;
         object-fit: cover;
         opacity: 0;
         transition: opacity 0.3s;
       }

       img.loaded {
         opacity: 1;
       }

       .sale-badge {
         position: absolute;
         top: 8px;
         right: 8px;
         background: #e53e3e;
         color: white;
         padding: 4px 8px;
         border-radius: 4px;
         font-size: 0.75rem;
         font-weight: bold;
       }

       .content {
         padding: 1rem;
       }

       .title {
         margin: 0 0 0.5rem 0;
         font-size: 1.125rem;
         font-weight: 600;
       }

       .price-section {
         margin: 0.5rem 0;
       }

       .original-price {
         text-decoration: line-through;
         color: #a0aec0;
         margin-right: 0.5rem;
       }

       .current-price {
         font-size: 1.25rem;
         font-weight: bold;
         color: #2d3748;
       }

       .actions {
         display: flex;
         flex-direction: column;
         gap: 0.5rem;
         margin-top: 1rem;
       }

       .quantity-selector {
         display: flex;
         align-items: center;
         gap: 0.5rem;
       }

       input[type="number"] {
         width: 60px;
         padding: 0.25rem;
         border: 1px solid #e2e8f0;
         border-radius: 4px;
       }

       button {
         padding: 0.5rem 1rem;
         border: none;
         border-radius: 4px;
         cursor: pointer;
         font-weight: 500;
         transition: background-color 0.2s;
       }

       .add-to-cart {
         background: #4299e1;
         color: white;
       }

       .add-to-cart:hover {
         background: #3182ce;
       }

       .view-details {
         background: #edf2f7;
         color: #2d3748;
       }

       .view-details:hover {
         background: #e2e8f0;
       }

       .out-of-stock {
         background: #fed7d7;
         color: #e53e3e;
         cursor: not-allowed;
       }
     </style>
     \`\`\`

8. **Form Handling and Validation**
   - Implement reactive form validation
   - Handle form submission with proper error handling
   - Create reusable form components
   - Example form implementation:
     \`\`\`svelte
     <!-- src/lib/components/ContactForm.svelte -->
     <script lang="ts">
       import { createEventDispatcher } from 'svelte';

       export let initialData: Partial<ContactFormData> = {};

       const dispatch = createEventDispatcher<{
         submit: ContactFormData;
         cancel: void;
       }>();

       interface ContactFormData {
         name: string;
         email: string;
         subject: string;
         message: string;
       }

       let formData: ContactFormData = {
         name: '',
         email: '',
         subject: '',
         message: '',
         ...initialData
       };

       let errors: Partial<ContactFormData> = {};
       let isSubmitting = false;
       let touched: Partial<Record<keyof ContactFormData, boolean>> = {};

       // Validation rules
       const validators = {
         name: (value: string) => {
           if (!value.trim()) return 'Name is required';
           if (value.length < 2) return 'Name must be at least 2 characters';
           return null;
         },
         email: (value: string) => {
           if (!value.trim()) return 'Email is required';
           const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
           if (!emailRegex.test(value)) return 'Please enter a valid email';
           return null;
         },
         subject: (value: string) => {
           if (!value.trim()) return 'Subject is required';
           return null;
         },
         message: (value: string) => {
           if (!value.trim()) return 'Message is required';
           if (value.length < 10) return 'Message must be at least 10 characters';
           return null;
         }
       };

       // Reactive validation
       $: {
         errors = {};
         Object.keys(validators).forEach(key => {
           const field = key as keyof ContactFormData;
           if (touched[field]) {
             const error = validators[field](formData[field]);
             if (error) errors[field] = error;
           }
         });
       }

       $: isFormValid = Object.keys(errors).length === 0 &&
                       Object.keys(touched).length > 0;

       function handleFieldBlur(field: keyof ContactFormData) {
         touched[field] = true;
         touched = { ...touched }; // Trigger reactivity
       }

       async function handleSubmit() {
         // Mark all fields as touched for validation
         Object.keys(formData).forEach(key => {
           touched[key as keyof ContactFormData] = true;
         });
         touched = { ...touched };

         if (!isFormValid) return;

         isSubmitting = true;

         try {
           // Simulate API call
           await new Promise(resolve => setTimeout(resolve, 1000));
           dispatch('submit', formData);
         } catch (error) {
           console.error('Form submission failed:', error);
         } finally {
           isSubmitting = false;
         }
       }

       function handleCancel() {
         dispatch('cancel');
       }
     </script>

     <form on:submit|preventDefault={handleSubmit} class="contact-form">
       <div class="form-group">
         <label for="name">Name *</label>
         <input
           id="name"
           type="text"
           bind:value={formData.name}
           on:blur={() => handleFieldBlur('name')}
           class:error={errors.name}
           required
         />
         {#if errors.name}
           <span class="error-message">{errors.name}</span>
         {/if}
       </div>

       <div class="form-group">
         <label for="email">Email *</label>
         <input
           id="email"
           type="email"
           bind:value={formData.email}
           on:blur={() => handleFieldBlur('email')}
           class:error={errors.email}
           required
         />
         {#if errors.email}
           <span class="error-message">{errors.email}</span>
         {/if}
       </div>

       <div class="form-group">
         <label for="subject">Subject *</label>
         <input
           id="subject"
           type="text"
           bind:value={formData.subject}
           on:blur={() => handleFieldBlur('subject')}
           class:error={errors.subject}
           required
         />
         {#if errors.subject}
           <span class="error-message">{errors.subject}</span>
         {/if}
       </div>

       <div class="form-group">
         <label for="message">Message *</label>
         <textarea
           id="message"
           bind:value={formData.message}
           on:blur={() => handleFieldBlur('message')}
           class:error={errors.message}
           rows="5"
           required
         ></textarea>
         {#if errors.message}
           <span class="error-message">{errors.message}</span>
         {/if}
       </div>

       <div class="form-actions">
         <button type="button" on:click={handleCancel} class="cancel-btn">
           Cancel
         </button>
         <button
           type="submit"
           disabled={!isFormValid || isSubmitting}
           class="submit-btn"
         >
           {#if isSubmitting}
             Sending...
           {:else}
             Send Message
           {/if}
         </button>
       </div>
     </form>

     <style>
       .contact-form {
         max-width: 500px;
         margin: 0 auto;
       }

       .form-group {
         margin-bottom: 1rem;
       }

       label {
         display: block;
         margin-bottom: 0.5rem;
         font-weight: 500;
         color: #2d3748;
       }

       input, textarea {
         width: 100%;
         padding: 0.75rem;
         border: 1px solid #e2e8f0;
         border-radius: 4px;
         font-size: 1rem;
         transition: border-color 0.2s;
       }

       input:focus, textarea:focus {
         outline: none;
         border-color: #4299e1;
         box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
       }

       input.error, textarea.error {
         border-color: #e53e3e;
       }

       .error-message {
         display: block;
         margin-top: 0.25rem;
         font-size: 0.875rem;
         color: #e53e3e;
       }

       .form-actions {
         display: flex;
         justify-content: flex-end;
         gap: 1rem;
         margin-top: 2rem;
       }

       button {
         padding: 0.75rem 1.5rem;
         border: none;
         border-radius: 4px;
         font-weight: 500;
         cursor: pointer;
         transition: background-color 0.2s;
       }

       .cancel-btn {
         background: #edf2f7;
         color: #2d3748;
       }

       .cancel-btn:hover {
         background: #e2e8f0;
       }

       .submit-btn {
         background: #4299e1;
         color: white;
       }

       .submit-btn:hover:not(:disabled) {
         background: #3182ce;
       }

       .submit-btn:disabled {
         background: #a0aec0;
         cursor: not-allowed;
       }
     </style>
     \`\`\`

---

## API Routes and Server-Side Logic

9. **API Route Implementation**
   - Create RESTful API endpoints
   - Handle different HTTP methods
   - Implement proper error handling and validation
   - Example API routes:
     \`\`\`typescript
     // src/routes/api/posts/+server.ts
     import { json, error } from '@sveltejs/kit';
     import type { RequestHandler } from './$types';
     import { db } from '$lib/server/database';
     import { validatePostData } from '$lib/server/validation';

     export const GET: RequestHandler = async ({ url, locals }) => {
       try {
         const page = parseInt(url.searchParams.get('page') || '1');
         const limit = parseInt(url.searchParams.get('limit') || '10');
         const category = url.searchParams.get('category') || '';
         const search = url.searchParams.get('search') || '';

         const offset = (page - 1) * limit;

         const { posts, total } = await db.posts.findMany({
           offset,
           limit,
           category,
           search,
           publishedOnly: !locals.user?.isAdmin
         });

         return json({
           posts,
           pagination: {
             currentPage: page,
             totalPages: Math.ceil(total / limit),
             total,
             hasNextPage: page * limit < total,
             hasPrevPage: page > 1
           }
         });
       } catch (err) {
         console.error('Failed to fetch posts:', err);
         throw error(500, 'Failed to fetch posts');
       }
     };

     export const POST: RequestHandler = async ({ request, locals }) => {
       if (!locals.user) {
         throw error(401, 'Authentication required');
       }

       try {
         const postData = await request.json();

         const validationResult = validatePostData(postData);
         if (!validationResult.isValid) {
           throw error(400, {
             message: 'Validation failed',
             errors: validationResult.errors
           });
         }

         const post = await db.posts.create({
           ...postData,
           authorId: locals.user.id,
           createdAt: new Date(),
           updatedAt: new Date()
         });

         return json(post, { status: 201 });
       } catch (err) {
         if (err.status) throw err;
         console.error('Failed to create post:', err);
         throw error(500, 'Failed to create post');
       }
     };

     // src/routes/api/posts/[id]/+server.ts
     import { json, error } from '@sveltejs/kit';
     import type { RequestHandler } from './$types';
     import { db } from '$lib/server/database';

     export const GET: RequestHandler = async ({ params, locals }) => {
       try {
         const post = await db.posts.findById(params.id);

         if (!post) {
           throw error(404, 'Post not found');
         }

         // Check access permissions
         if (post.status === 'draft' && post.authorId !== locals.user?.id && !locals.user?.isAdmin) {
           throw error(403, 'Access denied');
         }

         return json(post);
       } catch (err) {
         if (err.status) throw err;
         throw error(500, 'Failed to fetch post');
       }
     };

     export const PUT: RequestHandler = async ({ params, request, locals }) => {
       if (!locals.user) {
         throw error(401, 'Authentication required');
       }

       try {
         const post = await db.posts.findById(params.id);

         if (!post) {
           throw error(404, 'Post not found');
         }

         if (post.authorId !== locals.user.id && !locals.user.isAdmin) {
           throw error(403, 'Access denied');
         }

         const updateData = await request.json();
         const validationResult = validatePostData(updateData);

         if (!validationResult.isValid) {
           throw error(400, {
             message: 'Validation failed',
             errors: validationResult.errors
           });
         }

         const updatedPost = await db.posts.update(params.id, {
           ...updateData,
           updatedAt: new Date()
         });

         return json(updatedPost);
       } catch (err) {
         if (err.status) throw err;
         throw error(500, 'Failed to update post');
       }
     };

     export const DELETE: RequestHandler = async ({ params, locals }) => {
       if (!locals.user) {
         throw error(401, 'Authentication required');
       }

       try {
         const post = await db.posts.findById(params.id);

         if (!post) {
           throw error(404, 'Post not found');
         }

         if (post.authorId !== locals.user.id && !locals.user.isAdmin) {
           throw error(403, 'Access denied');
         }

         await db.posts.delete(params.id);

         return new Response(null, { status: 204 });
       } catch (err) {
         if (err.status) throw err;
         throw error(500, 'Failed to delete post');
       }
     };
     \`\`\`

10. **Authentication and Authorization Hooks**
    - Implement server-side authentication
    - Create authorization middleware
    - Handle session management
    - Example authentication setup:
      \`\`\`typescript
      // src/hooks.server.ts
      import type { Handle } from '@sveltejs/kit';
      import jwt from 'jsonwebtoken';
      import { JWT_SECRET } from '$env/static/private';
      import { db } from '$lib/server/database';

      export const handle: Handle = async ({ event, resolve }) => {
        // Get token from Authorization header or cookies
        const token = event.request.headers.get('authorization')?.replace('Bearer ', '') ||
                     event.cookies.get('auth-token');

        if (token) {
          try {
            const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
            const user = await db.users.findById(payload.userId);

            if (user) {
              event.locals.user = user;
            }
          } catch (err) {
            // Invalid token - clear it
            event.cookies.delete('auth-token', { path: '/' });
          }
        }

        // Apply CORS headers
        if (event.request.method === 'OPTIONS') {
          return new Response(null, {
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
          });
        }

        const response = await resolve(event);

        // Add security headers
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

        return response;
      };

      // src/routes/api/auth/login/+server.ts
      import { json, error } from '@sveltejs/kit';
      import type { RequestHandler } from './$types';
      import bcrypt from 'bcryptjs';
      import jwt from 'jsonwebtoken';
      import { JWT_SECRET } from '$env/static/private';
      import { db } from '$lib/server/database';

      export const POST: RequestHandler = async ({ request, cookies }) => {
        try {
          const { email, password } = await request.json();

          if (!email || !password) {
            throw error(400, 'Email and password are required');
          }

          const user = await db.users.findByEmail(email);
          if (!user) {
            throw error(401, 'Invalid credentials');
          }

          const isValidPassword = await bcrypt.compare(password, user.passwordHash);
          if (!isValidPassword) {
            throw error(401, 'Invalid credentials');
          }

          const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          // Set HTTP-only cookie
          cookies.set('auth-token', token, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7 // 7 days
          });

          // Return user data (without password)
          const { passwordHash, ...userWithoutPassword } = user;

          return json({
            user: userWithoutPassword,
            token
          });
        } catch (err) {
          if (err.status) throw err;
          throw error(500, 'Login failed');
        }
      };
      \`\`\`

---

## Testing Strategies

11. **Component and Integration Testing**
    - Test Svelte components with proper mocking
    - Write integration tests for user flows
    - Test stores and reactive behavior
    - Example testing setup:
      \`\`\`typescript
      // src/lib/components/ProductCard.test.ts
      import { render, fireEvent, screen } from '@testing-library/svelte';
      import { expect, test, vi } from 'vitest';
      import ProductCard from './ProductCard.svelte';
      import type { Product } from '$lib/types';

      const mockProduct: Product = {
        id: '1',
        name: 'Test Product',
        description: 'A test product',
        price: 29.99,
        image: '/test-image.jpg',
        stock: 10,
        discount: 0.1
      };

      test('renders product information correctly', () => {
        render(ProductCard, { product: mockProduct });

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('$26.99')).toBeInTheDocument(); // Discounted price
        expect(screen.getByText('10% OFF')).toBeInTheDocument();
      });

      test('dispatches addToCart event when add to cart is clicked', async () => {
        const { component } = render(ProductCard, { product: mockProduct });

        const addToCartHandler = vi.fn();
        component.$on('addToCart', addToCartHandler);

        const addButton = screen.getByText('Add to Cart');
        await fireEvent.click(addButton);

        expect(addToCartHandler).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: { product: mockProduct, quantity: 1 }
          })
        );
      });

      test('shows out of stock when product stock is 0', () => {
        const outOfStockProduct = { ...mockProduct, stock: 0 };
        render(ProductCard, { product: outOfStockProduct });

        expect(screen.getByText('Out of Stock')).toBeInTheDocument();
        expect(screen.queryByText('Add to Cart')).not.toBeInTheDocument();
      });

      // Store testing
      // src/lib/stores/cart.test.ts
      import { get } from 'svelte/store';
      import { expect, test, beforeEach } from 'vitest';
      import { cartStore, cartTotal, cartItemCount } from './shopping-cart';

      beforeEach(() => {
        cartStore.clear();
      });

      test('adds item to cart', () => {
        const product = { id: '1', name: 'Test', price: 10 };

        cartStore.addItem(product, 2);

        const cartItems = get(cartStore);
        expect(cartItems).toHaveLength(1);
        expect(cartItems[0].product.id).toBe('1');
        expect(cartItems[0].quantity).toBe(2);
      });

      test('calculates cart total correctly', () => {
        const product1 = { id: '1', name: 'Product 1', price: 10 };
        const product2 = { id: '2', name: 'Product 2', price: 20 };

        cartStore.addItem(product1, 2);
        cartStore.addItem(product2, 1);

        expect(get(cartTotal)).toBe(40); // (10 * 2) + (20 * 1)
        expect(get(cartItemCount)).toBe(3); // 2 + 1
      });

      // API testing
      // src/routes/api/posts/posts.test.ts
      import { expect, test, vi } from 'vitest';
      import type { RequestEvent } from '@sveltejs/kit';
      import { GET, POST } from './+server';

      // Mock database
      vi.mock('$lib/server/database', () => ({
        db: {
          posts: {
            findMany: vi.fn(),
            create: vi.fn()
          }
        }
      }));

      test('GET returns paginated posts', async () => {
        const mockPosts = [
          { id: '1', title: 'Post 1' },
          { id: '2', title: 'Post 2' }
        ];

        const mockRequest = new Request('http://localhost/api/posts?page=1&limit=10');
        const mockEvent = {
          url: new URL(mockRequest.url),
          locals: { user: null }
        } as unknown as RequestEvent;

        const { db } = await import('$lib/server/database');
        vi.mocked(db.posts.findMany).mockResolvedValue({
          posts: mockPosts,
          total: 2
        });

        const response = await GET(mockEvent);
        const data = await response.json();

        expect(data.posts).toEqual(mockPosts);
        expect(data.pagination.currentPage).toBe(1);
        expect(data.pagination.total).toBe(2);
      });
      \`\`\`

---

## Summary Checklist

- [ ] Use file-based routing for automatic route generation
- [ ] Implement load functions for server-side data fetching
- [ ] Create reactive stores for global state management
- [ ] Use derived stores for computed values
- [ ] Build reusable components with proper event handling
- [ ] Implement form validation with reactive statements
- [ ] Create RESTful API routes with proper error handling
- [ ] Set up authentication and authorization hooks
- [ ] Use proper TypeScript types throughout the application
- [ ] Implement lazy loading and code splitting
- [ ] Write comprehensive tests for components and stores
- [ ] Handle loading states and errors gracefully
- [ ] Use SSR and prerendering for performance
- [ ] Implement proper SEO and meta tag management

---

Follow these practices to build fast, scalable, and maintainable full-stack web applications with SvelteKit.`,
	categories: ["svelte", "frontend", "fullstack", "javascript"],
	tags: ["sveltekit", "stores", "ssr", "routing"],
	author: "Community",
	createdAt: "2024-01-15T00:00:00Z",
	applicationMode: "intelligent",
	globs: "*.svelte,*.ts,*.js",
};
