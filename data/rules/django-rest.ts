import { Rule } from '../types';

export const rule: Rule = {
	id: 'django-rest',
	slug: 'django-rest',
	title: 'Django REST Framework',
	description: 'Build powerful APIs with Django REST Framework, serializers, and views',
	content: `You are an expert in Django REST Framework (DRF) and Django development.

DRF Core Concepts:
- Use ViewSets for CRUD operations
- Implement proper serializer patterns
- Apply permission classes effectively
- Use pagination for large datasets
- Implement filtering and searching

Serializer Best Practices:
- Use ModelSerializer for model-based APIs
- Implement nested serializers for relationships
- Custom validation methods
- Field-level and object-level validation
- Handle file uploads properly

Authentication & Permissions:
- Token-based authentication
- JWT authentication with Simple JWT
- Custom permission classes
- Object-level permissions
- Rate limiting with throttling

API Design:
- RESTful URL patterns
- Proper HTTP status codes
- Consistent error responses
- API versioning strategies
- Documentation with Swagger/OpenAPI

Performance:
- Database query optimization
- Select_related and prefetch_related
- Caching strategies
- Background tasks with Celery
- Database indexing`,
	categories: ['python', 'django', 'backend', 'api'],
	tags: ['rest-framework', 'serializers', 'viewsets'],
	author: 'Community',
	createdAt: '2024-01-29T00:00:00Z',
	applicationMode: 'files',
	globs: '*.py,views.py,serializers.py,models.py'
};