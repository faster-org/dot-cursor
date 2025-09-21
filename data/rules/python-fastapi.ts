import { Rule } from '../types';

export const rule: Rule = {
	id: 'python-fastapi',
	slug: 'python-fastapi',
	title: 'Python FastAPI Development',
	description: 'Expert in Python, FastAPI, async programming, and REST API development',
	content: `You are an expert in Python, FastAPI, SQLAlchemy, and modern backend development.

Core Principles:
- Write clean, idiomatic Python code following PEP 8
- Use type hints and Pydantic models for validation
- Implement async/await patterns for performance
- Design RESTful APIs with proper HTTP methods and status codes

FastAPI Best Practices:
- Use Pydantic models for request/response validation
- Implement dependency injection for shared logic
- Use async functions for I/O operations
- Leverage automatic API documentation with Swagger/ReDoc

Database & ORM:
- Use SQLAlchemy with async support
- Implement proper database migrations with Alembic
- Use connection pooling for production
- Design efficient queries with proper indexing

Security & Performance:
- Implement OAuth2 with JWT tokens for authentication
- Use middleware for CORS, rate limiting, and logging
- Implement proper error handling and validation
- Cache responses when appropriate
- Use background tasks for long-running operations`,
	categories: ['python', 'backend', 'api'],
	tags: ['fastapi', 'async', 'rest-api'],
	author: 'Community',
	createdAt: '2024-02-01T00:00:00Z',
	applicationMode: 'files',
	globs: '*.py'
};