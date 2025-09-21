import { Rule } from "../types";

export const rule: Rule = {
	id: "graphql-apollo",
	slug: "graphql-apollo",
	title: "GraphQL with Apollo",
	description: "Build flexible APIs with GraphQL and Apollo Server/Client ecosystem",
	content: `You are an expert in GraphQL development using Apollo Server and Apollo Client.

GraphQL Fundamentals:
- Schema definition with SDL (Schema Definition Language)
- Query, Mutation, and Subscription operations
- Scalar types and custom scalars
- Object types and interfaces
- Input types and enums

Schema Design:
- Schema-first vs code-first approaches
- Type relationships and connections
- Pagination patterns (cursor-based, offset)
- Union types for polymorphic data
- Directive usage for schema enhancement

Resolvers:
- Resolver function implementation
- Context object for request data
- Parent-child resolver relationships
- Async resolver patterns
- Error handling in resolvers

Apollo Server:
- Server setup and configuration
- Middleware integration
- Plugin system utilization
- Schema stitching and federation
- Subscription implementation with WebSockets

Data Sources:
- REST API integration with RESTDataSource
- Database integration patterns
- Caching strategies with DataLoader
- Batch loading for N+1 problem prevention
- Custom data source implementation

Authentication & Authorization:
- JWT token validation
- Context-based authentication
- Field-level authorization
- Role-based access control
- Schema directive authorization

Apollo Client:
- Client setup and configuration
- Query execution with useQuery
- Mutation handling with useMutation
- Subscription management
- Local state management

Caching:
- Apollo Client InMemoryCache
- Cache policies and fetch policies
- Cache updates after mutations
- Optimistic updates
- Cache persistence

Error Handling:
- GraphQL error formatting
- Client-side error handling
- Error boundaries in React
- Network error recovery
- Partial error responses

Performance Optimization:
- Query optimization and analysis
- DataLoader for batch loading
- Query complexity analysis
- Persisted queries
- Automatic persisted queries (APQ)

Testing:
- Schema testing with graphql-tools
- Resolver unit testing
- Integration testing with test server
- Client-side testing with MockedProvider
- End-to-end testing

Real-time Features:
- Subscription implementation
- WebSocket transport
- Real-time data synchronization
- Live query alternatives
- Push notification integration

Development Tools:
- GraphQL Playground for testing
- Apollo Studio for monitoring
- Schema registry and versioning
- Performance monitoring
- Error tracking and analytics`,
	categories: ["graphql", "apollo", "api", "backend"],
	tags: ["graphql", "apollo", "api-design", "real-time", "schema"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "files",
	globs: "*.graphql,*.gql,*.ts,*.js,schema.graphql",
};
