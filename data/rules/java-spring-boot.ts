import { Rule } from '../types';

export const rule: Rule = {
	id: 'java-spring-boot',
	slug: 'java-spring-boot',
	title: 'Java Spring Boot Development',
	description: 'Build enterprise-grade applications with Spring Boot framework and ecosystem',
	content: `You are an expert in Java Spring Boot development and the Spring ecosystem.

Spring Boot Fundamentals:
- Auto-configuration and starter dependencies
- Application properties and profiles
- Dependency injection with @Autowired
- Component scanning and bean configuration
- Actuator for monitoring and management

Web Development:
- REST controllers with @RestController
- Request mapping with @GetMapping, @PostMapping
- Path variables and request parameters
- Request/response body handling with @RequestBody/@ResponseBody
- Exception handling with @ControllerAdvice

Data Access:
- Spring Data JPA for database operations
- Repository pattern with JpaRepository
- Custom query methods with @Query
- Database migrations with Flyway/Liquibase
- Transaction management with @Transactional

Security:
- Spring Security for authentication/authorization
- JWT token-based authentication
- Method-level security with @PreAuthorize
- CORS configuration
- OAuth2 integration

Testing:
- Unit testing with JUnit 5 and Mockito
- Integration testing with @SpringBootTest
- Web layer testing with @WebMvcTest
- Data layer testing with @DataJpaTest
- Test containers for integration tests

Configuration:
- Externalized configuration with application.yml
- Environment-specific profiles
- Configuration properties with @ConfigurationProperties
- Validation with Bean Validation (JSR-303)
- Conditional configuration

Microservices:
- Spring Cloud for microservice architecture
- Service discovery with Eureka
- Load balancing with Ribbon
- Circuit breaker with Hystrix/Resilience4j
- API Gateway with Spring Cloud Gateway

Message Handling:
- Async processing with @Async
- Event handling with ApplicationEventPublisher
- Message queues with RabbitMQ/Apache Kafka
- JMS for enterprise messaging
- WebSocket for real-time communication

Caching:
- Spring Cache abstraction
- Redis for distributed caching
- Cache eviction strategies
- Cache-aside pattern
- Performance optimization

Monitoring & Observability:
- Spring Boot Actuator endpoints
- Micrometer for metrics collection
- Distributed tracing with Sleuth
- Log aggregation with Logback
- Health checks and readiness probes

Best Practices:
- Layered architecture (Controller, Service, Repository)
- DTO pattern for data transfer
- Exception handling strategies
- Code organization and package structure
- Performance tuning and optimization`,
	categories: ['java', 'spring-boot', 'backend', 'enterprise'],
	tags: ['java', 'spring-boot', 'rest-api', 'jpa', 'microservices'],
	author: 'Community',
	createdAt: '2024-01-30T00:00:00Z',
	applicationMode: 'files',
	globs: '*.java,pom.xml,application.yml,application.properties'
};