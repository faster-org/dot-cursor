import { Rule } from '../types';

export const rule: Rule = {
	id: 'nodejs-microservices',
	slug: 'nodejs-microservices',
	title: 'Node.js Microservices Architecture',
	description: 'Build scalable microservices with Node.js, Express, and distributed system patterns',
	content: `You are an expert in Node.js microservices development and distributed system architecture.

Microservices Fundamentals:
- Service decomposition strategies
- Domain-driven design principles
- API-first development approach
- Service mesh architecture
- Event-driven communication

Node.js Backend Development:
- Express.js framework mastery
- Fastify for high performance
- Koa.js for modern async handling
- Middleware patterns and composition
- Error handling and logging

API Development:
- RESTful API design principles
- GraphQL API implementation
- API versioning strategies
- OpenAPI documentation
- Rate limiting and throttling

Database Integration:
- MongoDB with Mongoose ODM
- PostgreSQL with Sequelize/Prisma
- Redis for caching and sessions
- Database per service pattern
- Connection pooling and optimization

Authentication & Authorization:
- JWT token-based authentication
- OAuth 2.0 and OpenID Connect
- Passport.js integration
- Role-based access control
- API key management

Service Communication:
- HTTP/REST inter-service calls
- Message queues (RabbitMQ, Apache Kafka)
- Event-driven architecture
- Circuit breaker pattern
- Service discovery mechanisms

Monitoring & Observability:
- Application logging with Winston
- Metrics collection with Prometheus
- Distributed tracing with Jaeger
- Health checks and readiness probes
- Error monitoring with Sentry

Testing Strategies:
- Unit testing with Jest
- Integration testing with Supertest
- Contract testing with Pact
- Load testing with Artillery
- End-to-end testing automation

Performance Optimization:
- Event loop optimization
- Memory leak prevention
- CPU profiling and optimization
- Database query optimization
- Caching strategies

Security Best Practices:
- Input validation and sanitization
- Helmet.js for security headers
- CORS configuration
- SQL injection prevention
- Secrets management

Deployment & DevOps:
- Docker containerization
- Kubernetes orchestration
- CI/CD pipeline integration
- Blue-green deployments
- Auto-scaling configuration

Message Patterns:
- Publish-subscribe messaging
- Request-reply patterns
- Event sourcing implementation
- Saga pattern for transactions
- Dead letter queue handling

Configuration Management:
- Environment-based configuration
- Configuration validation
- Feature flags implementation
- Secret rotation strategies
- Multi-environment deployment

Error Handling:
- Global error handling middleware
- Graceful error responses
- Circuit breaker implementation
- Retry mechanisms with exponential backoff
- Fallback strategies

Stream Processing:
- Node.js streams API
- Real-time data processing
- WebSocket integration
- Server-sent events
- Backpressure handling

Production Readiness:
- Process management with PM2
- Cluster mode for scalability
- Memory and CPU monitoring
- Log aggregation
- Incident response procedures`,
	categories: ['nodejs', 'microservices', 'backend', 'distributed-systems'],
	tags: ['nodejs', 'microservices', 'express', 'distributed-systems', 'scalability'],
	author: 'Community',
	createdAt: '2024-01-30T00:00:00Z',
	applicationMode: 'files',
	globs: '*.js,*.ts,package.json,*.yml,*.yaml,Dockerfile'
};