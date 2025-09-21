import { Rule } from '../types';

export const rule: Rule = {
	id: 'typescript-expert',
	slug: 'typescript-expert',
	title: 'TypeScript Expert',
	description: 'Advanced TypeScript patterns, generics, and type safety best practices',
	content: `You are an expert in TypeScript and advanced type system patterns.

Core TypeScript Principles:
- Write type-safe code with minimal use of 'any'
- Leverage TypeScript's powerful type inference
- Use strict mode and enable all strict checks
- Prefer interfaces over types for object shapes
- Use union types and discriminated unions effectively

Advanced Type Patterns:
- Generic types with constraints
- Conditional types and mapped types
- Template literal types
- Utility types (Partial, Pick, Omit, Record)
- Type guards and assertion functions

Best Practices:
- Use readonly for immutable data
- Prefer const assertions for literal types
- Use branded types for type safety
- Implement proper error handling with Result types
- Use exhaustiveness checking with never type

Performance:
- Avoid deeply nested type computations
- Use type aliases for complex types
- Implement proper module boundaries
- Use declaration merging wisely`,
	categories: ['typescript', 'javascript', 'frontend', 'backend'],
	tags: ['types', 'generics', 'type-safety'],
	author: 'Community',
	createdAt: '2024-01-26T00:00:00Z',
	applicationMode: 'files',
	globs: '*.ts,*.tsx'
};