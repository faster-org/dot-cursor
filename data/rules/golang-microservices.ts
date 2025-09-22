import { Rule } from "../types";

export const rule: Rule = {
	id: "golang-microservices",
	slug: "golang-microservices",
	title: "Go Microservices Architecture",
	description: "Build scalable microservices with Go, gRPC, and cloud-native patterns",
	content: `# Golang Microservices

This document provides comprehensive guidelines for golang microservices development and best practices.

---

## Microservice Design Patterns

1. **Domain-driven**
   - Domain-driven design (DDD) principles
   - Implement proper domain-driven design (ddd) principles
   - Follow best practices for optimal results

2. **Single**
   - Single responsibility per service
   - Implement proper single responsibility per service
   - Follow best practices for optimal results

3. **Database**
   - Database per service pattern
   - Implement proper database per service pattern
   - Follow best practices for optimal results

4. **API**
   - API Gateway for routing and authentication
   - Implement proper api gateway for routing and authentication
   - Follow best practices for optimal results

5. **Service**
   - Service mesh for inter-service communication
   - Implement proper service mesh for inter-service communication
   - Follow best practices for optimal results

---

## Go Best Practices

6. **Use**
   - Use interfaces for dependency injection
   - Implement proper use interfaces for dependency injection
   - Follow best practices for optimal results

7. **Error**
   - Error handling with explicit error returns
   - Implement proper error handling with explicit error returns
   - Follow best practices for optimal results

8. **Context**
   - Context for request lifecycle and cancellation
   - Implement proper context for request lifecycle and cancellation
   - Follow best practices for optimal results

9. **Graceful**
   - Graceful shutdown with signal handling
   - Implement proper graceful shutdown with signal handling
   - Follow best practices for optimal results

10. **Structured**
   - Structured logging with slog or logrus
   - Implement proper structured logging with slog or logrus
   - Follow best practices for optimal results

---

## gRPC & Protocol Buffers

11. **Define**
   - Define services in .proto files
   - Implement proper define services in .proto files
   - Follow best practices for optimal results

12. **Generate**
   - Generate Go code with protoc
   - Implement proper generate go code with protoc
   - Follow best practices for optimal results

13. **Implement**
   - Implement streaming for real-time data
   - Implement proper implement streaming for real-time data
   - Follow best practices for optimal results

14. **Error**
   - Error handling with gRPC status codes
   - Implement proper error handling with grpc status codes
   - Follow best practices for optimal results

15. **Interceptors**
   - Interceptors for cross-cutting concerns
   - Implement proper interceptors for cross-cutting concerns
   - Follow best practices for optimal results

---

## HTTP API Development

16. **Use**
   - Use Gin or Echo for HTTP frameworks
   - Implement proper use gin or echo for http frameworks
   - Follow best practices for optimal results

17. **REST**
   - REST API design principles
   - Implement proper rest api design principles
   - Follow best practices for optimal results

18. **Middleware**
   - Middleware for authentication and logging
   - Implement proper middleware for authentication and logging
   - Follow best practices for optimal results

19. **Request**
   - Request validation and sanitization
   - Implement proper request validation and sanitization
   - Follow best practices for optimal results

20. **OpenAPI/Swagger**
   - OpenAPI/Swagger documentation
   - Implement proper openapi/swagger documentation
   - Follow best practices for optimal results

---

## Database Patterns

21. **Repository**
   - Repository pattern for data access
   - Implement proper repository pattern for data access
   - Follow best practices for optimal results

22. **Database**
   - Database migrations with migrate
   - Implement proper database migrations with migrate
   - Follow best practices for optimal results

23. **Connection**
   - Connection pooling and management
   - Implement proper connection pooling and management
   - Follow best practices for optimal results

24. **Transaction**
   - Transaction handling
   - Implement proper transaction handling
   - Follow best practices for optimal results

25. **Query**
   - Query optimization
   - Implement proper query optimization
   - Follow best practices for optimal results

---

## Service Communication

26. **Synchronous:**
   - Synchronous: HTTP/REST and gRPC
   - Implement proper synchronous: http/rest and grpc
   - Follow best practices for optimal results

27. **Asynchronous:**
   - Asynchronous: Message queues (NATS, RabbitMQ)
   - Implement proper asynchronous: message queues (nats, rabbitmq)
   - Follow best practices for optimal results

28. **Event-driven**
   - Event-driven architecture patterns
   - Implement proper event-driven architecture patterns
   - Follow best practices for optimal results

29. **Circuit**
   - Circuit breaker pattern for resilience
   - Implement proper circuit breaker pattern for resilience
   - Follow best practices for optimal results

30. **Retry**
   - Retry mechanisms with exponential backoff
   - Implement proper retry mechanisms with exponential backoff
   - Follow best practices for optimal results

---

## Configuration & Environment

31. **12-factor**
   - 12-factor app principles
   - Implement proper 12-factor app principles
   - Follow best practices for optimal results

32. **Environment-based**
   - Environment-based configuration
   - Implement proper environment-based configuration
   - Follow best practices for optimal results

33. **Configuration**
   - Configuration validation
   - Implement proper configuration validation
   - Follow best practices for optimal results

34. **Secret**
   - Secret management
   - Implement proper secret management
   - Follow best practices for optimal results

35. **Feature**
   - Feature flags
   - Implement proper feature flags
   - Follow best practices for optimal results

---

## Observability

36. **Structured**
   - Structured logging
   - Implement proper structured logging
   - Follow best practices for optimal results

37. **Metrics**
   - Metrics with Prometheus
   - Implement proper metrics with prometheus
   - Follow best practices for optimal results

38. **Distributed**
   - Distributed tracing with Jaeger
   - Implement proper distributed tracing with jaeger
   - Follow best practices for optimal results

39. **Health**
   - Health checks and readiness probes
   - Implement proper health checks and readiness probes
   - Follow best practices for optimal results

40. **Error**
   - Error monitoring and alerting
   - Implement proper error monitoring and alerting
   - Follow best practices for optimal results

---

## Testing

41. **Unit**
   - Unit tests with testify
   - Implement proper unit tests with testify
   - Follow best practices for optimal results

42. **Integration**
   - Integration tests with test containers
   - Implement proper integration tests with test containers
   - Follow best practices for optimal results

43. **Mock**
   - Mock generation with gomock
   - Implement proper mock generation with gomock
   - Follow best practices for optimal results

44. **Property-based**
   - Property-based testing
   - Implement proper property-based testing
   - Follow best practices for optimal results

45. **Benchmarking**
   - Benchmarking and profiling
   - Implement proper benchmarking and profiling
   - Follow best practices for optimal results

---

## Deployment

46. **Docker**
   - Docker containerization
   - Implement proper docker containerization
   - Follow best practices for optimal results

47. **Kubernetes**
   - Kubernetes deployment manifests
   - Implement proper kubernetes deployment manifests
   - Follow best practices for optimal results

48. **Helm**
   - Helm charts for configuration
   - Implement proper helm charts for configuration
   - Follow best practices for optimal results

49. **CI/CD**
   - CI/CD pipelines
   - Implement proper ci/cd pipelines
   - Follow best practices for optimal results

50. **Blue-green**
   - Blue-green and canary deployments
   - Implement proper blue-green and canary deployments
   - Follow best practices for optimal results

---

## Summary Checklist

- [ ] Core principles implemented
- [ ] Best practices followed
- [ ] Performance optimized
- [ ] Security measures in place
- [ ] Testing strategy implemented
- [ ] Documentation completed
- [ ] Monitoring configured
- [ ] Production deployment ready

---

Follow these comprehensive guidelines for successful golang microservices implementation.`,
	categories: ["golang", "microservices", "backend", "distributed-systems"],
	tags: ["go", "microservices", "grpc", "kubernetes", "cloud-native"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
