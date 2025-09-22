import { Rule } from "../types";

export const rule: Rule = {
	id: "mysql-database",
	slug: "mysql-database",
	title: "MySQL Database Development",
	description: "Design, optimize, and manage MySQL databases for high-performance applications",
	content: `# MySQL Database Development

This document provides comprehensive guidelines for designing, optimizing, and managing MySQL databases for high-performance applications.

---

## Core Principles

1. **ACID Compliance**
   - Understand Atomicity, Consistency, Isolation, and Durability
   - Implement proper transaction management
   - Choose appropriate storage engines (InnoDB vs MyISAM)

2. **Performance First**
   - Design with query performance in mind
   - Implement proper indexing strategies
   - Monitor and optimize resource usage

3. **Data Integrity**
   - Use appropriate data types and constraints
   - Implement referential integrity with foreign keys
   - Design robust schema with normalization principles

---

## Database Design

4. **Entity-Relationship Modeling**
   - Create clear ER diagrams for complex schemas
   - Define relationships between entities properly
   - Plan for future scalability and changes

5. **Normalization and Denormalization**
   - Apply normalization rules to reduce redundancy
   - Use strategic denormalization for performance
   - Balance between storage efficiency and query speed

6. **Schema Design Best Practices**
   - Use appropriate data types for columns
   - Implement proper primary and foreign key constraints
   - Plan table partitioning strategies for large datasets

---

## SQL Query Optimization

7. **Query Execution Analysis**
   - Use EXPLAIN to analyze query execution plans
   - Identify bottlenecks and optimization opportunities
   - Monitor query performance metrics

8. **JOIN Optimization**
   \`\`\`sql
   -- Efficient JOIN with proper indexing
   SELECT u.username, p.title
   FROM users u
   INNER JOIN posts p ON u.id = p.user_id
   WHERE u.active = 1
   AND p.published_at > '2024-01-01';

   -- Index on users(active) and posts(user_id, published_at)
   \`\`\`

9. **Subquery vs JOIN Performance**
   - Choose JOINs over correlated subqueries when possible
   - Use EXISTS instead of IN for better performance
   - Optimize subqueries with proper indexing

---

## Indexing Strategies

10. **Index Types and Usage**
    - Implement B-tree indexes for range queries
    - Use hash indexes for exact match lookups
    - Create composite indexes for multi-column queries

11. **Index Design Best Practices**
    - Create covering indexes to avoid table lookups
    - Use partial indexes for filtered queries
    - Monitor index usage and remove unused indexes

---

## Performance Tuning

12. **Configuration Optimization**
    - Tune innodb_buffer_pool_size for memory usage
    - Configure query cache appropriately
    - Optimize connection settings and timeouts

13. **Resource Monitoring**
    - Monitor CPU, memory, and I/O usage
    - Track query performance and slow queries
    - Implement proper connection pooling

---

## Replication and High Availability

14. **Replication Setup**
    - Configure master-slave replication for read scaling
    - Implement master-master replication for write scaling
    - Monitor replication lag and health

15. **Failover and Recovery**
    - Design automatic failover procedures
    - Test disaster recovery scenarios regularly
    - Implement proper backup and recovery strategies

---

## Backup and Recovery

16. **Backup Strategies**
    \`\`\`bash
    # Full backup with mysqldump
    mysqldump --single-transaction --routines --triggers \\
              --all-databases > backup_$(date +%Y%m%d).sql

    # Binary backup with Percona XtraBackup
    xtrabackup --backup --target-dir=/backup/$(date +%Y%m%d)
    \`\`\`

17. **Recovery Procedures**
    - Implement point-in-time recovery capabilities
    - Test backup restoration procedures regularly
    - Plan for zero-downtime recovery scenarios

---

## Security Best Practices

18. **Access Control**
    - Implement principle of least privilege for users
    - Use strong password policies and rotation
    - Configure SSL/TLS encryption for connections

19. **Auditing and Monitoring**
    - Enable audit logging for sensitive operations
    - Monitor failed login attempts and suspicious activity
    - Implement database firewall rules

---

## Stored Procedures and Functions

20. **Procedure Development**
    \`\`\`sql
    DELIMITER $$
    CREATE PROCEDURE GetUserPosts(IN user_id INT)
    BEGIN
        DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            RESIGNAL;
        END;

        START TRANSACTION;
        SELECT * FROM posts WHERE user_id = user_id;
        COMMIT;
    END$$
    DELIMITER ;
    \`\`\`

21. **Performance Considerations**
    - Optimize procedures with proper error handling
    - Use appropriate parameter data types
    - Monitor procedure execution performance

---

## Scaling Strategies

22. **Horizontal Scaling**
    - Implement database sharding for large datasets
    - Configure read replicas for read-heavy workloads
    - Use connection pooling and load balancing

23. **Vertical Scaling**
    - Monitor resource usage and upgrade hardware
    - Optimize memory allocation and CPU usage
    - Plan for storage capacity growth

---

## Advanced Features

24. **Modern MySQL Features**
    - Use JSON data type for flexible document storage
    - Implement full-text search for text queries
    - Utilize window functions for analytics

25. **Table Partitioning**
    - Implement range partitioning for time-series data
    - Use hash partitioning for even data distribution
    - Monitor partition performance and maintenance

---

## Development Integration

26. **ORM Best Practices**
    - Configure connection pooling properly
    - Implement efficient transaction management
    - Use prepared statements to prevent SQL injection

27. **Error Handling**
    - Implement comprehensive error handling patterns
    - Log database errors appropriately
    - Plan for connection failure scenarios

---

## Summary Checklist

- [ ] Database schema properly designed and normalized
- [ ] Appropriate indexes created and maintained
- [ ] Query performance optimized and monitored
- [ ] Replication and high availability configured
- [ ] Backup and recovery procedures tested
- [ ] Security best practices implemented
- [ ] Stored procedures optimized for performance
- [ ] Scaling strategy planned and implemented
- [ ] Advanced features utilized appropriately
- [ ] Development integration configured properly
- [ ] Monitoring and alerting systems in place

---

Build robust, high-performance MySQL databases following these comprehensive best practices.`,
	categories: ["mysql", "database", "sql", "relational-database"],
	tags: ["mysql", "database", "sql", "performance", "optimization"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",
};
