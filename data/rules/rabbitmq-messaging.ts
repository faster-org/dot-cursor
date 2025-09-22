import { Rule } from "../types";

export const rule: Rule = {
	id: "rabbitmq-messaging",
	slug: "rabbitmq-messaging",
	title: "RabbitMQ Message Broker",
	description: "Implement message queuing and event-driven architecture with RabbitMQ",
	content: `# Rabbitmq Messaging

This document provides comprehensive guidelines for rabbitmq messaging development and best practices.

---

## RabbitMQ Fundamentals

1. **AMQP**
   - AMQP protocol understanding
   - Implement proper amqp protocol understanding
   - Follow best practices for optimal results

2. **Exchange,**
   - Exchange, queue, and binding concepts
   - Implement proper exchange, queue, and binding concepts
   - Follow best practices for optimal results

3. **Producer**
   - Producer and consumer patterns
   - Implement proper producer and consumer patterns
   - Follow best practices for optimal results

4. **Virtual**
   - Virtual hosts and permissions
   - Implement proper virtual hosts and permissions
   - Follow best practices for optimal results

5. **Connection**
   - Connection and channel management
   - Implement proper connection and channel management
   - Follow best practices for optimal results

---

## Exchange Types

6. **Direct**
   - Direct exchange for exact routing
   - Implement proper direct exchange for exact routing
   - Follow best practices for optimal results

7. **Fanout**
   - Fanout exchange for broadcasting
   - Implement proper fanout exchange for broadcasting
   - Follow best practices for optimal results

8. **Topic**
   - Topic exchange for pattern matching
   - Implement proper topic exchange for pattern matching
   - Follow best practices for optimal results

9. **Headers**
   - Headers exchange for complex routing
   - Implement proper headers exchange for complex routing
   - Follow best practices for optimal results

10. **Custom**
   - Custom exchange plugins
   - Implement proper custom exchange plugins
   - Follow best practices for optimal results

---

## Queue Management

11. **Queue**
   - Queue declaration and properties
   - Implement proper queue declaration and properties
   - Follow best practices for optimal results

12. **Durable**
   - Durable vs transient queues
   - Implement proper durable vs transient queues
   - Follow best practices for optimal results

13. **Exclusive**
   - Exclusive and auto-delete queues
   - Implement proper exclusive and auto-delete queues
   - Follow best practices for optimal results

14. **Queue**
   - Queue arguments and policies
   - Implement proper queue arguments and policies
   - Follow best practices for optimal results

15. **Dead**
   - Dead letter queue configuration
   - Implement proper dead letter queue configuration
   - Follow best practices for optimal results

---

## Message Patterns

16. **Publish-subscribe**
   - Publish-subscribe messaging
   - Implement proper publish-subscribe messaging
   - Follow best practices for optimal results

17. **Request-reply**
   - Request-reply patterns
   - Implement proper request-reply patterns
   - Follow best practices for optimal results

18. **Work**
   - Work queue distribution
   - Implement proper work queue distribution
   - Follow best practices for optimal results

19. **RPC**
   - RPC (Remote Procedure Call)
   - Implement proper rpc (remote procedure call)
   - Follow best practices for optimal results

20. **Message**
   - Message routing strategies
   - Implement proper message routing strategies
   - Follow best practices for optimal results

---

## Reliability & Durability

21. **Message**
   - Message persistence configuration
   - Implement proper message persistence configuration
   - Follow best practices for optimal results

22. **Publisher**
   - Publisher confirms and acknowledgments
   - Implement proper publisher confirms and acknowledgments
   - Follow best practices for optimal results

23. **Consumer**
   - Consumer acknowledgments
   - Implement proper consumer acknowledgments
   - Follow best practices for optimal results

24. **Transaction**
   - Transaction support
   - Implement proper transaction support
   - Follow best practices for optimal results

25. **Cluster**
   - Cluster and mirroring setup
   - Implement proper cluster and mirroring setup
   - Follow best practices for optimal results

---

## Performance Optimization

26. **Connection**
   - Connection pooling strategies
   - Implement proper connection pooling strategies
   - Follow best practices for optimal results

27. **Batch**
   - Batch publishing and consuming
   - Implement proper batch publishing and consuming
   - Follow best practices for optimal results

28. **Prefetch**
   - Prefetch and flow control
   - Implement proper prefetch and flow control
   - Follow best practices for optimal results

29. **Memory**
   - Memory and disk usage optimization
   - Implement proper memory and disk usage optimization
   - Follow best practices for optimal results

30. **Network**
   - Network configuration tuning
   - Implement proper network configuration tuning
   - Follow best practices for optimal results

---

## Client Libraries

31. **Java**
   - Java AMQP client implementation
   - Implement proper java amqp client implementation
   - Follow best practices for optimal results

32. **Node.js**
   - Node.js amqplib usage
   - Implement proper node.js amqplib usage
   - Follow best practices for optimal results

33. **Python**
   - Python pika library
   - Implement proper python pika library
   - Follow best practices for optimal results

34. **.NET**
   - .NET RabbitMQ client
   - Implement proper .net rabbitmq client
   - Follow best practices for optimal results

35. **Go**
   - Go amqp091-go library
   - Implement proper go amqp091-go library
   - Follow best practices for optimal results

---

## Clustering & High Availability

36. **Cluster**
   - Cluster setup and configuration
   - Implement proper cluster setup and configuration
   - Follow best practices for optimal results

37. **Queue**
   - Queue mirroring policies
   - Implement proper queue mirroring policies
   - Follow best practices for optimal results

38. **Network**
   - Network partition handling
   - Implement proper network partition handling
   - Follow best practices for optimal results

39. **Load**
   - Load balancing strategies
   - Implement proper load balancing strategies
   - Follow best practices for optimal results

40. **Backup**
   - Backup and recovery procedures
   - Implement proper backup and recovery procedures
   - Follow best practices for optimal results

---

## Security Configuration

41. **User**
   - User authentication and authorization
   - Implement proper user authentication and authorization
   - Follow best practices for optimal results

42. **SSL/TLS**
   - SSL/TLS encryption setup
   - Implement proper ssl/tls encryption setup
   - Follow best practices for optimal results

43. **Access**
   - Access control and permissions
   - Implement proper access control and permissions
   - Follow best practices for optimal results

44. **Plugin-based**
   - Plugin-based security
   - Implement proper plugin-based security
   - Follow best practices for optimal results

45. **Audit**
   - Audit logging
   - Implement proper audit logging
   - Follow best practices for optimal results

---

## Monitoring & Management

46. **Management**
   - Management UI navigation
   - Implement proper management ui navigation
   - Follow best practices for optimal results

47. **HTTP**
   - HTTP API for automation
   - Implement proper http api for automation
   - Follow best practices for optimal results

48. **Metrics**
   - Metrics collection and analysis
   - Implement proper metrics collection and analysis
   - Follow best practices for optimal results

49. **Alerting**
   - Alerting and notification setup
   - Implement proper alerting and notification setup
   - Follow best practices for optimal results

50. **Performance**
   - Performance monitoring
   - Implement proper performance monitoring
   - Follow best practices for optimal results

---

## Advanced Features

51. **Message**
   - Message TTL and expiration
   - Implement proper message ttl and expiration
   - Follow best practices for optimal results

52. **Priority**
   - Priority queue implementation
   - Implement proper priority queue implementation
   - Follow best practices for optimal results

53. **Delayed**
   - Delayed message plugin
   - Implement proper delayed message plugin
   - Follow best practices for optimal results

54. **Federation**
   - Federation for multi-datacenter
   - Implement proper federation for multi-datacenter
   - Follow best practices for optimal results

55. **Shovel**
   - Shovel for message transfer
   - Implement proper shovel for message transfer
   - Follow best practices for optimal results

---

## Integration Patterns

56. **Microservices**
   - Microservices communication
   - Implement proper microservices communication
   - Follow best practices for optimal results

57. **Event**
   - Event sourcing implementation
   - Implement proper event sourcing implementation
   - Follow best practices for optimal results

58. **CQRS**
   - CQRS pattern support
   - Implement proper cqrs pattern support
   - Follow best practices for optimal results

59. **Stream**
   - Stream processing integration
   - Implement proper stream processing integration
   - Follow best practices for optimal results

60. **Database**
   - Database change capture
   - Implement proper database change capture
   - Follow best practices for optimal results

---

## Development Best Practices

61. **Message**
   - Message design patterns
   - Implement proper message design patterns
   - Follow best practices for optimal results

62. **Error**
   - Error handling strategies
   - Implement proper error handling strategies
   - Follow best practices for optimal results

63. **Testing**
   - Testing messaging systems
   - Implement proper testing messaging systems
   - Follow best practices for optimal results

64. **Documentation**
   - Documentation standards
   - Implement proper documentation standards
   - Follow best practices for optimal results

65. **Code**
   - Code organization
   - Implement proper code organization
   - Follow best practices for optimal results

---

## Scaling Strategies

66. **Horizontal**
   - Horizontal scaling approaches
   - Implement proper horizontal scaling approaches
   - Follow best practices for optimal results

67. **Sharding**
   - Sharding and partitioning
   - Implement proper sharding and partitioning
   - Follow best practices for optimal results

68. **Load**
   - Load distribution techniques
   - Implement proper load distribution techniques
   - Follow best practices for optimal results

69. **Capacity**
   - Capacity planning
   - Implement proper capacity planning
   - Follow best practices for optimal results

70. **Performance**
   - Performance benchmarking
   - Implement proper performance benchmarking
   - Follow best practices for optimal results

---

## Troubleshooting

71. **Connection**
   - Connection and channel issues
   - Implement proper connection and channel issues
   - Follow best practices for optimal results

72. **Message**
   - Message routing problems
   - Implement proper message routing problems
   - Follow best practices for optimal results

73. **Performance**
   - Performance bottleneck analysis
   - Implement proper performance bottleneck analysis
   - Follow best practices for optimal results

74. **Memory**
   - Memory and disk space issues
   - Implement proper memory and disk space issues
   - Follow best practices for optimal results

75. **Network**
   - Network connectivity debugging
   - Implement proper network connectivity debugging
   - Follow best practices for optimal results

---

## Production Deployment

76. **Docker**
   - Docker containerization
   - Implement proper docker containerization
   - Follow best practices for optimal results

77. **Kubernetes**
   - Kubernetes deployment
   - Implement proper kubernetes deployment
   - Follow best practices for optimal results

78. **Configuration**
   - Configuration management
   - Implement proper configuration management
   - Follow best practices for optimal results

79. **Backup**
   - Backup strategies
   - Implement proper backup strategies
   - Follow best practices for optimal results

80. **Disaster**
   - Disaster recovery planning
   - Implement proper disaster recovery planning
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

Follow these comprehensive guidelines for successful rabbitmq messaging implementation.`,
	categories: ["rabbitmq", "messaging", "event-driven", "amqp"],
	tags: ["rabbitmq", "message-queue", "amqp", "event-driven", "messaging"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
