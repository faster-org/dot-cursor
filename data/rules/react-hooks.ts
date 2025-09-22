import { Rule } from "../types";

export const rule: Rule = {
	id: "react-hooks",
	slug: "react-hooks",
	title: "React Hooks Expert",
	description: "Master React Hooks patterns, custom hooks, and state management",
	content: `# React Hooks Expert

Master React Hooks patterns, custom hooks, and state management with these comprehensive guidelines.

---

## Core Hook Principles

1. **Follow the Rules of Hooks**
   - Always use hooks at the top level of functional components
   - Never call hooks inside loops, conditions, or nested functions
   - Only call hooks from React functions

2. **Prefer Hooks Over Class Components**
   - Use functional components with hooks for all new development
   - Migrate existing class components to hooks when practical

---

## Essential Hook Patterns

### State Management

3. **useState for Local Component State**
   \`\`\`tsx
   const [count, setCount] = useState(0);
   const [user, setUser] = useState<User | null>(null);
   \`\`\`

4. **useReducer for Complex State Logic**
   \`\`\`tsx
   const [state, dispatch] = useReducer(reducer, initialState);
   \`\`\`

### Side Effects

5. **useEffect with Proper Cleanup**
   \`\`\`tsx
   useEffect(() => {
     const subscription = api.subscribe();
     return () => subscription.unsubscribe();
   }, []);
   \`\`\`

6. **useContext for Consuming Context Values**
   \`\`\`tsx
   const theme = useContext(ThemeContext);
   \`\`\`

---

## Performance Optimization

7. **useMemo for Expensive Computations**
   \`\`\`tsx
   const expensiveValue = useMemo(() => {
     return computeExpensiveValue(data);
   }, [data]);
   \`\`\`

8. **useCallback for Stable Function References**
   \`\`\`tsx
   const handleClick = useCallback(() => {
     onClick(id);
   }, [onClick, id]);
   \`\`\`

9. **Prevent Unnecessary Re-renders**
   - Use React.memo for component memoization
   - Implement proper dependency arrays
   - Use lazy initial state for expensive operations

---

## Custom Hooks

10. **Create Reusable Logic**
    - Extract complex logic into custom hooks
    - Prefix custom hooks with 'use'
    - Return consistent data structures

11. **Handle Loading, Error, and Data States**
    \`\`\`tsx
    function useApi<T>(url: string) {
      const [data, setData] = useState<T | null>(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<Error | null>(null);

      // Implementation...

      return { data, loading, error };
    }
    \`\`\`

---

## Best Practices Checklist

- [ ] Hooks called at top level only
- [ ] Proper dependency arrays in useEffect/useMemo/useCallback
- [ ] Custom hooks for reusable logic
- [ ] Cleanup effects to prevent memory leaks
- [ ] Memoization for performance optimization
- [ ] Consistent return patterns from custom hooks`,
	categories: ["react", "frontend", "javascript"],
	tags: ["hooks", "state-management", "performance"],
	author: "Community",
	createdAt: "2024-01-25T00:00:00Z",
	applicationMode: "intelligent",
};
