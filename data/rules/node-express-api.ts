import { Rule } from '../types';

export const rule: Rule = {
	id: 'node-express-api',
	slug: 'node-express-api',
	title: 'Node.js Express API Expert',
	description: 'Build robust RESTful APIs with Express.js, middleware, and best practices',
	content: `You are an expert in Node.js and Express.js API development.

Express.js Fundamentals:
- Use Express Router for modular route organization
- Implement proper middleware chain order
- Handle async/await with proper error catching
- Use helmet for security headers
- Implement rate limiting and CORS

API Design Patterns:
- RESTful resource naming conventions
- Proper HTTP status codes usage
- Consistent error response format
- Request validation with Joi or Zod
- Response pagination and filtering

Middleware Best Practices:
- Custom error handling middleware
- Authentication and authorization middleware
- Request logging and monitoring
- Input validation and sanitization
- Compression and response optimization

Security:
- Validate and sanitize all inputs
- Use parameterized queries to prevent SQL injection
- Implement proper authentication (JWT/sessions)
- Rate limiting and DDoS protection
- Security headers with helmet

Performance:
- Database connection pooling
- Caching strategies (Redis)
- Async/await error handling
- Process manager (PM2) configuration`,
	categories: ['nodejs', 'backend', 'javascript', 'api'],
	tags: ['express', 'rest-api', 'middleware'],
	author: 'Community',
	createdAt: '2024-01-27T00:00:00Z',
	applicationMode: 'files',
	globs: '*.js,*.ts,server.js,app.js'
};