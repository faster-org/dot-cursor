import { Rule } from "../types";

export const rule: Rule = {
	id: "express-nodejs",
	slug: "express-nodejs",
	title: "Express.js Web Framework",
	description: "Build robust web applications and APIs with Express.js and Node.js ecosystem",
	content: `# Express Nodejs

This document provides comprehensive guidelines for express nodejs development and best practices.

---

## Express.js Fundamentals

1. **Application**
   - Application and router setup
   - Implement proper application and router setup
   - Follow best practices for optimal results

2. **Middleware**
   - Middleware function architecture
   - Implement proper middleware function architecture
   - Follow best practices for optimal results

3. **Request**
   - Request and response object handling
   - Implement proper request and response object handling
   - Follow best practices for optimal results

4. **Route**
   - Route parameter and query parsing
   - Implement proper route parameter and query parsing
   - Follow best practices for optimal results

5. **Error**
   - Error handling middleware
   - Implement proper error handling middleware
   - Follow best practices for optimal results

---

## Routing & Middleware

6. **Route**
   - Route definitions and methods
   - Implement proper route definitions and methods
   - Follow best practices for optimal results

7. **Route**
   - Route parameters and wildcards
   - Implement proper route parameters and wildcards
   - Follow best practices for optimal results

8. **Middleware**
   - Middleware execution order
   - Implement proper middleware execution order
   - Follow best practices for optimal results

9. **Custom**
   - Custom middleware development
   - Implement proper custom middleware development
   - Follow best practices for optimal results

10. **Third-party**
   - Third-party middleware integration
   - Implement proper third-party middleware integration
   - Follow best practices for optimal results

---

## API Development

11. **RESTful**
   - RESTful API design principles
   - Implement proper restful api design principles
   - Follow best practices for optimal results

12. **CRUD**
   - CRUD operation implementation
   - Implement proper crud operation implementation
   - Follow best practices for optimal results

13. **JSON**
   - JSON request/response handling
   - Implement proper json request/response handling
   - Follow best practices for optimal results

14. **API**
   - API versioning strategies
   - Implement proper api versioning strategies
   - Follow best practices for optimal results

15. **OpenAPI**
   - OpenAPI documentation
   - Implement proper openapi documentation
   - Follow best practices for optimal results

---

## Request Handling

16. **Body**
   - Body parsing (JSON, form data, files)
   - Implement proper body parsing (json, form data, files)
   - Follow best practices for optimal results

17. **Query**
   - Query string and parameter extraction
   - Implement proper query string and parameter extraction
   - Follow best practices for optimal results

18. **Header**
   - Header manipulation
   - Implement proper header manipulation
   - Follow best practices for optimal results

19. **Cookie**
   - Cookie and session management
   - Implement proper cookie and session management
   - Follow best practices for optimal results

20. **Request**
   - Request validation and sanitization
   - Implement proper request validation and sanitization
   - Follow best practices for optimal results

---

## Response Management

21. **Response**
   - Response status codes and messages
   - Implement proper response status codes and messages
   - Follow best practices for optimal results

22. **JSON**
   - JSON and HTML response formatting
   - Implement proper json and html response formatting
   - Follow best practices for optimal results

23. **File**
   - File downloads and streaming
   - Implement proper file downloads and streaming
   - Follow best practices for optimal results

24. **Response**
   - Response caching headers
   - Implement proper response caching headers
   - Follow best practices for optimal results

25. **Error**
   - Error response standardization
   - Implement proper error response standardization
   - Follow best practices for optimal results

---

## Authentication & Security

26. **JWT**
   - JWT token authentication
   - Implement proper jwt token authentication
   - Follow best practices for optimal results

27. **Session-based**
   - Session-based authentication
   - Implement proper session-based authentication
   - Follow best practices for optimal results

28. **Password**
   - Password hashing and validation
   - Implement proper password hashing and validation
   - Follow best practices for optimal results

29. **CORS**
   - CORS configuration
   - Implement proper cors configuration
   - Follow best practices for optimal results

30. **Security**
   - Security middleware (helmet, rate limiting)
   - Implement proper security middleware (helmet, rate limiting)
   - Follow best practices for optimal results

---

## Database Integration

31. **MongoDB**
   - MongoDB with Mongoose
   - Implement proper mongodb with mongoose
   - Follow best practices for optimal results

32. **PostgreSQL**
   - PostgreSQL with Sequelize/Prisma
   - Implement proper postgresql with sequelize/prisma
   - Follow best practices for optimal results

33. **MySQL**
   - MySQL connection and querying
   - Implement proper mysql connection and querying
   - Follow best practices for optimal results

34. **Redis**
   - Redis for caching and sessions
   - Implement proper redis for caching and sessions
   - Follow best practices for optimal results

35. **Database**
   - Database connection pooling
   - Implement proper database connection pooling
   - Follow best practices for optimal results

---

## Testing Strategies

36. **Unit**
   - Unit testing with Jest
   - Implement proper unit testing with jest
   - Follow best practices for optimal results

37. **Integration**
   - Integration testing with Supertest
   - Implement proper integration testing with supertest
   - Follow best practices for optimal results

38. **API**
   - API endpoint testing
   - Implement proper api endpoint testing
   - Follow best practices for optimal results

39. **Mock**
   - Mock database operations
   - Implement proper mock database operations
   - Follow best practices for optimal results

40. **Test**
   - Test environment setup
   - Implement proper test environment setup
   - Follow best practices for optimal results

---

## Error Handling

41. **Global**
   - Global error handling middleware
   - Implement proper global error handling middleware
   - Follow best practices for optimal results

42. **Custom**
   - Custom error classes
   - Implement proper custom error classes
   - Follow best practices for optimal results

43. **Async**
   - Async error handling
   - Implement proper async error handling
   - Follow best practices for optimal results

44. **Error**
   - Error logging and monitoring
   - Implement proper error logging and monitoring
   - Follow best practices for optimal results

45. **Graceful**
   - Graceful error responses
   - Implement proper graceful error responses
   - Follow best practices for optimal results

---

## Performance Optimization

46. **Response**
   - Response compression (gzip)
   - Implement proper response compression (gzip)
   - Follow best practices for optimal results

47. **Caching**
   - Caching strategies
   - Implement proper caching strategies
   - Follow best practices for optimal results

48. **Database**
   - Database query optimization
   - Implement proper database query optimization
   - Follow best practices for optimal results

49. **Memory**
   - Memory leak prevention
   - Implement proper memory leak prevention
   - Follow best practices for optimal results

50. **Cluster**
   - Cluster mode for scaling
   - Implement proper cluster mode for scaling
   - Follow best practices for optimal results

---

## Template Engines

51. **EJS**
   - EJS template rendering
   - Implement proper ejs template rendering
   - Follow best practices for optimal results

52. **Handlebars**
   - Handlebars integration
   - Implement proper handlebars integration
   - Follow best practices for optimal results

53. **Pug**
   - Pug template engine
   - Implement proper pug template engine
   - Follow best practices for optimal results

54. **Static**
   - Static file serving
   - Implement proper static file serving
   - Follow best practices for optimal results

55. **Asset**
   - Asset management
   - Implement proper asset management
   - Follow best practices for optimal results

---

## WebSocket Integration

56. **Socket.IO**
   - Socket.IO implementation
   - Implement proper socket.io implementation
   - Follow best practices for optimal results

57. **Real-time**
   - Real-time communication
   - Implement proper real-time communication
   - Follow best practices for optimal results

58. **WebSocket**
   - WebSocket authentication
   - Implement proper websocket authentication
   - Follow best practices for optimal results

59. **Room**
   - Room and namespace management
   - Implement proper room and namespace management
   - Follow best practices for optimal results

60. **Event-driven**
   - Event-driven architecture
   - Implement proper event-driven architecture
   - Follow best practices for optimal results

---

## Deployment & Production

61. **Environment**
   - Environment configuration
   - Implement proper environment configuration
   - Follow best practices for optimal results

62. **Process**
   - Process management with PM2
   - Implement proper process management with pm2
   - Follow best practices for optimal results

63. **Docker**
   - Docker containerization
   - Implement proper docker containerization
   - Follow best practices for optimal results

64. **Cloud**
   - Cloud deployment (AWS, Heroku)
   - Implement proper cloud deployment (aws, heroku)
   - Follow best practices for optimal results

65. **Monitoring**
   - Monitoring and logging
   - Implement proper monitoring and logging
   - Follow best practices for optimal results

---

## Advanced Features

66. **Custom**
   - Custom middleware development
   - Implement proper custom middleware development
   - Follow best practices for optimal results

67. **Plugin**
   - Plugin architecture
   - Implement proper plugin architecture
   - Follow best practices for optimal results

68. **Microservices**
   - Microservices integration
   - Implement proper microservices integration
   - Follow best practices for optimal results

69. **API**
   - API gateway patterns
   - Implement proper api gateway patterns
   - Follow best practices for optimal results

70. **Event-driven**
   - Event-driven programming
   - Implement proper event-driven programming
   - Follow best practices for optimal results

---

## Security Best Practices

71. **Input**
   - Input validation and sanitization
   - Implement proper input validation and sanitization
   - Follow best practices for optimal results

72. **SQL**
   - SQL injection prevention
   - Implement proper sql injection prevention
   - Follow best practices for optimal results

73. **XSS**
   - XSS protection
   - Implement proper xss protection
   - Follow best practices for optimal results

74. **CSRF**
   - CSRF token implementation
   - Implement proper csrf token implementation
   - Follow best practices for optimal results

75. **Secure**
   - Secure headers configuration
   - Implement proper secure headers configuration
   - Follow best practices for optimal results

---

## Development Tools

76. **Nodemon**
   - Nodemon for development
   - Implement proper nodemon for development
   - Follow best practices for optimal results

77. **Debug**
   - Debug module for logging
   - Implement proper debug module for logging
   - Follow best practices for optimal results

78. **ESLint**
   - ESLint and Prettier setup
   - Implement proper eslint and prettier setup
   - Follow best practices for optimal results

79. **Hot**
   - Hot reload configuration
   - Implement proper hot reload configuration
   - Follow best practices for optimal results

80. **API**
   - API testing with Postman
   - Implement proper api testing with postman
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

Follow these comprehensive guidelines for successful express nodejs implementation.`,
	categories: ["express", "nodejs", "web-framework", "backend"],
	tags: ["express", "nodejs", "web-framework", "api", "middleware"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
