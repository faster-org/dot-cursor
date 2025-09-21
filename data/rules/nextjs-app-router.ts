import { Rule } from "../types";

export const rule: Rule = {
	id: "nextjs-app-router",
	slug: "nextjs-app-router",
	title: "Next.js 14 App Router Expert",
	description:
		"Expert in Next.js 14 App Router, React Server Components, and modern web development",
	content: `# Next.js 14 App Router Best Practices

Ultimate guide for building production-ready applications with Next.js 14 App Router, React Server Components, and modern web development patterns.

---

## Core Principles

1. **Server-First Architecture**
   - Use React Server Components by default for better performance
   - Only add \`'use client'\` directive when absolutely necessary (user interactions, browser APIs)
   - Fetch data directly in server components instead of client-side useEffect patterns

2. **App Directory Structure**
   - Leverage the new \`app/\` directory structure over legacy \`pages/\`
   - Use \`page.tsx\` for route components and \`layout.tsx\` for shared layouts
   - Example structure:
     \`\`\`
     app/
       layout.tsx          // Root layout
       page.tsx           // Home page
       dashboard/
         layout.tsx       // Dashboard layout
         page.tsx        // Dashboard page
         settings/
           page.tsx      // Settings page
     \`\`\`

3. **TypeScript Integration**
   - Use strict TypeScript configuration for better type safety
   - Define proper types for route parameters, search params, and props
   - Example:
     \`\`\`ts
     interface PageProps {
       params: { id: string };
       searchParams: { [key: string]: string | string[] | undefined };
     }
     \`\`\`

---

## Data Fetching Patterns

4. **Server Component Data Fetching**
   - Fetch data directly in server components using async/await
   - No need for useState or useEffect for initial data loading
   - Example:
     \`\`\`tsx
     async function ProductPage({ params }: { params: { id: string } }) {
       const product = await fetch(\`/api/products/\${params.id}\`).then(r => r.json());
       return <ProductDisplay product={product} />;
     }
     \`\`\`

5. **Parallel Data Fetching**
   - Use Promise.all() to fetch multiple data sources simultaneously
   - Prevents waterfall requests and improves performance
   - Example:
     \`\`\`tsx
     async function Dashboard() {
       const [user, posts, analytics] = await Promise.all([
         fetchUser(),
         fetchPosts(),
         fetchAnalytics()
       ]);
       return <DashboardView user={user} posts={posts} analytics={analytics} />;
     }
     \`\`\`

6. **Client-Side Data Fetching**
   - Use SWR or React Query for client-side data fetching when needed
   - Implement proper loading and error states
   - Only use for user-triggered actions or real-time updates

---

## Routing and Navigation

7. **Dynamic Routes**
   - Use \`[param]\` for dynamic segments and \`[...slug]\` for catch-all routes
   - Access route parameters through the \`params\` prop
   - Example: \`app/blog/[slug]/page.tsx\`

8. **Route Groups and Layouts**
   - Use \`(groupName)\` for organizing routes without affecting URL structure
   - Create targeted layouts for specific route groups
   - Example: \`app/(dashboard)/analytics/page.tsx\`

9. **Programmatic Navigation**
   - Use \`useRouter\` from \`next/navigation\` (not \`next/router\`)
   - Prefer \`router.push()\` over \`router.replace()\` for better UX
   - Example:
     \`\`\`tsx
     'use client';
     import { useRouter } from 'next/navigation';

     function NavigateButton() {
       const router = useRouter();
       return <button onClick={() => router.push('/dashboard')}>Go to Dashboard</button>;
     }
     \`\`\`

---

## Special Files and Conventions

10. **Loading UI**
    - Create \`loading.tsx\` files for instant loading states
    - Use loading boundaries to show progressive loading
    - Implement skeleton components for better perceived performance

11. **Error Handling**
    - Use \`error.tsx\` files for error boundaries at route level
    - Implement \`not-found.tsx\` for custom 404 pages
    - Add proper error recovery mechanisms

12. **Route Handlers (API Routes)**
    - Create API endpoints using \`route.ts\` files in app directory
    - Support multiple HTTP methods in a single file
    - Example:
      \`\`\`ts
      // app/api/users/route.ts
      export async function GET() {
        return Response.json({ users: [] });
      }

      export async function POST(request: Request) {
        const data = await request.json();
        return Response.json({ success: true });
      }
      \`\`\`

---

## Performance Optimization

13. **Image Optimization**
    - Always use \`next/image\` component instead of HTML \`<img>\`
    - Implement proper \`alt\` attributes and sizing
    - Use \`priority\` prop for above-the-fold images
    - Example:
      \`\`\`tsx
      import Image from 'next/image';

      <Image
        src="/hero.jpg"
        alt="Hero image"
        width={800}
        height={600}
        priority
      />
      \`\`\`

14. **Code Splitting and Dynamic Imports**
    - Use dynamic imports for heavy components or libraries
    - Implement proper loading states for dynamically imported components
    - Example:
      \`\`\`tsx
      import dynamic from 'next/dynamic';

      const HeavyChart = dynamic(() => import('./HeavyChart'), {
        loading: () => <p>Loading chart...</p>
      });
      \`\`\`

15. **Caching Strategies**
    - Leverage Next.js automatic caching for fetch requests
    - Use \`revalidate\` option for ISR (Incremental Static Regeneration)
    - Implement proper cache invalidation strategies
    - Example:
      \`\`\`ts
      fetch('/api/data', { next: { revalidate: 3600 } }); // Cache for 1 hour
      \`\`\`

---

## State Management

16. **Server State vs Client State**
    - Keep server state on the server (in server components)
    - Use client state only for UI-specific state (modals, form inputs)
    - Consider React Context or Zustand for complex client state

17. **Form Handling**
    - Use Server Actions for form submissions when possible
    - Implement proper form validation and error handling
    - Example:
      \`\`\`tsx
      async function createUser(formData: FormData) {
        'use server';
        const name = formData.get('name');
        // Handle form submission
      }

      function UserForm() {
        return (
          <form action={createUser}>
            <input name="name" required />
            <button type="submit">Create User</button>
          </form>
        );
      }
      \`\`\`

---

## Security and Best Practices

18. **Environment Variables**
    - Use \`NEXT_PUBLIC_\` prefix for client-side environment variables
    - Keep sensitive data server-side only
    - Validate environment variables at build time

19. **Content Security Policy**
    - Implement proper CSP headers for security
    - Use nonce-based CSP for inline scripts and styles
    - Configure CSP in \`next.config.js\`

20. **SEO and Metadata**
    - Use the new Metadata API for better SEO
    - Implement proper Open Graph and Twitter Card meta tags
    - Example:
      \`\`\`ts
      export const metadata = {
        title: 'My App',
        description: 'Description of my app',
        openGraph: {
          title: 'My App',
          description: 'Description of my app',
          images: ['/og-image.jpg']
        }
      };
      \`\`\`

---

## Testing

21. **Component Testing**
    - Test server components by testing their data fetching logic
    - Use React Testing Library for client component testing
    - Mock external API calls appropriately

22. **E2E Testing**
    - Use Playwright or Cypress for end-to-end testing
    - Test critical user journeys and form submissions
    - Implement visual regression testing for UI consistency

---

## Summary Checklist

- [ ] Use server components by default, client components only when needed
- [ ] Implement proper app directory structure with layouts
- [ ] Fetch data in server components, not useEffect
- [ ] Use loading.tsx and error.tsx for better UX
- [ ] Optimize images with next/image component
- [ ] Implement proper TypeScript types for routes
- [ ] Use Server Actions for form handling
- [ ] Leverage Next.js caching strategies
- [ ] Implement proper SEO with Metadata API
- [ ] Test both server and client components appropriately

---

Follow these patterns to build scalable, performant, and maintainable Next.js 14 applications.`,
	categories: ["nextjs", "react", "typescript"],
	tags: ["app-router", "server-components", "performance"],
	author: "Community",
	createdAt: "2024-01-15T00:00:00Z",
	applicationMode: "intelligent",
};
