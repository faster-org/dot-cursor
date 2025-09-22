import { Rule } from "../types";

export const rule: Rule = {
	id: "python-fastapi",
	slug: "python-fastapi",
	title: "Python FastAPI Development",
	description: "Expert in Python, FastAPI, async programming, and REST API development",
	content: `# Python FastAPI Development Best Practices

Comprehensive guide for building production-ready APIs with FastAPI, async Python, and modern backend development patterns.

---

## Core Principles

1. **Type-First Development**
   - Use Python 3.8+ type hints for all function parameters and return values
   - Leverage Pydantic models for request/response validation
   - Enable strict type checking with mypy in your development workflow
   - Example:
     \`\`\`python
     from typing import List, Optional
     from pydantic import BaseModel

     class UserCreate(BaseModel):
         username: str
         email: str
         password: str

     class UserResponse(BaseModel):
         id: int
         username: str
         email: str
         is_active: bool
     \`\`\`

2. **Async-First Architecture**
   - Use async/await for all I/O operations (database, HTTP requests, file operations)
   - Implement async database sessions with SQLAlchemy
   - Use async HTTP client libraries like httpx for external API calls
   - Example:
     \`\`\`python
     @app.get("/users/{user_id}")
     async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
         user = await db.get(User, user_id)
         if not user:
             raise HTTPException(status_code=404, detail="User not found")
         return user
     \`\`\`

3. **Clean Code Standards**
   - Follow PEP 8 style guidelines consistently
   - Use black for code formatting and isort for import organization
   - Implement comprehensive docstrings for all public functions
   - Keep functions small and focused on single responsibilities

---

## Project Structure

4. **Modular Application Architecture**
   - Organize code into logical modules (routers, models, schemas, services)
   - Separate business logic from API logic
   - Example structure:
     \`\`\`
     app/
       __init__.py
       main.py              # FastAPI app instance
       config.py            # Configuration settings
       dependencies.py      # Shared dependencies
       models/              # SQLAlchemy models
         __init__.py
         user.py
         product.py
       schemas/             # Pydantic schemas
         __init__.py
         user.py
         product.py
       routers/             # API route handlers
         __init__.py
         users.py
         products.py
       services/            # Business logic
         __init__.py
         user_service.py
         product_service.py
       tests/               # Test modules
         __init__.py
         test_users.py
     \`\`\`

5. **Configuration Management**
   - Use Pydantic BaseSettings for environment-based configuration
   - Keep sensitive data in environment variables
   - Implement different configs for development, testing, and production
   - Example:
     \`\`\`python
     from pydantic import BaseSettings

     class Settings(BaseSettings):
         database_url: str
         secret_key: str
         algorithm: str = "HS256"
         access_token_expire_minutes: int = 30

         class Config:
             env_file = ".env"

     settings = Settings()
     \`\`\`

---

## API Design Patterns

6. **RESTful Resource Design**
   - Use appropriate HTTP methods (GET, POST, PUT, PATCH, DELETE)
   - Implement consistent URL patterns and naming conventions
   - Return appropriate HTTP status codes
   - Example:
     \`\`\`python
     from fastapi import APIRouter, status

     router = APIRouter(prefix="/api/v1/users", tags=["users"])

     @router.post("/", status_code=status.HTTP_201_CREATED)
     async def create_user(user: UserCreate) -> UserResponse:
         # Implementation
         pass

     @router.get("/{user_id}")
     async def get_user(user_id: int) -> UserResponse:
         # Implementation
         pass
     \`\`\`

7. **Request/Response Models**
   - Create separate Pydantic models for create, update, and response operations
   - Use Field() for validation constraints and documentation
   - Implement proper error response models
   - Example:
     \`\`\`python
     from pydantic import BaseModel, Field, EmailStr

     class UserBase(BaseModel):
         username: str = Field(..., min_length=3, max_length=50)
         email: EmailStr

     class UserCreate(UserBase):
         password: str = Field(..., min_length=8)

     class UserUpdate(BaseModel):
         username: Optional[str] = Field(None, min_length=3, max_length=50)
         email: Optional[EmailStr] = None

     class UserResponse(UserBase):
         id: int
         is_active: bool
         created_at: datetime
     \`\`\`

8. **Dependency Injection**
   - Use FastAPI's dependency injection system for shared logic
   - Create reusable dependencies for database sessions, authentication, and validation
   - Implement proper dependency scoping
   - Example:
     \`\`\`python
     from fastapi import Depends, HTTPException
     from sqlalchemy.ext.asyncio import AsyncSession

     async def get_db() -> AsyncSession:
         async with async_session() as session:
             yield session

     async def get_current_user(
         token: str = Depends(oauth2_scheme),
         db: AsyncSession = Depends(get_db)
     ) -> User:
         # Token validation logic
         pass
     \`\`\`

---

## Database Integration

9. **SQLAlchemy Async Patterns**
   - Use asyncio-compatible database drivers (asyncpg for PostgreSQL)
   - Implement async session management
   - Use select() for queries instead of legacy query() methods
   - Example:
     \`\`\`python
     from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
     from sqlalchemy.orm import selectinload
     from sqlalchemy import select

     async def get_user_with_posts(db: AsyncSession, user_id: int):
         stmt = select(User).options(selectinload(User.posts)).where(User.id == user_id)
         result = await db.execute(stmt)
         return result.scalar_one_or_none()
     \`\`\`

10. **Database Models and Relationships**
    - Define clear SQLAlchemy models with proper relationships
    - Use appropriate column types and constraints
    - Implement proper indexing for performance
    - Example:
      \`\`\`python
      from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
      from sqlalchemy.orm import relationship

      class User(Base):
          __tablename__ = "users"

          id = Column(Integer, primary_key=True)
          username = Column(String(50), unique=True, nullable=False, index=True)
          email = Column(String(100), unique=True, nullable=False, index=True)
          created_at = Column(DateTime, default=datetime.utcnow)

          posts = relationship("Post", back_populates="author")
      \`\`\`

11. **Database Migrations**
    - Use Alembic for database schema migrations
    - Create meaningful migration messages and version control
    - Test migrations in development before applying to production
    - Example migration workflow:
      \`\`\`bash
      alembic revision --autogenerate -m "Add user posts relationship"
      alembic upgrade head
      \`\`\`

---

## Authentication and Security

12. **JWT Authentication**
    - Implement secure JWT token generation and validation
    - Use proper token expiration and refresh mechanisms
    - Store sensitive data securely (never in JWT payload)
    - Example:
      \`\`\`python
      from jose import JWTError, jwt
      from passlib.context import CryptContext

      pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

      def create_access_token(data: dict):
          to_encode = data.copy()
          expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
          to_encode.update({"exp": expire})
          return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
      \`\`\`

13. **Password Security**
    - Hash passwords using bcrypt with appropriate rounds
    - Implement password strength validation
    - Never store plain text passwords
    - Use secure password reset mechanisms

14. **API Security Headers**
    - Implement CORS properly for cross-origin requests
    - Add security headers for production deployment
    - Use HTTPS in production environments
    - Example:
      \`\`\`python
      from fastapi.middleware.cors import CORSMiddleware

      app.add_middleware(
          CORSMiddleware,
          allow_origins=["https://yourdomain.com"],
          allow_credentials=True,
          allow_methods=["GET", "POST", "PUT", "DELETE"],
          allow_headers=["*"],
      )
      \`\`\`

---

## Error Handling and Validation

15. **Custom Exception Handling**
    - Create custom exception classes for different error types
    - Implement global exception handlers
    - Return consistent error response formats
    - Example:
      \`\`\`python
      from fastapi import HTTPException
      from fastapi.exceptions import RequestValidationError
      from fastapi.responses import JSONResponse

      class UserNotFoundError(Exception):
          pass

      @app.exception_handler(UserNotFoundError)
      async def user_not_found_handler(request, exc):
          return JSONResponse(
              status_code=404,
              content={"error": "User not found", "detail": str(exc)}
          )
      \`\`\`

16. **Input Validation**
    - Use Pydantic validators for complex validation logic
    - Implement custom validators for business rules
    - Provide clear error messages for validation failures
    - Example:
      \`\`\`python
      from pydantic import validator

      class UserCreate(BaseModel):
          username: str
          email: str
          age: int

          @validator('age')
          def validate_age(cls, v):
              if v < 18:
                  raise ValueError('User must be at least 18 years old')
              return v
      \`\`\`

---

## Performance Optimization

17. **Database Query Optimization**
    - Use eager loading to prevent N+1 query problems
    - Implement proper database indexing
    - Use connection pooling for production deployments
    - Monitor and profile database queries

18. **Caching Strategies**
    - Implement Redis caching for frequently accessed data
    - Use appropriate cache expiration strategies
    - Cache expensive computations and external API calls
    - Example:
      \`\`\`python
      import redis
      from functools import wraps

      redis_client = redis.Redis(host='localhost', port=6379, db=0)

      def cache_result(expiration: int = 300):
          def decorator(func):
              @wraps(func)
              async def wrapper(*args, **kwargs):
                  cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
                  cached = redis_client.get(cache_key)
                  if cached:
                      return json.loads(cached)
                  result = await func(*args, **kwargs)
                  redis_client.setex(cache_key, expiration, json.dumps(result))
                  return result
              return wrapper
          return decorator
      \`\`\`

19. **Background Tasks**
    - Use FastAPI background tasks for non-blocking operations
    - Implement Celery for complex background job processing
    - Handle task failures and retries appropriately
    - Example:
      \`\`\`python
      from fastapi import BackgroundTasks

      def send_email_notification(email: str, message: str):
          # Email sending logic
          pass

      @app.post("/users/")
      async def create_user(user: UserCreate, background_tasks: BackgroundTasks):
          # Create user logic
          background_tasks.add_task(send_email_notification, user.email, "Welcome!")
          return {"message": "User created"}
      \`\`\`

---

## Testing

20. **Test Structure**
    - Write comprehensive unit tests for all business logic
    - Implement integration tests for API endpoints
    - Use pytest with async support for testing
    - Example:
      \`\`\`python
      import pytest
      from httpx import AsyncClient

      @pytest.mark.asyncio
      async def test_create_user():
          async with AsyncClient(app=app, base_url="http://test") as ac:
              response = await ac.post("/users/", json={
                  "username": "testuser",
                  "email": "test@example.com",
                  "password": "testpass123"
              })
          assert response.status_code == 201
          assert response.json()["username"] == "testuser"
      \`\`\`

21. **Test Database Management**
    - Use separate test databases for isolation
    - Implement database fixtures for test data
    - Clean up test data after each test run

---

## Production Deployment

22. **Docker Containerization**
    - Create optimized Docker images for production
    - Use multi-stage builds to minimize image size
    - Implement proper health checks
    - Example Dockerfile:
      \`\`\`dockerfile
      FROM python:3.11-slim

      WORKDIR /app
      COPY requirements.txt .
      RUN pip install --no-cache-dir -r requirements.txt

      COPY . .
      EXPOSE 8000

      CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
      \`\`\`

23. **Environment Configuration**
    - Use environment variables for all configuration
    - Implement proper logging configuration
    - Set up monitoring and alerting for production

---

## Summary Checklist

- [ ] Use type hints and Pydantic models throughout
- [ ] Implement async/await for all I/O operations
- [ ] Structure project with clear separation of concerns
- [ ] Use dependency injection for shared logic
- [ ] Implement proper authentication and authorization
- [ ] Handle errors consistently with custom exceptions
- [ ] Optimize database queries and implement caching
- [ ] Write comprehensive tests for all functionality
- [ ] Use proper security headers and HTTPS
- [ ] Configure production deployment with Docker
- [ ] Implement monitoring and logging

---

Follow these practices to build robust, scalable, and maintainable FastAPI applications.`,
	categories: ["python", "backend", "api"],
	tags: ["fastapi", "async", "rest-api"],
	author: "Community",
	createdAt: "2024-02-01T00:00:00Z",
	applicationMode: "intelligent",
	globs: "*.py",
};
