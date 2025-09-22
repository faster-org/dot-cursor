import { Rule } from "../types";

export const rule: Rule = {
	id: "rust-web-actix",
	slug: "rust-web-actix",
	title: "Rust Web Development with Actix",
	description: "Build high-performance web applications and APIs using Actix-web framework",
	content: `# Rust Web Actix

This document provides comprehensive guidelines for rust web actix development and best practices.

---

## Actix-Web Core Concepts

1. **Actor-based**
   - Actor-based architecture
   - Implement proper actor-based architecture
   - Follow best practices for optimal results

2. **Asynchronous**
   - Asynchronous request handling
   - Implement proper asynchronous request handling
   - Follow best practices for optimal results

3. **Middleware**
   - Middleware for cross-cutting concerns
   - Implement proper middleware for cross-cutting concerns
   - Follow best practices for optimal results

4. **Application**
   - Application state management
   - Implement proper application state management
   - Follow best practices for optimal results

5. **Route**
   - Route configuration and handlers
   - Implement proper route configuration and handlers
   - Follow best practices for optimal results

---

## Request Handling

6. **Route**
   - Route definitions with macros
   - Implement proper route definitions with macros
   - Follow best practices for optimal results

7. **Path**
   - Path parameters extraction
   - Implement proper path parameters extraction
   - Follow best practices for optimal results

8. **Query**
   - Query parameters parsing
   - Implement proper query parameters parsing
   - Follow best practices for optimal results

9. **JSON**
   - JSON payload handling with serde
   - Implement proper json payload handling with serde
   - Follow best practices for optimal results

10. **Form**
   - Form data processing
   - Implement proper form data processing
   - Follow best practices for optimal results

---

## Response Generation

11. **JSON**
   - JSON responses with serde_json
   - Implement proper json responses with serde_json
   - Follow best practices for optimal results

12. **HTTP**
   - HTTP status codes
   - Implement proper http status codes
   - Follow best practices for optimal results

13. **Custom**
   - Custom headers
   - Implement proper custom headers
   - Follow best practices for optimal results

14. **File**
   - File serving and downloads
   - Implement proper file serving and downloads
   - Follow best practices for optimal results

15. **Template**
   - Template rendering with Tera
   - Implement proper template rendering with tera
   - Follow best practices for optimal results

---

## Middleware & Services

16. **Authentication**
   - Authentication middleware
   - Implement proper authentication middleware
   - Follow best practices for optimal results

17. **CORS**
   - CORS handling
   - Implement proper cors handling
   - Follow best practices for optimal results

18. **Logging**
   - Logging with env_logger
   - Implement proper logging with env_logger
   - Follow best practices for optimal results

19. **Rate**
   - Rate limiting
   - Implement proper rate limiting
   - Follow best practices for optimal results

20. **Request/response**
   - Request/response transformation
   - Implement proper request/response transformation
   - Follow best practices for optimal results

---

## Database Integration

21. **Diesel**
   - Diesel ORM for SQL databases
   - Implement proper diesel orm for sql databases
   - Follow best practices for optimal results

22. **SQLx**
   - SQLx for async database access
   - Implement proper sqlx for async database access
   - Follow best practices for optimal results

23. **Connection**
   - Connection pooling with deadpool
   - Implement proper connection pooling with deadpool
   - Follow best practices for optimal results

24. **Migration**
   - Migration management
   - Implement proper migration management
   - Follow best practices for optimal results

25. **Query**
   - Query optimization
   - Implement proper query optimization
   - Follow best practices for optimal results

---

## Authentication & Security

26. **JWT**
   - JWT token handling
   - Implement proper jwt token handling
   - Follow best practices for optimal results

27. **Session**
   - Session management
   - Implement proper session management
   - Follow best practices for optimal results

28. **Password**
   - Password hashing with argon2
   - Implement proper password hashing with argon2
   - Follow best practices for optimal results

29. **CSRF**
   - CSRF protection
   - Implement proper csrf protection
   - Follow best practices for optimal results

30. **Input**
   - Input validation and sanitization
   - Implement proper input validation and sanitization
   - Follow best practices for optimal results

---

## Error Handling

31. **Custom**
   - Custom error types
   - Implement proper custom error types
   - Follow best practices for optimal results

32. **Error**
   - Error middleware
   - Implement proper error middleware
   - Follow best practices for optimal results

33. **HTTP**
   - HTTP error responses
   - Implement proper http error responses
   - Follow best practices for optimal results

34. **Result<T,**
   - Result<T, E> pattern
   - Implement proper result<t, e> pattern
   - Follow best practices for optimal results

35. **Error**
   - Error logging and monitoring
   - Implement proper error logging and monitoring
   - Follow best practices for optimal results

---

## Testing

36. **Unit**
   - Unit testing handlers
   - Implement proper unit testing handlers
   - Follow best practices for optimal results

37. **Integration**
   - Integration testing with test server
   - Implement proper integration testing with test server
   - Follow best practices for optimal results

38. **Mock**
   - Mock services
   - Implement proper mock services
   - Follow best practices for optimal results

39. **Load**
   - Load testing
   - Implement proper load testing
   - Follow best practices for optimal results

40. **End-to-end**
   - End-to-end testing
   - Implement proper end-to-end testing
   - Follow best practices for optimal results

---

## Performance Optimization

41. **Connection**
   - Connection pooling
   - Implement proper connection pooling
   - Follow best practices for optimal results

42. **Async/await**
   - Async/await patterns
   - Implement proper async/await patterns
   - Follow best practices for optimal results

43. **Response**
   - Response caching
   - Implement proper response caching
   - Follow best practices for optimal results

44. **Compression**
   - Compression middleware
   - Implement proper compression middleware
   - Follow best practices for optimal results

45. **Profiling**
   - Profiling and benchmarking
   - Implement proper profiling and benchmarking
   - Follow best practices for optimal results

---

## Deployment

46. **Docker**
   - Docker containerization
   - Implement proper docker containerization
   - Follow best practices for optimal results

47. **Binary**
   - Binary optimization
   - Implement proper binary optimization
   - Follow best practices for optimal results

48. **Static**
   - Static file serving
   - Implement proper static file serving
   - Follow best practices for optimal results

49. **Reverse**
   - Reverse proxy configuration
   - Implement proper reverse proxy configuration
   - Follow best practices for optimal results

50. **Monitoring**
   - Monitoring and health checks
   - Implement proper monitoring and health checks
   - Follow best practices for optimal results

---

## WebSocket Support

51. **Real-time**
   - Real-time communication
   - Implement proper real-time communication
   - Follow best practices for optimal results

52. **WebSocket**
   - WebSocket actors
   - Implement proper websocket actors
   - Follow best practices for optimal results

53. **Message**
   - Message broadcasting
   - Implement proper message broadcasting
   - Follow best practices for optimal results

54. **Connection**
   - Connection management
   - Implement proper connection management
   - Follow best practices for optimal results

55. **Integration**
   - Integration with frontend
   - Implement proper integration with frontend
   - Follow best practices for optimal results

---

## API Development

56. **RESTful**
   - RESTful API design
   - Implement proper restful api design
   - Follow best practices for optimal results

57. **OpenAPI**
   - OpenAPI documentation
   - Implement proper openapi documentation
   - Follow best practices for optimal results

58. **API**
   - API versioning
   - Implement proper api versioning
   - Follow best practices for optimal results

59. **Content**
   - Content negotiation
   - Implement proper content negotiation
   - Follow best practices for optimal results

60. **Rate**
   - Rate limiting and throttling
   - Implement proper rate limiting and throttling
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

Follow these comprehensive guidelines for successful rust web actix implementation.`,
	categories: ["rust", "web", "actix", "backend"],
	tags: ["rust", "actix-web", "web-framework", "async", "api"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
