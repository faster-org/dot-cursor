import { Rule } from "../types";

export const rule: Rule = {
	id: "typescript-expert",
	slug: "typescript-expert",
	title: "TypeScript Expert",
	description: "Advanced TypeScript patterns, generics, and type safety best practices",
	content: `# TypeScript Expert Best Practices

Comprehensive guide for mastering TypeScript's advanced type system, generics, and building type-safe applications at scale.

---

## Core TypeScript Principles

1. **Strict Type Safety**
   - Enable strict mode and all strict compiler options
   - Minimize use of \`any\` type - prefer \`unknown\` when type is uncertain
   - Use type assertions sparingly and with proper validation
   - Example strict configuration:
     \`\`\`json
     {
       "compilerOptions": {
         "strict": true,
         "noImplicitAny": true,
         "strictNullChecks": true,
         "strictFunctionTypes": true,
         "noImplicitReturns": true,
         "noFallthroughCasesInSwitch": true
       }
     }
     \`\`\`

2. **Type vs Interface Design**
   - Use \`interface\` for object shapes that might be extended
   - Use \`type\` for unions, primitives, computed types, and complex type operations
   - Prefer composition over inheritance for complex type relationships
   - Example usage patterns:
     \`\`\`ts
     // Use interface for extensible object shapes
     interface User {
       id: string;
       name: string;
       email: string;
     }

     interface AdminUser extends User {
       permissions: string[];
     }

     // Use type for unions and computed types
     type Status = 'pending' | 'approved' | 'rejected';
     type UserWithStatus = User & { status: Status };
     \`\`\`

3. **Leveraging Type Inference**
   - Let TypeScript infer types when they're obvious
   - Explicitly type function return values for clarity and error catching
   - Use const assertions for immutable data structures
   - Example inference patterns:
     \`\`\`ts
     // Good: Let TypeScript infer simple types
     const numbers = [1, 2, 3]; // inferred as number[]
     const user = { name: 'John', age: 30 }; // inferred shape

     // Good: Explicit return types for functions
     function getUser(id: string): Promise<User | null> {
       return database.findUser(id);
     }

     // Good: Const assertions for literal types
     const themes = ['light', 'dark'] as const;
     type Theme = typeof themes[number]; // 'light' | 'dark'
     \`\`\`

---

## Advanced Type Patterns

4. **Generic Types with Constraints**
   - Use generic constraints to limit type parameters
   - Implement proper bounds checking for type safety
   - Create reusable generic utilities
   - Example generic patterns:
     \`\`\`ts
     // Generic with constraints
     interface HasId {
       id: string;
     }

     function updateEntity<T extends HasId>(entity: T, updates: Partial<T>): T {
       return { ...entity, ...updates };
     }

     // Multiple constraints
     function merge<T extends object, U extends object>(a: T, b: U): T & U {
       return { ...a, ...b };
     }

     // Generic with default types
     interface ApiResponse<T = unknown> {
       data: T;
       status: number;
       message: string;
     }
     \`\`\`

5. **Conditional Types and Mapped Types**
   - Use conditional types for type-level logic
   - Create mapped types for transforming existing types
   - Implement advanced type utilities
   - Example conditional types:
     \`\`\`ts
     // Conditional type for extracting function return types
     type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

     // Conditional type for filtering
     type NonNullable<T> = T extends null | undefined ? never : T;

     // Mapped type for making properties optional
     type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

     // Deep readonly utility
     type DeepReadonly<T> = {
       readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
     };
     \`\`\`

6. **Template Literal Types**
   - Create dynamic string types with template literals
   - Build type-safe APIs with string manipulation
   - Generate types from string patterns
   - Example template literal types:
     \`\`\`ts
     // Event system with template literals
     type EventName = 'click' | 'focus' | 'blur';
     type ElementId = 'button' | 'input' | 'form';
     type EventHandler = \`on\${Capitalize<EventName>}\`;
     type ElementEvent = \`\${ElementId}:\${EventName}\`;

     // Type-safe CSS-in-JS
     type CSSProperty = 'margin' | 'padding' | 'border';
     type CSSDirection = 'top' | 'right' | 'bottom' | 'left';
     type DetailedCSSProperty = \`\${CSSProperty}-\${CSSDirection}\`;

     // API endpoint types
     type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
     type Endpoint = \`/api/\${string}\`;
     type ApiCall = \`\${HttpMethod} \${Endpoint}\`;
     \`\`\`

---

## Utility Types and Type Manipulation

7. **Built-in Utility Types**
   - Master essential utility types: Partial, Required, Pick, Omit, Record
   - Use ReturnType, Parameters, and ConstructorParameters for function types
   - Leverage Exclude, Extract, and NonNullable for type filtering
   - Example utility type usage:
     \`\`\`ts
     interface User {
       id: string;
       name: string;
       email: string;
       password: string;
       createdAt: Date;
     }

     // Pick only safe fields for public API
     type PublicUser = Pick<User, 'id' | 'name' | 'email'>;

     // Create update type without id and createdAt
     type UserUpdate = Omit<User, 'id' | 'createdAt'>;

     // Make all fields optional for partial updates
     type UserPartialUpdate = Partial<UserUpdate>;

     // Extract function types
     type AsyncFunction<T> = (...args: any[]) => Promise<T>;
     type ExtractPromiseType<T> = T extends Promise<infer U> ? U : never;
     \`\`\`

8. **Custom Utility Types**
   - Create project-specific utility types for common patterns
   - Build composable type transformations
   - Implement domain-specific type helpers
   - Example custom utilities:
     \`\`\`ts
     // Make specific fields required
     type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

     // Create a type with all string values
     type Stringify<T> = {
       [K in keyof T]: string;
     };

     // Extract keys by value type
     type KeysOfType<T, U> = {
       [K in keyof T]: T[K] extends U ? K : never;
     }[keyof T];

     // Function overload helper
     type Overload<T> = T extends {
       (...args: infer A1): infer R1;
       (...args: infer A2): infer R2;
     } ? ((...args: A1) => R1) & ((...args: A2) => R2) : never;
     \`\`\`

---

## Type Guards and Validation

9. **Type Guards and Predicates**
   - Implement type guards for runtime type checking
   - Use assertion functions for validation
   - Create branded types for type safety
   - Example type guard patterns:
     \`\`\`ts
     // Basic type guard
     function isString(value: unknown): value is string {
       return typeof value === 'string';
     }

     // Object type guard
     function isUser(obj: unknown): obj is User {
       return typeof obj === 'object' &&
              obj !== null &&
              'id' in obj &&
              'name' in obj &&
              'email' in obj;
     }

     // Assertion function
     function assertIsNumber(value: unknown): asserts value is number {
       if (typeof value !== 'number') {
         throw new Error('Expected number');
       }
     }

     // Branded types for type safety
     type UserId = string & { readonly brand: unique symbol };
     type Email = string & { readonly brand: unique symbol };

     function createUserId(id: string): UserId {
       // Validation logic here
       return id as UserId;
     }
     \`\`\`

10. **Discriminated Unions**
    - Use discriminated unions for type-safe state management
    - Implement exhaustiveness checking with never type
    - Create type-safe reducers and state machines
    - Example discriminated union patterns:
      \`\`\`ts
      // State machine with discriminated unions
      type LoadingState =
        | { status: 'idle' }
        | { status: 'loading' }
        | { status: 'success'; data: any }
        | { status: 'error'; error: string };

      function handleState(state: LoadingState) {
        switch (state.status) {
          case 'idle':
            return 'No data loaded';
          case 'loading':
            return 'Loading...';
          case 'success':
            return \`Data: \${state.data}\`;
          case 'error':
            return \`Error: \${state.error}\`;
          default:
            // Exhaustiveness check
            const _exhaustive: never = state;
            return _exhaustive;
        }
      }

      // Action types for reducers
      type Action =
        | { type: 'SET_LOADING' }
        | { type: 'SET_SUCCESS'; payload: any }
        | { type: 'SET_ERROR'; payload: string };
      \`\`\`

---

## Advanced Patterns

11. **Higher-Order Types**
    - Create types that operate on other types
    - Build composable type transformations
    - Implement functional programming patterns in types
    - Example higher-order type patterns:
      \`\`\`ts
      // Functor-like type transformation
      type Functor<F> = {
        map: <A, B>(f: (a: A) => B) => (fa: F<A>) => F<B>;
      };

      // Option type implementation
      type Option<T> = Some<T> | None;
      type Some<T> = { readonly _tag: 'Some'; readonly value: T };
      type None = { readonly _tag: 'None' };

      // Result type for error handling
      type Result<T, E> = Ok<T> | Err<E>;
      type Ok<T> = { readonly _tag: 'Ok'; readonly value: T };
      type Err<E> = { readonly _tag: 'Err'; readonly error: E };

      // Composable validation
      type Validator<T, E> = (input: unknown) => Result<T, E>;
      \`\`\`

12. **Module System and Namespaces**
    - Use proper module organization and exports
    - Implement namespace merging when appropriate
    - Create type-only imports/exports
    - Example module patterns:
      \`\`\`ts
      // Type-only exports
      export type { User, UserCreate, UserUpdate } from './types';

      // Namespace for related types
      namespace API {
        export interface Request<T = unknown> {
          data: T;
          headers: Record<string, string>;
        }

        export interface Response<T = unknown> {
          data: T;
          status: number;
          headers: Record<string, string>;
        }

        export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
      }

      // Declaration merging for extending libraries
      declare global {
        interface Window {
          customProperty: string;
        }
      }
      \`\`\`

---

## Error Handling and Validation

13. **Type-Safe Error Handling**
    - Use Result types instead of throwing exceptions
    - Implement proper error type hierarchies
    - Create composable error handling patterns
    - Example error handling:
      \`\`\`ts
      // Error type hierarchy
      abstract class AppError {
        abstract readonly name: string;
        abstract readonly message: string;
      }

      class ValidationError extends AppError {
        readonly name = 'ValidationError';
        constructor(public readonly message: string, public readonly field: string) {
          super();
        }
      }

      class NetworkError extends AppError {
        readonly name = 'NetworkError';
        constructor(public readonly message: string, public readonly status: number) {
          super();
        }
      }

      // Result type for error handling
      type AsyncResult<T, E extends AppError> = Promise<Result<T, E>>;

      async function fetchUser(id: string): AsyncResult<User, NetworkError | ValidationError> {
        try {
          if (!id) {
            return { _tag: 'Err', error: new ValidationError('ID is required', 'id') };
          }
          const user = await api.getUser(id);
          return { _tag: 'Ok', value: user };
        } catch (error) {
          return { _tag: 'Err', error: new NetworkError('Failed to fetch', 500) };
        }
      }
      \`\`\`

14. **Runtime Validation with Types**
    - Integrate runtime validation with TypeScript types
    - Use libraries like Zod or io-ts for schema validation
    - Ensure type safety at runtime boundaries
    - Example validation patterns:
      \`\`\`ts
      import { z } from 'zod';

      // Schema that generates both runtime validation and types
      const UserSchema = z.object({
        id: z.string().uuid(),
        name: z.string().min(1),
        email: z.string().email(),
        age: z.number().min(0).max(120),
      });

      type User = z.infer<typeof UserSchema>;

      // Type-safe API with validation
      async function createUser(input: unknown): Promise<Result<User, ValidationError>> {
        const parsed = UserSchema.safeParse(input);
        if (!parsed.success) {
          return {
            _tag: 'Err',
            error: new ValidationError('Invalid user data', parsed.error.message)
          };
        }
        return { _tag: 'Ok', value: parsed.data };
      }
      \`\`\`

---

## Performance and Optimization

15. **Type System Performance**
    - Avoid deeply nested conditional types
    - Use type aliases for complex types
    - Implement proper type caching strategies
    - Example performance patterns:
      \`\`\`ts
      // Bad: Deeply nested conditional type
      type BadDeepPick<T, K> = K extends keyof T
        ? K extends string
          ? K extends \`\${infer P}.\${infer R}\`
            ? { [Key in P]: BadDeepPick<T[P], R> }
            : { [Key in K]: T[K] }
          : never
        : never;

      // Good: Simplified with helper types
      type Path<T> = T extends object
        ? { [K in keyof T]: K | \`\${K & string}.\${Path<T[K]> & string}\` }[keyof T]
        : never;

      type DeepPick<T, P extends Path<T>> = P extends \`\${infer K}.\${infer Rest}\`
        ? K extends keyof T ? { [Key in K]: DeepPick<T[K], Rest> } : never
        : P extends keyof T ? { [Key in P]: T[P] } : never;
      \`\`\`

16. **Compilation Optimization**
    - Use project references for large codebases
    - Implement incremental compilation
    - Optimize import/export patterns
    - Example optimization strategies:
      \`\`\`json
      // tsconfig.json for large projects
      {
        "compilerOptions": {
          "incremental": true,
          "composite": true,
          "skipLibCheck": true,
          "declaration": true
        },
        "references": [
          { "path": "./packages/core" },
          { "path": "./packages/ui" },
          { "path": "./packages/utils" }
        ]
      }
      \`\`\`

---

## Testing and Type Safety

17. **Type Testing**
    - Write tests for your types using type-level assertions
    - Use tools like \`tsd\` or \`@typescript-eslint\` for type testing
    - Implement type-safe test helpers
    - Example type testing:
      \`\`\`ts
      // Type-level tests
      type Assert<T extends true> = T;
      type IsEqual<T, U> = T extends U ? U extends T ? true : false : false;

      // Test type transformations
      type Test1 = Assert<IsEqual<Pick<User, 'id'>, { id: string }>>;
      type Test2 = Assert<IsEqual<keyof User, 'id' | 'name' | 'email'>>;

      // Type-safe test utilities
      function expectType<T>(_value: T): void {}
      function expectError<T>(_fn: () => T): void {}

      // Usage in tests
      expectType<string>(user.name);
      expectError(() => user.invalidProperty);
      \`\`\`

18. **Mocking with Type Safety**
    - Create type-safe mocks for testing
    - Use branded types for test data
    - Implement proper mock type checking
    - Example type-safe mocking:
      \`\`\`ts
      // Type-safe mock factory
      function createMock<T>(): { [K in keyof T]: jest.MockedFunction<T[K]> } {
        return {} as any;
      }

      // Type-safe test data builder
      class UserBuilder {
        private user: Partial<User> = {};

        withId(id: string): this {
          this.user.id = id;
          return this;
        }

        withName(name: string): this {
          this.user.name = name;
          return this;
        }

        build(): User {
          return {
            id: this.user.id ?? 'default-id',
            name: this.user.name ?? 'Default Name',
            email: this.user.email ?? 'default@example.com',
          };
        }
      }
      \`\`\`

---

## Summary Checklist

- [ ] Enable strict TypeScript compiler options
- [ ] Use interfaces for extensible objects, types for unions
- [ ] Leverage type inference while being explicit where needed
- [ ] Master generic constraints and conditional types
- [ ] Implement type guards for runtime safety
- [ ] Use discriminated unions for state management
- [ ] Create custom utility types for common patterns
- [ ] Handle errors with Result types instead of exceptions
- [ ] Optimize type system performance for large codebases
- [ ] Write type-level tests for complex type logic
- [ ] Use branded types for domain-specific safety
- [ ] Implement proper module organization and exports

---

Follow these advanced TypeScript patterns to build robust, type-safe applications that scale effectively.`,
	categories: ["typescript", "javascript", "frontend", "backend"],
	tags: ["types", "generics", "type-safety"],
	author: "Community",
	createdAt: "2024-01-26T00:00:00Z",
	applicationMode: "files",
	globs: "*.ts,*.tsx",
};
