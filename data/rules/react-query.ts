import { Rule } from "../types";

export const rule: Rule = {
	id: "react-query",
	slug: "react-query",
	title: "React Query",
	description:
		"Ultimate set of rules and best practices for using React Query effectively in production environments",
	content: `# React Query Rules

This document outlines the ultimate set of rules and best practices for using React Query effectively in production environments.

---

## Core Principles

1. **Think in Server State, Not Client State**
   - Use React Query for remote data (from APIs).
   - Use component/local state, React Context, or global state management libraries (e.g., Redux, Zustand, Jotai) for client-specific state (e.g., modal open/close, form state).

2. **Always Prefer \`useQuery\` Over Manual Fetch**
   - Encapsulate API logic in \`useQuery\` instead of \`useEffect\` + \`useState\`.
   - Example:
     \`\`\`ts
     const { data, isLoading } = useQuery(['todos'], fetchTodos);
     \`\`\`

3. **Use Query Keys Strategically**
   - Keys must be unique and predictable.
   - Use arrays: \`['todos', userId]\` instead of string concatenation.
   - Extract query keys into a central file for consistency.

---

## Organizing Queries

4. **Normalize Query Keys**
   - Create a \`queryKeys\` helper to avoid duplication.
   - Example:
     \`\`\`ts
     export const queryKeys = {
       todos: (userId: string) => ['todos', userId],
       profile: ['profile'],
     };
     \`\`\`

5. **Encapsulate Queries in Custom Hooks**
   - Define reusable hooks like \`useTodos(userId)\` or \`useUserProfile()\`.
   - Keeps components clean and ensures consistent query usage across the app.

6. **Set \`staleTime\` and \`cacheTime\` Wisely**
   - \`staleTime\`: How long data is considered "fresh". Set based on data volatility.
   - \`cacheTime\`: How long unused data stays cached before garbage collection.

7. **Avoid Over-Fetching**
   - Use \`enabled: false\` for conditional queries.
   - Example: wait until \`userId\` is available.
     \`\`\`ts
     const { data } = useQuery(queryKeys.todos(userId), fetchTodos, {
       enabled: !!userId,
     });
     \`\`\`

---

## Mutations

8. **Always Use \`useMutation\` for POST/PUT/DELETE**
   - Example:
     \`\`\`ts
     const mutation = useMutation(updateTodo, {
       onSuccess: () => queryClient.invalidateQueries(queryKeys.todos()),
     });
     \`\`\`

9. **Leverage Optimistic Updates**
   - Use \`onMutate\`, \`onError\`, and \`onSettled\` for smooth UX.
   - Rollback changes on failure to maintain consistency.

---

## Data Synchronization

10. **Invalidate Queries Intentionally**
    - Use \`invalidateQueries\` after mutations that affect cached data.
    - Narrow scope: invalidate only related queries instead of all queries.

11. **Background Refetching**
    - Use \`refetchOnWindowFocus\` and \`refetchInterval\` sparingly.
    - Enable only when data must stay real-time fresh.

---

## Performance

12. **Batch Queries with \`useQueries\`**
    - Combine multiple queries where necessary.
    - Prevents unnecessary network requests.

13. **Paginated & Infinite Queries**
    - Use \`useInfiniteQuery\` for endless scrolling.
    - Always return \`nextCursor\` or pagination info from the API.

14. **Prefetch & Hydrate**
    - Use \`queryClient.prefetchQuery\` for routes you know the user will visit soon.
    - For SSR/SSG, use \`dehydrate\` and \`Hydrate\` to deliver cached data on load.

---

## Error & Loading States

15. **Centralize Error Handling**
    - Use React Query's global \`onError\` handler.
    - Provide user-friendly error boundaries in the UI.

16. **Never Block UI**
    - Avoid full-page global spinners.
    - Use skeletons, placeholders, or incremental loading instead.

---

## Testing

17. **Mock QueryClient in Tests**
    - Use \`QueryClientProvider\` with an isolated \`QueryClient\` in each test.
    - Avoid leaking cache across tests.

18. **Test Hook Logic, Not Library Behavior**
    - Don't test React Query itself—only your query functions and business logic.

---

## Security & Reliability

19. **Never Expose Sensitive Data in Query Keys**
    - Query keys should be serializable and safe to log.

20. **Use Retry Strategically**
    - Default retries may harm UX on destructive operations.
    - Configure retries per-query to fit the use case.

---

## Summary Checklist

- [ ] Queries = remote server state only
- [ ] Consistent query key strategy
- [ ] Encapsulate queries in reusable hooks
- [ ] Smart \`staleTime\` and \`cacheTime\` defaults
- [ ] Conditional queries with \`enabled\`
- [ ] Mutations use optimistic updates
- [ ] Intentional invalidation, no blind refetches
- [ ] Minimal global loading spinners
- [ ] Prefetch + hydration for SSR/SSG
- [ ] Proper test isolation with \`QueryClient\`
- [ ] Secure, serializable query keys

---

Follow these rules to keep your React Query setup clean, scalable, and production-ready.`,
	categories: ["react", "data-fetching", "state-management"],
	tags: ["react-query", "tanstack-query", "caching", "mutations"],
	author: "Community",
	createdAt: "2024-01-15T00:00:00Z",
	applicationMode: "intelligent",
};
