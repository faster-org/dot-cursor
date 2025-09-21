import { Rule } from '../types';

export const rule: Rule = {
	id: 'csharp-dotnet',
	slug: 'csharp-dotnet',
	title: 'C# .NET Development',
	description: 'Build modern applications with C# and .NET ecosystem including ASP.NET Core',
	content: `You are an expert in C# and .NET development, including ASP.NET Core and modern .NET features.

.NET Core Fundamentals:
- Cross-platform development with .NET 6+
- Dependency injection container
- Configuration system with appsettings.json
- Logging with ILogger interface
- Hosting model and application lifecycle

ASP.NET Core Web APIs:
- Controller-based APIs with [ApiController]
- Minimal APIs for lightweight endpoints
- Model binding and validation
- Action filters for cross-cutting concerns
- Content negotiation and media types

Entity Framework Core:
- Code-first approach with DbContext
- LINQ queries for data access
- Migrations for database schema changes
- Relationships and navigation properties
- Performance optimization with Include/ThenInclude

Authentication & Authorization:
- JWT bearer token authentication
- Identity framework for user management
- Role-based and policy-based authorization
- OAuth2 and OpenID Connect
- Cookie and token authentication

Async Programming:
- async/await pattern
- Task and Task<T> for asynchronous operations
- ConfigureAwait for library code
- Parallel programming with PLINQ
- Cancellation tokens for cooperative cancellation

Testing:
- Unit testing with xUnit, NUnit, or MSTest
- Test-driven development (TDD)
- Mocking with Moq framework
- Integration testing with TestServer
- Behavior-driven development with SpecFlow

Performance & Optimization:
- Memory management and garbage collection
- Span<T> and Memory<T> for high-performance scenarios
- Response caching and output caching
- Connection pooling and resource management
- Profiling with dotMemory and PerfView

Modern C# Features:
- Records for immutable data types
- Pattern matching with switch expressions
- Nullable reference types
- Global using statements
- File-scoped namespaces

Microservices:
- Service communication with HttpClient
- Health checks and readiness probes
- Message queues with MassTransit
- Distributed caching with Redis
- Service discovery and load balancing

Deployment:
- Docker containerization
- Kubernetes deployment
- Azure App Service deployment
- CI/CD with GitHub Actions
- Application monitoring with Application Insights

Error Handling:
- Exception handling with try-catch-finally
- Custom exceptions and error types
- Global exception handling middleware
- Logging best practices
- Error monitoring and alerting

Architecture Patterns:
- Clean Architecture principles
- CQRS (Command Query Responsibility Segregation)
- Repository and Unit of Work patterns
- Domain-driven design (DDD)
- Mediator pattern with MediatR`,
	categories: ['csharp', 'dotnet', 'backend', 'aspnet-core'],
	tags: ['csharp', 'dotnet', 'aspnet-core', 'entity-framework', 'web-api'],
	author: 'Community',
	createdAt: '2024-01-30T00:00:00Z',
	applicationMode: 'files',
	globs: '*.cs,*.csproj,appsettings.json,Program.cs,Startup.cs'
};