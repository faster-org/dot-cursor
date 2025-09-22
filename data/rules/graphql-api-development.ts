import { Rule } from "../types";

export const rule: Rule = {
	id: "graphql-api-development",
	slug: "graphql-api-development",
	title: "GraphQL API Development with Apollo Server",
	tags: ["graphql", "apollo", "api", "backend", "schema", "resolvers"],
	languages: ["javascript", "typescript", "graphql"],
	description:
		"Build scalable GraphQL APIs with Apollo Server, schema design, and resolver patterns",
	
	categories: ["best-practices", "development"],content: `# GraphQL API Development with Apollo Server

## 1. Project Setup and Schema Design

### Apollo Server Setup with TypeScript
\`\`\`typescript
// server.ts
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import { Container } from 'typedi';
import { UserResolver } from './resolvers/UserResolver';
import { PostResolver } from './resolvers/PostResolver';
import { AuthResolver } from './resolvers/AuthResolver';
import { authChecker } from './middleware/authChecker';
import { formatError } from './utils/errorFormatter';
import { context } from './context';

async function createServer(): Promise<ApolloServer> {
  const schema: GraphQLSchema = await buildSchema({
    resolvers: [UserResolver, PostResolver, AuthResolver],
    container: Container,
    authChecker,
    validate: false, // We'll handle validation manually
  });

  const server = new ApolloServer({
    schema,
    formatError,
    introspection: process.env.NODE_ENV !== 'production',
    plugins: [
      // Apollo Studio plugin for metrics
      process.env.APOLLO_KEY ? require('@apollo/server/plugin/usageReporting').default() : null,
      // Query complexity analysis
      require('apollo-server-plugin-query-complexity').default({
        maximumComplexity: 1000,
        createError: (max: number, actual: number) => {
          throw new Error(\`Query complexity \${actual} exceeds maximum complexity \${max}\`);
        },
      }),
    ].filter(Boolean),
  });

  return server;
}

async function startServer() {
  const server = await createServer();

  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT || '4000') },
    context,
  });

  console.log(\`🚀 Server ready at \${url}\`);
  console.log(\`📊 GraphQL Playground available in development mode\`);
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
\`\`\`

### Schema Definition with Type-GraphQL
\`\`\`typescript
// types/User.ts
import { ObjectType, Field, ID, Int, registerEnumType } from 'type-graphql';
import { IsEmail, MinLength, MaxLength } from 'class-validator';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role in the system',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  @MinLength(2)
  @MaxLength(50)
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @MaxLength(500)
  bio?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  isActive: boolean;

  @Field(() => Int)
  postCount: number;

  @Field(() => Int)
  followerCount: number;

  @Field(() => Int)
  followingCount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Fields that are not exposed to GraphQL
  passwordHash: string;
  emailVerified: boolean;
}

// Input Types
import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateUserInput {
  @Field()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  password: string;

  @Field({ nullable: true })
  @MaxLength(500)
  bio?: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @MinLength(2)
  @MaxLength(50)
  username?: string;

  @Field({ nullable: true })
  @MaxLength(500)
  bio?: string;

  @Field({ nullable: true })
  avatarUrl?: string;
}

@InputType()
export class UserFilterInput {
  @Field({ nullable: true })
  search?: string;

  @Field(() => UserRole, { nullable: true })
  role?: UserRole;

  @Field({ nullable: true })
  isActive?: boolean;
}

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 20 })
  limit: number = 20;

  @Field(() => Int, { defaultValue: 0 })
  offset: number = 0;

  @Field({ nullable: true })
  cursor?: string;
}
\`\`\`

### Connection and Edge Types for Pagination
\`\`\`typescript
// types/Connection.ts
import { ObjectType, Field, Int } from 'type-graphql';
import { ClassType } from 'type-graphql';

export function createConnectionType<T>(ItemType: ClassType<T>) {
  @ObjectType({ isAbstract: true })
  abstract class Edge {
    @Field(() => ItemType)
    node: T;

    @Field()
    cursor: string;
  }

  @ObjectType({ isAbstract: true })
  abstract class PageInfo {
    @Field()
    hasNextPage: boolean;

    @Field()
    hasPreviousPage: boolean;

    @Field({ nullable: true })
    startCursor?: string;

    @Field({ nullable: true })
    endCursor?: string;
  }

  @ObjectType({ isAbstract: true })
  abstract class Connection {
    @Field(() => [Edge])
    edges: Edge[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;

    @Field(() => Int)
    totalCount: number;
  }

  return { Edge, PageInfo, Connection };
}

// Usage
const { Connection: UserConnection } = createConnectionType(User);

@ObjectType()
export class UserConnection extends UserConnection {}
\`\`\`

## 2. Resolver Implementation

### User Resolver with Complex Operations
\`\`\`typescript
// resolvers/UserResolver.ts
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root,
  Authorized,
  Int,
  UseMiddleware,
} from 'type-graphql';
import { Service } from 'typedi';
import { User, CreateUserInput, UpdateUserInput, UserFilterInput, UserConnection } from '../types/User';
import { Post } from '../types/Post';
import { UserService } from '../services/UserService';
import { PostService } from '../services/PostService';
import { Context } from '../types/Context';
import { ValidationMiddleware } from '../middleware/ValidationMiddleware';
import { RateLimitMiddleware } from '../middleware/RateLimitMiddleware';
import { CacheMiddleware } from '../middleware/CacheMiddleware';

@Service()
@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private postService: PostService
  ) {}

  // Queries
  @Query(() => UserConnection)
  @UseMiddleware(CacheMiddleware({ ttl: 300 })) // Cache for 5 minutes
  async users(
    @Arg('filter', { nullable: true }) filter?: UserFilterInput,
    @Arg('pagination', { nullable: true }) pagination?: PaginationInput
  ): Promise<UserConnection> {
    return this.userService.findUsers(filter, pagination);
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(CacheMiddleware({ ttl: 600 }))
  async user(@Arg('id') id: string): Promise<User | null> {
    return this.userService.findById(id);
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(CacheMiddleware({ ttl: 600 }))
  async userByUsername(@Arg('username') username: string): Promise<User | null> {
    return this.userService.findByUsername(username);
  }

  @Query(() => User)
  @Authorized()
  async me(@Ctx() ctx: Context): Promise<User> {
    if (!ctx.user) {
      throw new Error('Authentication required');
    }
    return ctx.user;
  }

  // Mutations
  @Mutation(() => User)
  @UseMiddleware(ValidationMiddleware, RateLimitMiddleware({ max: 5, window: 3600 }))
  async createUser(@Arg('input') input: CreateUserInput): Promise<User> {
    return this.userService.create(input);
  }

  @Mutation(() => User)
  @Authorized()
  @UseMiddleware(ValidationMiddleware)
  async updateUser(
    @Arg('id') id: string,
    @Arg('input') input: UpdateUserInput,
    @Ctx() ctx: Context
  ): Promise<User> {
    // Check if user can update this profile
    if (ctx.user?.id !== id && ctx.user?.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized to update this user');
    }

    return this.userService.update(id, input);
  }

  @Mutation(() => Boolean)
  @Authorized(['ADMIN'])
  async deleteUser(@Arg('id') id: string): Promise<boolean> {
    await this.userService.delete(id);
    return true;
  }

  @Mutation(() => User)
  @Authorized()
  async followUser(
    @Arg('userId') userId: string,
    @Ctx() ctx: Context
  ): Promise<User> {
    if (!ctx.user) throw new Error('Authentication required');

    await this.userService.followUser(ctx.user.id, userId);
    return this.userService.findById(userId);
  }

  // Field Resolvers
  @FieldResolver(() => [Post])
  async posts(
    @Root() user: User,
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number,
    @Arg('offset', () => Int, { defaultValue: 0 }) offset: number
  ): Promise<Post[]> {
    return this.postService.findByUserId(user.id, { limit, offset });
  }

  @FieldResolver(() => Int)
  @UseMiddleware(CacheMiddleware({ ttl: 1800 })) // Cache for 30 minutes
  async postCount(@Root() user: User): Promise<number> {
    return this.postService.countByUserId(user.id);
  }

  @FieldResolver(() => Int)
  @UseMiddleware(CacheMiddleware({ ttl: 1800 }))
  async followerCount(@Root() user: User): Promise<number> {
    return this.userService.getFollowerCount(user.id);
  }

  @FieldResolver(() => Int)
  @UseMiddleware(CacheMiddleware({ ttl: 1800 }))
  async followingCount(@Root() user: User): Promise<number> {
    return this.userService.getFollowingCount(user.id);
  }

  @FieldResolver(() => Boolean)
  @Authorized()
  async isFollowing(
    @Root() user: User,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    if (!ctx.user) return false;
    return this.userService.isFollowing(ctx.user.id, user.id);
  }
}
\`\`\`

### DataLoader for N+1 Problem Prevention
\`\`\`typescript
// loaders/createLoaders.ts
import DataLoader from 'dataloader';
import { UserService } from '../services/UserService';
import { PostService } from '../services/PostService';
import { User } from '../types/User';
import { Post } from '../types/Post';

export interface Loaders {
  userLoader: DataLoader<string, User | null>;
  postsByUserLoader: DataLoader<string, Post[]>;
  userFollowersLoader: DataLoader<string, number>;
  userFollowingLoader: DataLoader<string, number>;
}

export function createLoaders(
  userService: UserService,
  postService: PostService
): Loaders {
  // User loader
  const userLoader = new DataLoader<string, User | null>(
    async (userIds: readonly string[]) => {
      const users = await userService.findByIds([...userIds]);
      const userMap = new Map(users.map(user => [user.id, user]));

      return userIds.map(id => userMap.get(id) || null);
    },
    {
      maxBatchSize: 100,
      cache: true,
    }
  );

  // Posts by user loader
  const postsByUserLoader = new DataLoader<string, Post[]>(
    async (userIds: readonly string[]) => {
      const posts = await postService.findByUserIds([...userIds]);
      const postsByUser = new Map<string, Post[]>();

      // Group posts by user ID
      posts.forEach(post => {
        if (!postsByUser.has(post.userId)) {
          postsByUser.set(post.userId, []);
        }
        postsByUser.get(post.userId)!.push(post);
      });

      return userIds.map(userId => postsByUser.get(userId) || []);
    }
  );

  // Follower count loader
  const userFollowersLoader = new DataLoader<string, number>(
    async (userIds: readonly string[]) => {
      const counts = await userService.getFollowerCounts([...userIds]);
      return userIds.map(id => counts[id] || 0);
    }
  );

  // Following count loader
  const userFollowingLoader = new DataLoader<string, number>(
    async (userIds: readonly string[]) => {
      const counts = await userService.getFollowingCounts([...userIds]);
      return userIds.map(id => counts[id] || 0);
    }
  );

  return {
    userLoader,
    postsByUserLoader,
    userFollowersLoader,
    userFollowingLoader,
  };
}
\`\`\`

## 3. Middleware and Authentication

### Authentication Middleware
\`\`\`typescript
// middleware/authChecker.ts
import { AuthChecker } from 'type-graphql';
import { Context } from '../types/Context';
import { UserRole } from '../types/User';

export const authChecker: AuthChecker<Context> = (
  { context },
  roles
): boolean => {
  // If no roles specified, just check if user is authenticated
  if (roles.length === 0) {
    return !!context.user;
  }

  // If user is not authenticated, deny access
  if (!context.user) {
    return false;
  }

  // Check if user has required role
  return roles.some(role => context.user!.role === role);
};

// middleware/ValidationMiddleware.ts
import { MiddlewareFn } from 'type-graphql';
import { validate } from 'class-validator';
import { Context } from '../types/Context';

export const ValidationMiddleware: MiddlewareFn<Context> = async (
  { args },
  next
) => {
  // Validate all input arguments
  for (const arg of Object.values(args)) {
    if (typeof arg === 'object' && arg !== null) {
      const errors = await validate(arg);
      if (errors.length > 0) {
        const errorMessages = errors
          .map(error => Object.values(error.constraints || {}).join(', '))
          .join('; ');
        throw new Error(\`Validation failed: \${errorMessages}\`);
      }
    }
  }

  return next();
};

// middleware/RateLimitMiddleware.ts
import { MiddlewareFn } from 'type-graphql';
import { Context } from '../types/Context';
import Redis from 'ioredis';

interface RateLimitOptions {
  max: number; // Maximum requests
  window: number; // Time window in seconds
  keyGenerator?: (ctx: Context) => string;
}

export const RateLimitMiddleware = (options: RateLimitOptions): MiddlewareFn<Context> => {
  const redis = new Redis(process.env.REDIS_URL);

  return async ({ context, info }, next) => {
    const key = options.keyGenerator
      ? options.keyGenerator(context)
      : \`rate_limit:\${info.fieldName}:\${context.user?.id || context.req.ip}\`;

    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, options.window);
    }

    if (current > options.max) {
      const ttl = await redis.ttl(key);
      throw new Error(\`Rate limit exceeded. Try again in \${ttl} seconds.\`);
    }

    return next();
  };
};

// middleware/CacheMiddleware.ts
import { MiddlewareFn } from 'type-graphql';
import { Context } from '../types/Context';
import Redis from 'ioredis';

interface CacheOptions {
  ttl: number; // Time to live in seconds
  keyGenerator?: (args: any, context: Context) => string;
}

export const CacheMiddleware = (options: CacheOptions): MiddlewareFn<Context> => {
  const redis = new Redis(process.env.REDIS_URL);

  return async ({ args, context, info }, next) => {
    // Generate cache key
    const key = options.keyGenerator
      ? options.keyGenerator(args, context)
      : \`cache:\${info.fieldName}:\${JSON.stringify(args)}\`;

    // Try to get from cache
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    // Execute resolver
    const result = await next();

    // Cache the result
    await redis.setex(key, options.ttl, JSON.stringify(result));

    return result;
  };
};
\`\`\`

## 4. Context and Error Handling

### GraphQL Context Setup
\`\`\`typescript
// context.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from './types/User';
import { UserService } from './services/UserService';
import { createLoaders, Loaders } from './loaders/createLoaders';
import { Container } from 'typedi';

export interface Context {
  req: Request;
  res: Response;
  user?: User;
  loaders: Loaders;
}

export async function context({ req, res }: { req: Request; res: Response }): Promise<Context> {
  // Extract token from Authorization header
  const token = req.headers.authorization?.replace('Bearer ', '');

  let user: User | undefined;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const userService = Container.get(UserService);
      user = await userService.findById(decoded.userId) || undefined;
    } catch (error) {
      // Token is invalid, but we don't throw an error here
      // Let the resolver decide if authentication is required
      console.warn('Invalid token:', error.message);
    }
  }

  // Create data loaders for this request
  const loaders = createLoaders(
    Container.get(UserService),
    Container.get(PostService)
  );

  return {
    req,
    res,
    user,
    loaders,
  };
}
\`\`\`

### Error Formatting and Custom Errors
\`\`\`typescript
// utils/errorFormatter.ts
import { GraphQLError, GraphQLFormattedError } from 'graphql';

export function formatError(error: GraphQLError): GraphQLFormattedError {
  // Log the error
  console.error('GraphQL Error:', {
    message: error.message,
    locations: error.locations,
    path: error.path,
    originalError: error.originalError,
  });

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production') {
    // Check if it's a known error type
    if (error.originalError instanceof ValidationError) {
      return {
        message: error.message,
        extensions: {
          code: 'VALIDATION_ERROR',
          field: error.originalError.field,
        },
      };
    }

    if (error.originalError instanceof AuthenticationError) {
      return {
        message: 'Authentication required',
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      };
    }

    if (error.originalError instanceof AuthorizationError) {
      return {
        message: 'Insufficient permissions',
        extensions: {
          code: 'FORBIDDEN',
        },
      };
    }

    // For unknown errors, return a generic message
    return {
      message: 'Internal server error',
      extensions: {
        code: 'INTERNAL_ERROR',
      },
    };
  }

  // In development, return the original error
  return {
    message: error.message,
    locations: error.locations,
    path: error.path,
    extensions: {
      code: error.extensions?.code || 'UNKNOWN_ERROR',
      originalError: error.originalError?.message,
    },
  };
}

// Custom Error Classes
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(\`\${resource} not found\`);
    this.name = 'NotFoundError';
  }
}
\`\`\`

## 5. Service Layer Implementation

### User Service with Business Logic
\`\`\`typescript
// services/UserService.ts
import { Service } from 'typedi';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/UserRepository';
import { User, CreateUserInput, UpdateUserInput, UserFilterInput, UserConnection } from '../types/User';
import { ValidationError, NotFoundError } from '../utils/errorFormatter';
import { PaginationInput } from '../types/User';

@Service()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(input: CreateUserInput): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ValidationError('User with this email already exists', 'email');
    }

    const existingUsername = await this.userRepository.findByUsername(input.username);
    if (existingUsername) {
      throw new ValidationError('Username already taken', 'username');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(input.password, 12);

    // Create user
    const userData = {
      ...input,
      passwordHash,
      role: UserRole.USER,
      isActive: true,
      emailVerified: false,
    };

    const user = await this.userRepository.create(userData);

    // Send verification email (implement separately)
    // await this.emailService.sendVerificationEmail(user);

    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async findByIds(ids: string[]): Promise<User[]> {
    return this.userRepository.findByIds(ids);
  }

  async findUsers(
    filter?: UserFilterInput,
    pagination?: PaginationInput
  ): Promise<UserConnection> {
    const { users, totalCount, hasNextPage } = await this.userRepository.findMany(
      filter,
      pagination
    );

    const edges = users.map((user, index) => ({
      node: user,
      cursor: Buffer.from(\`\${pagination?.offset || 0 + index}\`).toString('base64'),
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: (pagination?.offset || 0) > 0,
        startCursor: edges[0]?.cursor,
        endCursor: edges[edges.length - 1]?.cursor,
      },
      totalCount,
    };
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }

    // Check username uniqueness if updating
    if (input.username && input.username !== user.username) {
      const existingUser = await this.userRepository.findByUsername(input.username);
      if (existingUser) {
        throw new ValidationError('Username already taken', 'username');
      }
    }

    return this.userRepository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }

    await this.userRepository.delete(id);
  }

  async followUser(followerId: string, followeeId: string): Promise<void> {
    if (followerId === followeeId) {
      throw new ValidationError('Cannot follow yourself');
    }

    const followee = await this.userRepository.findById(followeeId);
    if (!followee) {
      throw new NotFoundError('User');
    }

    await this.userRepository.createFollow(followerId, followeeId);
  }

  async unfollowUser(followerId: string, followeeId: string): Promise<void> {
    await this.userRepository.removeFollow(followerId, followeeId);
  }

  async isFollowing(followerId: string, followeeId: string): Promise<boolean> {
    return this.userRepository.isFollowing(followerId, followeeId);
  }

  async getFollowerCount(userId: string): Promise<number> {
    return this.userRepository.getFollowerCount(userId);
  }

  async getFollowingCount(userId: string): Promise<number> {
    return this.userRepository.getFollowingCount(userId);
  }

  async getFollowerCounts(userIds: string[]): Promise<Record<string, number>> {
    return this.userRepository.getFollowerCounts(userIds);
  }

  async getFollowingCounts(userIds: string[]): Promise<Record<string, number>> {
    return this.userRepository.getFollowingCounts(userIds);
  }
}
\`\`\`

## 6. Testing GraphQL APIs

### Integration Tests with Apollo Server Testing
\`\`\`typescript
// tests/resolvers/UserResolver.test.ts
import { createTestClient } from 'apollo-server-testing';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { UserResolver } from '../../src/resolvers/UserResolver';
import { UserService } from '../../src/services/UserService';
import { User, UserRole } from '../../src/types/User';

// Mock the UserService
const mockUserService = {
  create: jest.fn(),
  findById: jest.fn(),
  findUsers: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
} as jest.Mocked<UserService>;

Container.set(UserService, mockUserService);

describe('UserResolver', () => {
  let testClient: any;

  beforeAll(async () => {
    const schema = await buildSchema({
      resolvers: [UserResolver],
      container: Container,
      authChecker: ({ context }) => !!context.user,
    });

    testClient = createTestClient(schema);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query: users', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        {
          id: '1',
          username: 'john_doe',
          email: 'john@example.com',
          role: UserRole.USER,
          isActive: true,
          postCount: 5,
          followerCount: 10,
          followingCount: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockConnection = {
        edges: mockUsers.map((user, index) => ({
          node: user,
          cursor: Buffer.from(\`\${index}\`).toString('base64'),
        })),
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: Buffer.from('0').toString('base64'),
          endCursor: Buffer.from('0').toString('base64'),
        },
        totalCount: 1,
      };

      mockUserService.findUsers.mockResolvedValue(mockConnection);

      const query = \`
        query GetUsers($filter: UserFilterInput, $pagination: PaginationInput) {
          users(filter: $filter, pagination: $pagination) {
            edges {
              node {
                id
                username
                email
                role
                isActive
              }
              cursor
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            totalCount
          }
        }
      \`;

      const variables = {
        pagination: { limit: 10, offset: 0 },
      };

      const { data, errors } = await testClient.query({
        query,
        variables,
      });

      expect(errors).toBeUndefined();
      expect(data.users.edges).toHaveLength(1);
      expect(data.users.edges[0].node.username).toBe('john_doe');
      expect(data.users.totalCount).toBe(1);
    });
  });

  describe('Mutation: createUser', () => {
    it('should create a new user', async () => {
      const newUser = {
        id: '1',
        username: 'new_user',
        email: 'new@example.com',
        role: UserRole.USER,
        isActive: true,
        postCount: 0,
        followerCount: 0,
        followingCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserService.create.mockResolvedValue(newUser);

      const mutation = \`
        mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) {
            id
            username
            email
            role
            isActive
          }
        }
      \`;

      const variables = {
        input: {
          username: 'new_user',
          email: 'new@example.com',
          password: 'password123',
        },
      };

      const { data, errors } = await testClient.mutate({
        mutation,
        variables,
      });

      expect(errors).toBeUndefined();
      expect(data.createUser.username).toBe('new_user');
      expect(mockUserService.create).toHaveBeenCalledWith(variables.input);
    });

    it('should handle validation errors', async () => {
      mockUserService.create.mockRejectedValue(
        new Error('Validation failed: Username is required')
      );

      const mutation = \`
        mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) {
            id
            username
          }
        }
      \`;

      const variables = {
        input: {
          username: '',
          email: 'test@example.com',
          password: 'password123',
        },
      };

      const { data, errors } = await testClient.mutate({
        mutation,
        variables,
      });

      expect(data).toBeNull();
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('Validation failed');
    });
  });

  describe('Query: user (authenticated)', () => {
    it('should return user when authenticated', async () => {
      const mockUser = {
        id: '1',
        username: 'john_doe',
        email: 'john@example.com',
        role: UserRole.USER,
        isActive: true,
        postCount: 5,
        followerCount: 10,
        followingCount: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserService.findById.mockResolvedValue(mockUser);

      const query = \`
        query GetMe {
          me {
            id
            username
            email
          }
        }
      \`;

      const { data, errors } = await testClient.query({
        query,
        context: { user: mockUser }, // Simulate authenticated user
      });

      expect(errors).toBeUndefined();
      expect(data.me.username).toBe('john_doe');
    });

    it('should throw error when not authenticated', async () => {
      const query = \`
        query GetMe {
          me {
            id
            username
          }
        }
      \`;

      const { data, errors } = await testClient.query({
        query,
        context: {}, // No authenticated user
      });

      expect(data).toBeNull();
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('Access denied');
    });
  });
});
\`\`\`

## 7. Performance Optimization

### Query Complexity Analysis
\`\`\`typescript
// plugins/complexityPlugin.ts
import { Plugin } from '@apollo/server';
import {
  getComplexity,
  fieldExtensionsEstimator,
  simpleEstimator,
  createComplexityRule,
} from 'graphql-query-complexity';

export const complexityPlugin = (maxComplexity: number = 1000): Plugin => {
  return {
    requestDidStart() {
      return {
        didResolveValidation({ request, document }) {
          const complexity = getComplexity({
            schema: request.schema,
            query: document,
            variables: request.variables,
            estimators: [
              fieldExtensionsEstimator(),
              simpleEstimator({ maximumComplexity: maxComplexity }),
            ],
          });

          if (complexity > maxComplexity) {
            throw new Error(
              \`Query complexity \${complexity} exceeds maximum allowed complexity \${maxComplexity}\`
            );
          }

          console.log(\`Query complexity: \${complexity}\`);
        },
      };
    },
  };
};

// Usage in schema
import { Field, ObjectType, Extensions } from 'type-graphql';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  @Extensions({ complexity: 1 })
  username: string;

  @Field(() => [Post])
  @Extensions({ complexity: ({ args, childComplexity }) => args.limit * childComplexity })
  posts: Post[];
}
\`\`\`

### Query Depth Limiting
\`\`\`typescript
// plugins/depthLimitPlugin.ts
import depthLimit from 'graphql-depth-limit';
import { Plugin } from '@apollo/server';

export const depthLimitPlugin = (maxDepth: number = 10): Plugin => {
  return {
    requestDidStart() {
      return {
        didResolveValidation({ request, document }) {
          const depthLimitRule = depthLimit(maxDepth);
          const errors = depthLimitRule(request.schema, document);

          if (errors && errors.length > 0) {
            throw new Error(\`Query depth \${maxDepth} exceeded\`);
          }
        },
      };
    },
  };
};
\`\`\`

## Checklist for GraphQL API Development

- [ ] Set up Apollo Server with proper TypeScript configuration
- [ ] Design schema using Type-GraphQL with proper input/output types
- [ ] Implement resolvers with field resolvers for nested data
- [ ] Set up DataLoader to prevent N+1 query problems
- [ ] Configure authentication and authorization middleware
- [ ] Implement proper error handling and formatting
- [ ] Add validation middleware for input sanitization
- [ ] Set up caching with Redis for frequently accessed data
- [ ] Implement rate limiting to prevent abuse
- [ ] Add query complexity and depth limiting
- [ ] Create comprehensive integration tests
- [ ] Set up monitoring and logging for GraphQL operations
- [ ] Implement pagination with cursor-based approach
- [ ] Add subscription support for real-time features
- [ ] Configure proper CORS and security headers`,	applicationMode: "intelligent",

}