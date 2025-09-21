import { Rule } from "../types";

export const rule: Rule = {
	id: "rust-web-actix",
	slug: "rust-web-actix",
	title: "Rust Web Development with Actix",
	description: "Build high-performance web applications and APIs using Actix-web framework",
	content: `You are an expert in Rust web development using the Actix-web framework.

Actix-Web Core Concepts:
- Actor-based architecture
- Asynchronous request handling
- Middleware for cross-cutting concerns
- Application state management
- Route configuration and handlers

Request Handling:
- Route definitions with macros
- Path parameters extraction
- Query parameters parsing
- JSON payload handling with serde
- Form data processing

Response Generation:
- JSON responses with serde_json
- HTTP status codes
- Custom headers
- File serving and downloads
- Template rendering with Tera

Middleware & Services:
- Authentication middleware
- CORS handling
- Logging with env_logger
- Rate limiting
- Request/response transformation

Database Integration:
- Diesel ORM for SQL databases
- SQLx for async database access
- Connection pooling with deadpool
- Migration management
- Query optimization

Authentication & Security:
- JWT token handling
- Session management
- Password hashing with argon2
- CSRF protection
- Input validation and sanitization

Error Handling:
- Custom error types
- Error middleware
- HTTP error responses
- Result<T, E> pattern
- Error logging and monitoring

Testing:
- Unit testing handlers
- Integration testing with test server
- Mock services
- Load testing
- End-to-end testing

Performance Optimization:
- Connection pooling
- Async/await patterns
- Response caching
- Compression middleware
- Profiling and benchmarking

Deployment:
- Docker containerization
- Binary optimization
- Static file serving
- Reverse proxy configuration
- Monitoring and health checks

WebSocket Support:
- Real-time communication
- WebSocket actors
- Message broadcasting
- Connection management
- Integration with frontend

API Development:
- RESTful API design
- OpenAPI documentation
- API versioning
- Content negotiation
- Rate limiting and throttling`,
	categories: ["rust", "web", "actix", "backend"],
	tags: ["rust", "actix-web", "web-framework", "async", "api"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "files",
	globs: "*.rs,Cargo.toml",
};
