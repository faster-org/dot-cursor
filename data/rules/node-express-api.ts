import { Rule } from "../types";

export const rule: Rule = {
	id: "node-express-api",
	slug: "node-express-api",
	title: "Node.js Express API Expert",
	description: "Build robust RESTful APIs with Express.js, middleware, and best practices",
	content: `# Node.js Express API Development Best Practices

Comprehensive guide for building robust, scalable, and secure RESTful APIs with Node.js and Express.js.

---

## Core Express.js Principles

1. **Modular Application Structure**
   - Use Express Router for organizing routes into logical modules
   - Separate business logic from route handlers
   - Implement proper middleware architecture
   - Example structure:
     \`\`\`
     src/
       app.js              // Main application setup
       server.js           // Server startup
       routes/             // Route definitions
         auth.js
         users.js
         products.js
       middleware/         // Custom middleware
         auth.js
         validation.js
         errorHandler.js
       controllers/        // Business logic
         userController.js
         productController.js
       models/            // Data models
         User.js
         Product.js
       utils/             // Utility functions
         logger.js
         database.js
     \`\`\`

2. **Middleware Chain Architecture**
   - Order middleware correctly: logging → CORS → security → parsing → routes → error handling
   - Use middleware for cross-cutting concerns
   - Implement proper error propagation
   - Example middleware setup:
     \`\`\`js
     const express = require('express');
     const helmet = require('helmet');
     const cors = require('cors');
     const morgan = require('morgan');
     const rateLimit = require('express-rate-limit');

     const app = express();

     // Security middleware
     app.use(helmet());
     app.use(cors({
       origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
       credentials: true
     }));

     // Rate limiting
     const limiter = rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 100 // limit each IP to 100 requests per windowMs
     });
     app.use('/api/', limiter);

     // Logging and parsing
     app.use(morgan('combined'));
     app.use(express.json({ limit: '10mb' }));
     app.use(express.urlencoded({ extended: true }));
     \`\`\`

3. **Async/Await Error Handling**
   - Use async/await consistently for asynchronous operations
   - Implement proper error catching and propagation
   - Create error wrapper utilities for clean code
   - Example async handler pattern:
     \`\`\`js
     // Async wrapper utility
     const asyncHandler = (fn) => (req, res, next) => {
       Promise.resolve(fn(req, res, next)).catch(next);
     };

     // Usage in routes
     router.get('/users/:id', asyncHandler(async (req, res) => {
       const user = await User.findById(req.params.id);
       if (!user) {
         return res.status(404).json({ error: 'User not found' });
       }
       res.json({ data: user });
     }));
     \`\`\`

---

## RESTful API Design

4. **Resource-Based URL Structure**
   - Use nouns for resources, not verbs
   - Implement consistent naming conventions
   - Follow REST principles for HTTP methods
   - Example API structure:
     \`\`\`js
     // Good RESTful routes
     GET    /api/users           // Get all users
     GET    /api/users/:id       // Get specific user
     POST   /api/users           // Create new user
     PUT    /api/users/:id       // Update entire user
     PATCH  /api/users/:id       // Partial user update
     DELETE /api/users/:id       // Delete user

     // Nested resources
     GET    /api/users/:id/posts // Get user's posts
     POST   /api/users/:id/posts // Create post for user
     \`\`\`

5. **HTTP Status Code Standards**
   - Use appropriate status codes for different scenarios
   - Implement consistent response formats
   - Handle edge cases with proper status codes
   - Example status code usage:
     \`\`\`js
     // Success responses
     res.status(200).json({ data: result });           // OK
     res.status(201).json({ data: newResource });      // Created
     res.status(204).send();                           // No Content

     // Client error responses
     res.status(400).json({ error: 'Invalid input' }); // Bad Request
     res.status(401).json({ error: 'Unauthorized' });  // Unauthorized
     res.status(403).json({ error: 'Forbidden' });     // Forbidden
     res.status(404).json({ error: 'Not found' });     // Not Found
     res.status(409).json({ error: 'Conflict' });      // Conflict

     // Server error responses
     res.status(500).json({ error: 'Internal server error' }); // Internal Error
     \`\`\`

6. **Request Validation and Sanitization**
   - Validate all incoming data using schemas
   - Sanitize inputs to prevent injection attacks
   - Provide clear validation error messages
   - Example with Joi validation:
     \`\`\`js
     const Joi = require('joi');

     const userSchema = Joi.object({
       name: Joi.string().min(2).max(50).required(),
       email: Joi.string().email().required(),
       age: Joi.number().integer().min(13).max(120),
       password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/)
     });

     const validateUser = (req, res, next) => {
       const { error, value } = userSchema.validate(req.body);
       if (error) {
         return res.status(400).json({
           error: 'Validation failed',
           details: error.details.map(d => d.message)
         });
       }
       req.validatedData = value;
       next();
     };
     \`\`\`

---

## Authentication and Security

7. **JWT Authentication Implementation**
   - Implement secure JWT token generation and validation
   - Use refresh token strategy for enhanced security
   - Handle token expiration gracefully
   - Example JWT implementation:
     \`\`\`js
     const jwt = require('jsonwebtoken');
     const bcrypt = require('bcrypt');

     // Generate tokens
     const generateTokens = (user) => {
       const accessToken = jwt.sign(
         { userId: user.id, email: user.email },
         process.env.JWT_SECRET,
         { expiresIn: '15m' }
       );

       const refreshToken = jwt.sign(
         { userId: user.id },
         process.env.JWT_REFRESH_SECRET,
         { expiresIn: '7d' }
       );

       return { accessToken, refreshToken };
     };

     // Verify token middleware
     const authenticateToken = (req, res, next) => {
       const authHeader = req.headers['authorization'];
       const token = authHeader && authHeader.split(' ')[1];

       if (!token) {
         return res.status(401).json({ error: 'Access token required' });
       }

       jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
         if (err) {
           return res.status(403).json({ error: 'Invalid token' });
         }
         req.user = user;
         next();
       });
     };
     \`\`\`

8. **Password Security**
   - Hash passwords using bcrypt with appropriate salt rounds
   - Implement password strength requirements
   - Never store plain text passwords
   - Example password handling:
     \`\`\`js
     const bcrypt = require('bcrypt');
     const SALT_ROUNDS = 12;

     // Hash password before saving
     const hashPassword = async (password) => {
       return await bcrypt.hash(password, SALT_ROUNDS);
     };

     // Verify password during login
     const verifyPassword = async (plainPassword, hashedPassword) => {
       return await bcrypt.compare(plainPassword, hashedPassword);
     };

     // Registration endpoint
     router.post('/register', validateUser, async (req, res) => {
       const { name, email, password } = req.validatedData;

       const existingUser = await User.findOne({ email });
       if (existingUser) {
         return res.status(409).json({ error: 'Email already registered' });
       }

       const hashedPassword = await hashPassword(password);
       const user = await User.create({
         name,
         email,
         password: hashedPassword
       });

       const tokens = generateTokens(user);
       res.status(201).json({ data: { user: { id: user.id, name, email }, tokens } });
     });
     \`\`\`

9. **Security Headers and CORS**
   - Use helmet for security headers
   - Configure CORS properly
   - Implement CSP (Content Security Policy)
   - Example security configuration:
     \`\`\`js
     const helmet = require('helmet');

     app.use(helmet({
       contentSecurityPolicy: {
         directives: {
           defaultSrc: ["'self'"],
           styleSrc: ["'self'", "'unsafe-inline'"],
           scriptSrc: ["'self'"],
           imgSrc: ["'self'", 'data:', 'https:'],
         },
       },
       hsts: {
         maxAge: 31536000,
         includeSubDomains: true,
         preload: true
       }
     }));
     \`\`\`

---

## Error Handling and Logging

10. **Centralized Error Handling**
    - Create custom error classes for different error types
    - Implement global error handling middleware
    - Log errors appropriately for debugging
    - Example error handling system:
      \`\`\`js
      // Custom error classes
      class AppError extends Error {
        constructor(message, statusCode) {
          super(message);
          this.statusCode = statusCode;
          this.isOperational = true;
          Error.captureStackTrace(this, this.constructor);
        }
      }

      class ValidationError extends AppError {
        constructor(message) {
          super(message, 400);
        }
      }

      class NotFoundError extends AppError {
        constructor(resource) {
          super(\`\${resource} not found\`, 404);
        }
      }

      // Global error handler
      const errorHandler = (err, req, res, next) => {
        let { statusCode = 500, message } = err;

        if (process.env.NODE_ENV === 'production' && !err.isOperational) {
          statusCode = 500;
          message = 'Something went wrong';
        }

        logger.error(\`\${statusCode} - \${message} - \${req.originalUrl} - \${req.method} - \${req.ip}\`);

        res.status(statusCode).json({
          error: message,
          ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
      };
      \`\`\`

11. **Structured Logging**
    - Use proper logging libraries (Winston, Pino)
    - Implement different log levels
    - Structure logs for easy parsing and monitoring
    - Example logging setup:
      \`\`\`js
      const winston = require('winston');

      const logger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json()
        ),
        transports: [
          new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
          new winston.transports.File({ filename: 'logs/combined.log' })
        ]
      });

      if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
          format: winston.format.simple()
        }));
      }
      \`\`\`

---

## Performance Optimization

12. **Database Connection Management**
    - Use connection pooling for database connections
    - Implement proper connection error handling
    - Monitor connection pool health
    - Example MongoDB connection:
      \`\`\`js
      const mongoose = require('mongoose');

      const connectDB = async () => {
        try {
          const conn = await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
          });

          logger.info(\`MongoDB Connected: \${conn.connection.host}\`);
        } catch (error) {
          logger.error('Database connection failed:', error);
          process.exit(1);
        }
      };

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        logger.error('Database connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('Database disconnected');
      });
      \`\`\`

13. **Caching Strategies**
    - Implement Redis caching for frequently accessed data
    - Use appropriate cache expiration policies
    - Cache expensive computations and database queries
    - Example Redis caching:
      \`\`\`js
      const redis = require('redis');
      const client = redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD
      });

      // Cache middleware
      const cacheMiddleware = (duration = 300) => {
        return async (req, res, next) => {
          const key = \`cache:\${req.originalUrl}\`;

          try {
            const cached = await client.get(key);
            if (cached) {
              return res.json(JSON.parse(cached));
            }

            // Store original res.json
            const originalJson = res.json;
            res.json = function(data) {
              // Cache the response
              client.setex(key, duration, JSON.stringify(data));
              return originalJson.call(this, data);
            };

            next();
          } catch (error) {
            logger.error('Cache error:', error);
            next();
          }
        };
      };
      \`\`\`

14. **Request Optimization**
    - Implement compression middleware
    - Use proper pagination for large datasets
    - Optimize query performance
    - Example optimization techniques:
      \`\`\`js
      const compression = require('compression');

      // Enable compression
      app.use(compression());

      // Pagination helper
      const paginate = (page = 1, limit = 10) => {
        const offset = (page - 1) * limit;
        return { offset, limit: parseInt(limit) };
      };

      // Paginated endpoint
      router.get('/users', async (req, res) => {
        const { page, limit } = req.query;
        const { offset, limit: pageLimit } = paginate(page, limit);

        const total = await User.countDocuments();
        const users = await User.find()
          .skip(offset)
          .limit(pageLimit)
          .select('-password')
          .sort({ createdAt: -1 });

        res.json({
          data: users,
          pagination: {
            page: parseInt(page) || 1,
            limit: pageLimit,
            total,
            pages: Math.ceil(total / pageLimit)
          }
        });
      });
      \`\`\`

---

## Testing and Quality Assurance

15. **API Testing Strategy**
    - Write unit tests for business logic
    - Implement integration tests for endpoints
    - Use proper test databases for isolation
    - Example testing setup:
      \`\`\`js
      const request = require('supertest');
      const app = require('../app');

      describe('User API', () => {
        beforeEach(async () => {
          await User.deleteMany({});
        });

        describe('POST /api/users', () => {
          it('should create a new user with valid data', async () => {
            const userData = {
              name: 'John Doe',
              email: 'john@example.com',
              password: 'Password123'
            };

            const response = await request(app)
              .post('/api/users')
              .send(userData)
              .expect(201);

            expect(response.body.data.user.email).toBe(userData.email);
            expect(response.body.data.user.password).toBeUndefined();
          });

          it('should return 400 for invalid email', async () => {
            const userData = {
              name: 'John Doe',
              email: 'invalid-email',
              password: 'Password123'
            };

            await request(app)
              .post('/api/users')
              .send(userData)
              .expect(400);
          });
        });
      });
      \`\`\`

---

## Production Deployment

16. **Environment Configuration**
    - Use environment variables for all configuration
    - Implement proper secret management
    - Configure different environments (dev, staging, prod)
    - Example environment setup:
      \`\`\`js
      // config/config.js
      const config = {
        development: {
          port: process.env.PORT || 3000,
          dbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp-dev',
          jwtSecret: process.env.JWT_SECRET || 'dev-secret',
          logLevel: 'debug'
        },
        production: {
          port: process.env.PORT || 8080,
          dbUri: process.env.MONGODB_URI,
          jwtSecret: process.env.JWT_SECRET,
          logLevel: 'error'
        }
      };

      module.exports = config[process.env.NODE_ENV || 'development'];
      \`\`\`

17. **Process Management**
    - Use PM2 for process management in production
    - Implement graceful shutdown handling
    - Monitor application health
    - Example PM2 configuration:
      \`\`\`js
      // ecosystem.config.js
      module.exports = {
        apps: [{
          name: 'api-server',
          script: './server.js',
          instances: 'max',
          exec_mode: 'cluster',
          env: {
            NODE_ENV: 'production',
            PORT: 8080
          },
          error_file: './logs/err.log',
          out_file: './logs/out.log',
          log_file: './logs/combined.log',
          time: true
        }]
      };
      \`\`\`

---

## Summary Checklist

- [ ] Implement modular route organization with Express Router
- [ ] Use proper middleware chain ordering
- [ ] Handle async operations with proper error catching
- [ ] Validate and sanitize all inputs
- [ ] Implement JWT authentication with refresh tokens
- [ ] Use bcrypt for password hashing
- [ ] Configure security headers with helmet
- [ ] Implement rate limiting and CORS
- [ ] Create centralized error handling
- [ ] Use structured logging for monitoring
- [ ] Implement database connection pooling
- [ ] Add caching for performance optimization
- [ ] Write comprehensive tests for all endpoints
- [ ] Configure proper environment variables
- [ ] Use PM2 for production process management

---

Follow these practices to build secure, scalable, and maintainable Express.js APIs that perform well in production environments.`,
	categories: ["nodejs", "backend", "javascript", "api"],
	tags: ["express", "rest-api", "middleware"],
	author: "Community",
	createdAt: "2024-01-27T00:00:00Z",
	applicationMode: "intelligent",
	globs: "*.js,*.ts,server.js,app.js",
};
