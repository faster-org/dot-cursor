import { Rule } from "../types";

export const rule: Rule = {
	id: "golang-web-api",
	slug: "golang-web-api",
	title: "Go Web API Development",
	description: "Build robust REST APIs and web services with Go standard library and frameworks",
	content: `# Golang Web Api

This document provides comprehensive guidelines for golang web api development and best practices.

---

## HTTP Server Fundamentals

1. **Use**
   - Use net/http package for basic servers
   - Implement proper use net/http package for basic servers
   - Follow best practices for optimal results

2. **Implement**
   - Implement custom ServeMux for routing
   - Implement proper implement custom servemux for routing
   - Follow best practices for optimal results

3. **Middleware**
   - Middleware pattern for cross-cutting concerns
   - Implement proper middleware pattern for cross-cutting concerns
   - Follow best practices for optimal results

4. **Context**
   - Context propagation for request scoping
   - Implement proper context propagation for request scoping
   - Follow best practices for optimal results

5. **Graceful**
   - Graceful server shutdown
   - Implement proper graceful server shutdown
   - Follow best practices for optimal results

---

## Popular Frameworks

6. **Gin**
   - Gin for high-performance APIs
   - Implement proper gin for high-performance apis
   - Follow best practices for optimal results

7. **Echo**
   - Echo for minimalist web framework
   - Implement proper echo for minimalist web framework
   - Follow best practices for optimal results

8. **Fiber**
   - Fiber for Express.js-like experience
   - Implement proper fiber for express.js-like experience
   - Follow best practices for optimal results

9. **Chi**
   - Chi for lightweight routing
   - Implement proper chi for lightweight routing
   - Follow best practices for optimal results

10. **Gorilla**
   - Gorilla Mux for flexible routing
   - Implement proper gorilla mux for flexible routing
   - Follow best practices for optimal results

---

## REST API Design

11. **RESTful**
   - RESTful resource naming conventions
   - Implement proper restful resource naming conventions
   - Follow best practices for optimal results

12. **HTTP**
   - HTTP methods: GET, POST, PUT, PATCH, DELETE
   - Implement proper http methods: get, post, put, patch, delete
   - Follow best practices for optimal results

13. **Status**
   - Status codes: 200, 201, 400, 401, 404, 500
   - Implement proper status codes: 200, 201, 400, 401, 404, 500
   - Follow best practices for optimal results

14. **Content**
   - Content negotiation (JSON, XML)
   - Implement proper content negotiation (json, xml)
   - Follow best practices for optimal results

15. **API**
   - API versioning strategies
   - Implement proper api versioning strategies
   - Follow best practices for optimal results

---

## Request/Response Handling

16. **JSON**
   - JSON encoding/decoding with encoding/json
   - Implement proper json encoding/decoding with encoding/json
   - Follow best practices for optimal results

17. **Request**
   - Request validation with validator package
   - Implement proper request validation with validator package
   - Follow best practices for optimal results

18. **Query**
   - Query parameter parsing
   - Implement proper query parameter parsing
   - Follow best practices for optimal results

19. **Form**
   - Form data handling
   - Implement proper form data handling
   - Follow best practices for optimal results

20. **File**
   - File upload processing
   - Implement proper file upload processing
   - Follow best practices for optimal results

---

## Authentication & Authorization

21. **JWT**
   - JWT token implementation
   - Implement proper jwt token implementation
   - Follow best practices for optimal results

22. **OAuth2**
   - OAuth2 integration
   - Implement proper oauth2 integration
   - Follow best practices for optimal results

23. **Session**
   - Session management
   - Implement proper session management
   - Follow best practices for optimal results

24. **Role-based**
   - Role-based access control (RBAC)
   - Implement proper role-based access control (rbac)
   - Follow best practices for optimal results

25. **API**
   - API key authentication
   - Implement proper api key authentication
   - Follow best practices for optimal results

---

## Database Integration

26. **SQL**
   - SQL databases with database/sql
   - Implement proper sql databases with database/sql
   - Follow best practices for optimal results

27. **GORM**
   - GORM for ORM functionality
   - Implement proper gorm for orm functionality
   - Follow best practices for optimal results

28. **Connection**
   - Connection pooling and management
   - Implement proper connection pooling and management
   - Follow best practices for optimal results

29. **Transaction**
   - Transaction handling
   - Implement proper transaction handling
   - Follow best practices for optimal results

30. **Migration**
   - Migration management
   - Implement proper migration management
   - Follow best practices for optimal results

---

## Error Handling

31. **Custom**
   - Custom error types
   - Implement proper custom error types
   - Follow best practices for optimal results

32. **Error**
   - Error wrapping with fmt.Errorf
   - Implement proper error wrapping with fmt.errorf
   - Follow best practices for optimal results

33. **HTTP**
   - HTTP error responses
   - Implement proper http error responses
   - Follow best practices for optimal results

34. **Error**
   - Error logging and monitoring
   - Implement proper error logging and monitoring
   - Follow best practices for optimal results

35. **Panic**
   - Panic recovery middleware
   - Implement proper panic recovery middleware
   - Follow best practices for optimal results

---

## Performance & Optimization

36. **HTTP**
   - HTTP caching headers
   - Implement proper http caching headers
   - Follow best practices for optimal results

37. **Response**
   - Response compression
   - Implement proper response compression
   - Follow best practices for optimal results

38. **Connection**
   - Connection keep-alive
   - Implement proper connection keep-alive
   - Follow best practices for optimal results

39. **Load**
   - Load balancing considerations
   - Implement proper load balancing considerations
   - Follow best practices for optimal results

40. **Profiling**
   - Profiling with pprof
   - Implement proper profiling with pprof
   - Follow best practices for optimal results

---

## Security Best Practices

41. **Input**
   - Input validation and sanitization
   - Implement proper input validation and sanitization
   - Follow best practices for optimal results

42. **SQL**
   - SQL injection prevention
   - Implement proper sql injection prevention
   - Follow best practices for optimal results

43. **XSS**
   - XSS protection
   - Implement proper xss protection
   - Follow best practices for optimal results

44. **CSRF**
   - CSRF protection
   - Implement proper csrf protection
   - Follow best practices for optimal results

45. **Rate**
   - Rate limiting implementation
   - Implement proper rate limiting implementation
   - Follow best practices for optimal results

---

## Testing

46. **HTTP**
   - HTTP handler testing
   - Implement proper http handler testing
   - Follow best practices for optimal results

47. **Integration**
   - Integration testing with httptest
   - Implement proper integration testing with httptest
   - Follow best practices for optimal results

48. **Test**
   - Test doubles and mocking
   - Implement proper test doubles and mocking
   - Follow best practices for optimal results

49. **Benchmark**
   - Benchmark testing
   - Implement proper benchmark testing
   - Follow best practices for optimal results

50. **End-to-end**
   - End-to-end API testing
   - Implement proper end-to-end api testing
   - Follow best practices for optimal results

---

## Documentation

51. **OpenAPI/Swagger**
   - OpenAPI/Swagger integration
   - Implement proper openapi/swagger integration
   - Follow best practices for optimal results

52. **API**
   - API documentation generation
   - Implement proper api documentation generation
   - Follow best practices for optimal results

53. **Code**
   - Code comments and examples
   - Implement proper code comments and examples
   - Follow best practices for optimal results

54. **Postman**
   - Postman collection generation
   - Implement proper postman collection generation
   - Follow best practices for optimal results

55. **Interactive**
   - Interactive API documentation
   - Implement proper interactive api documentation
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

Follow these comprehensive guidelines for successful golang web api implementation.`,
	categories: ["golang", "web", "api", "backend"],
	tags: ["go", "rest-api", "http", "web-server", "gin"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
