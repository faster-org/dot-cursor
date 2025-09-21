import { Rule } from "../types";

export const rule: Rule = {
	id: "grpc-microservices",
	slug: "grpc-microservices",
	title: "gRPC Microservices Communication",
	description: "Build efficient microservices with gRPC protocol and Protocol Buffers",
	content: `You are an expert in gRPC development for microservices communication and distributed systems.

gRPC Fundamentals:
- HTTP/2-based RPC framework
- Protocol Buffers for serialization
- Language-agnostic service definitions
- Code generation for multiple languages
- Efficient binary protocol

Protocol Buffers:
- .proto file syntax and structure
- Message types and field definitions
- Service definitions with RPC methods
- Import statements and package organization
- Backward and forward compatibility

Service Types:
- Unary RPC for request-response
- Server streaming for data streams
- Client streaming for upload scenarios
- Bidirectional streaming for real-time communication
- Error handling and status codes

Code Generation:
- protoc compiler usage
- Language-specific plugins
- Generated client and server code
- Stub and skeleton generation
- Build system integration

Server Implementation:
- Service implementation patterns
- Interceptors for cross-cutting concerns
- Authentication and authorization
- Load balancing and health checks
- Graceful shutdown handling

Client Development:
- Client stub creation and usage
- Connection management and pooling
- Retry policies and circuit breakers
- Deadline and timeout handling
- Asynchronous vs synchronous calls

Streaming Patterns:
- Server streaming for data feeds
- Client streaming for bulk uploads
- Bidirectional streaming for chat applications
- Flow control and backpressure
- Stream lifecycle management

Security:
- TLS/SSL encryption
- Authentication mechanisms (JWT, mTLS)
- Channel credentials configuration
- Interceptor-based security
- Certificate management

Performance Optimization:
- Connection pooling strategies
- Message compression (gzip)
- Keep-alive settings
- Batch processing patterns
- Protocol buffer optimization

Error Handling:
- gRPC status codes
- Error details and metadata
- Retry logic implementation
- Circuit breaker patterns
- Graceful degradation

Service Discovery:
- Service registry integration
- Load balancing algorithms
- Health checking protocols
- Dynamic configuration
- Consul/Etcd integration

Testing:
- Unit testing gRPC services
- Integration testing strategies
- Mock server creation
- Load testing with specialized tools
- Contract testing approaches

Deployment:
- Containerization with Docker
- Kubernetes service mesh integration
- Reverse proxy configuration (Envoy)
- Monitoring and observability
- CI/CD pipeline integration

Language-Specific Implementations:
- Go gRPC server development
- Node.js gRPC client/server
- Python gRPC integration
- Java gRPC with Spring Boot
- C# gRPC with ASP.NET Core

Advanced Features:
- gRPC reflection for dynamic clients
- gRPC-Web for browser integration
- Custom interceptors and middleware
- Protocol buffer extensions
- Streaming optimization techniques`,
	categories: ["grpc", "microservices", "rpc", "distributed-systems"],
	tags: ["grpc", "protobuf", "microservices", "rpc", "streaming"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "files",
	globs: "*.proto,*.go,*.js,*.py,*.java,*.cs",
};
