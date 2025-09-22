import { Rule } from "../types";

export const rule: Rule = {
	id: "redis-caching-strategies",
	slug: "redis-caching-strategies",
	title: "Redis Caching Strategies and Implementation",
	tags: ["redis", "caching", "performance", "scalability", "memory"],
	languages: ["javascript", "typescript", "python", "java", "go"],
	description:
		"Comprehensive guide for implementing Redis caching strategies, including cache patterns, data structures, and performance optimization techniques.",
	content: `# Redis Caching Strategies and Implementation

## 1. Redis Setup and Configuration

### Basic Redis Configuration
\`\`\`conf
# redis.conf
port 6379
bind 127.0.0.1
timeout 300
tcp-keepalive 60
tcp-backlog 511

# Memory management
maxmemory 2gb
maxmemory-policy allkeys-lru
maxmemory-samples 5

# Persistence
save 900 1
save 300 10
save 60 10000
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb

# Security
requirepass your_strong_password
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command DEBUG ""

# Performance
tcp-nodelay yes
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60
\`\`\`

### Docker Compose Setup
\`\`\`yaml
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
      - ./redis.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis-cluster:
    image: redis:7-alpine
    ports:
      - "7000-7005:7000-7005"
    volumes:
      - ./cluster:/usr/local/etc/redis
    command: >
      sh -c "
        redis-server /usr/local/etc/redis/redis-7000.conf &
        redis-server /usr/local/etc/redis/redis-7001.conf &
        redis-server /usr/local/etc/redis/redis-7002.conf &
        redis-server /usr/local/etc/redis/redis-7003.conf &
        redis-server /usr/local/etc/redis/redis-7004.conf &
        redis-server /usr/local/etc/redis/redis-7005.conf &
        wait
      "
    restart: unless-stopped

volumes:
  redis_data:
\`\`\`

## 2. Cache Client Implementation

### TypeScript Redis Client
\`\`\`typescript
import Redis from 'ioredis';

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  keyPrefix: string;
  retryDelayOnFailover: number;
  maxRetriesPerRequest: number;
  lazyConnect: boolean;
}

export class CacheService {
  private redis: Redis;
  private defaultTTL: number = 3600; // 1 hour

  constructor(config: CacheConfig) {
    this.redis = new Redis({
      ...config,
      retryDelayOnFailover: config.retryDelayOnFailover || 100,
      maxRetriesPerRequest: config.maxRetriesPerRequest || 3,
      lazyConnect: config.lazyConnect || true
    });

    this.redis.on('connect', () => {
      console.log('Redis connected');
    });

    this.redis.on('error', (error) => {
      console.error('Redis error:', error);
    });

    this.redis.on('ready', () => {
      console.log('Redis ready');
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(\`Cache get error for key \${key}:\`, error);
      return null;
    }
  }

  async set<T>(
    key: string,
    value: T,
    ttl: number = this.defaultTTL
  ): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      const result = await this.redis.setex(key, ttl, serialized);
      return result === 'OK';
    } catch (error) {
      console.error(\`Cache set error for key \${key}:\`, error);
      return false;
    }
  }

  async del(key: string | string[]): Promise<number> {
    try {
      return await this.redis.del(key);
    } catch (error) {
      console.error(\`Cache delete error for key \${key}:\`, error);
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(\`Cache exists error for key \${key}:\`, error);
      return false;
    }
  }

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number = this.defaultTTL
  ): Promise<T | null> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // Not in cache, generate value
      const value = await factory();
      if (value !== null && value !== undefined) {
        await this.set(key, value, ttl);
      }

      return value;
    } catch (error) {
      console.error(\`Cache getOrSet error for key \${key}:\`, error);
      return null;
    }
  }

  async invalidatePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        return await this.redis.del(...keys);
      }
      return 0;
    } catch (error) {
      console.error(\`Cache invalidatePattern error for pattern \${pattern}:\`, error);
      return 0;
    }
  }
}
\`\`\`

## 3. Cache-Aside Pattern Implementation

### Repository with Caching Layer
\`\`\`typescript
export interface User {
  id: string;
  email: string;
  name: string;
  profile: UserProfile;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class UserRepository {
  private cache: CacheService;
  private db: Database;
  private userCacheTTL = 3600; // 1 hour
  private profileCacheTTL = 7200; // 2 hours

  constructor(cache: CacheService, db: Database) {
    this.cache = cache;
    this.db = db;
  }

  async getUserById(id: string): Promise<User | null> {
    const cacheKey = \`user:\${id}\`;

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        const user = await this.db.user.findUnique({
          where: { id },
          include: { profile: true }
        });
        return user;
      },
      this.userCacheTTL
    );
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const cacheKey = \`user:email:\${email}\`;

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        const user = await this.db.user.findUnique({
          where: { email },
          include: { profile: true }
        });
        return user;
      },
      this.userCacheTTL
    );
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    // Update in database
    const user = await this.db.user.update({
      where: { id },
      data,
      include: { profile: true }
    });

    // Invalidate related cache entries
    await Promise.all([
      this.cache.del(\`user:\${id}\`),
      this.cache.del(\`user:email:\${user.email}\`),
      this.cache.invalidatePattern(\`user:search:*\`)
    ]);

    // Warm cache with updated data
    await this.cache.set(\`user:\${id}\`, user, this.userCacheTTL);
    await this.cache.set(\`user:email:\${user.email}\`, user, this.userCacheTTL);

    return user;
  }

  async getUsersPage(
    page: number,
    limit: number,
    filters: UserFilters = {}
  ): Promise<{ users: User[]; total: number }> {
    const cacheKey = \`users:page:\${page}:\${limit}:\${JSON.stringify(filters)}\`;

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        const [users, total] = await Promise.all([
          this.db.user.findMany({
            where: this.buildWhereClause(filters),
            skip: (page - 1) * limit,
            take: limit,
            include: { profile: true },
            orderBy: { createdAt: 'desc' }
          }),
          this.db.user.count({
            where: this.buildWhereClause(filters)
          })
        ]);

        return { users, total };
      },
      600 // 10 minutes for paginated results
    );
  }

  private buildWhereClause(filters: UserFilters): any {
    const where: any = {};

    if (filters.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }

    if (filters.email) {
      where.email = { contains: filters.email, mode: 'insensitive' };
    }

    if (filters.createdAfter) {
      where.createdAt = { gte: filters.createdAfter };
    }

    return where;
  }
}
\`\`\`

## 4. Write-Through and Write-Behind Patterns

### Write-Through Cache Implementation
\`\`\`typescript
export class WriteThroughCache {
  private cache: CacheService;
  private db: Database;

  constructor(cache: CacheService, db: Database) {
    this.cache = cache;
    this.db = db;
  }

  async setProduct(product: Product): Promise<Product> {
    // Write to database first
    const savedProduct = await this.db.product.upsert({
      where: { id: product.id },
      update: product,
      create: product
    });

    // Then write to cache
    const cacheKey = \`product:\${savedProduct.id}\`;
    await this.cache.set(cacheKey, savedProduct);

    // Update related cache entries
    await this.updateRelatedCaches(savedProduct);

    return savedProduct;
  }

  private async updateRelatedCaches(product: Product): Promise<void> {
    // Update category cache
    const categoryKey = \`products:category:\${product.category}\`;
    await this.cache.del(categoryKey);

    // Update search caches
    await this.cache.invalidatePattern('products:search:*');

    // Update popular products if applicable
    if (product.viewCount > 1000) {
      await this.cache.del('products:popular');
    }
  }
}
\`\`\`

### Write-Behind Cache with Queue
\`\`\`typescript
export class WriteBehindCache {
  private cache: CacheService;
  private db: Database;
  private writeQueue: Map<string, any> = new Map();
  private writeTimer?: NodeJS.Timeout;
  private batchSize = 100;
  private writeDelay = 5000; // 5 seconds

  constructor(cache: CacheService, db: Database) {
    this.cache = cache;
    this.db = db;
  }

  async setProduct(product: Product): Promise<void> {
    // Write to cache immediately
    const cacheKey = \`product:\${product.id}\`;
    await this.cache.set(cacheKey, product);

    // Queue for database write
    this.writeQueue.set(product.id, product);

    // Schedule batch write
    this.scheduleBatchWrite();
  }

  private scheduleBatchWrite(): void {
    if (this.writeTimer) {
      clearTimeout(this.writeTimer);
    }

    // Write immediately if batch is full
    if (this.writeQueue.size >= this.batchSize) {
      this.processBatchWrite();
      return;
    }

    // Otherwise, schedule delayed write
    this.writeTimer = setTimeout(() => {
      this.processBatchWrite();
    }, this.writeDelay);
  }

  private async processBatchWrite(): Promise<void> {
    if (this.writeQueue.size === 0) return;

    const products = Array.from(this.writeQueue.values());
    this.writeQueue.clear();

    try {
      await this.db.$transaction(async (tx) => {
        for (const product of products) {
          await tx.product.upsert({
            where: { id: product.id },
            update: product,
            create: product
          });
        }
      });

      console.log(\`Batch wrote \${products.length} products to database\`);
    } catch (error) {
      console.error('Batch write failed:', error);

      // Re-queue failed products with exponential backoff
      for (const product of products) {
        this.writeQueue.set(product.id, product);
      }

      setTimeout(() => {
        this.processBatchWrite();
      }, this.writeDelay * 2);
    }
  }
}
\`\`\`

## 5. Advanced Caching Patterns

### Multi-Level Cache Implementation
\`\`\`typescript
export class MultiLevelCache {
  private l1Cache: Map<string, { value: any; expiry: number }> = new Map();
  private l2Cache: CacheService;
  private l1TTL = 300; // 5 minutes
  private l2TTL = 3600; // 1 hour
  private maxL1Size = 1000;

  constructor(l2Cache: CacheService) {
    this.l2Cache = l2Cache;

    // Cleanup L1 cache periodically
    setInterval(() => {
      this.cleanupL1Cache();
    }, 60000); // Every minute
  }

  async get<T>(key: string): Promise<T | null> {
    // Try L1 cache first
    const l1Result = this.getFromL1<T>(key);
    if (l1Result !== null) {
      return l1Result;
    }

    // Try L2 cache
    const l2Result = await this.l2Cache.get<T>(key);
    if (l2Result !== null) {
      // Promote to L1 cache
      this.setToL1(key, l2Result);
      return l2Result;
    }

    return null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    // Set in both caches
    this.setToL1(key, value);
    await this.l2Cache.set(key, value, this.l2TTL);
  }

  private getFromL1<T>(key: string): T | null {
    const entry = this.l1Cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.l1Cache.delete(key);
      return null;
    }

    return entry.value;
  }

  private setToL1<T>(key: string, value: T): void {
    // Implement LRU eviction if cache is full
    if (this.l1Cache.size >= this.maxL1Size) {
      const firstKey = this.l1Cache.keys().next().value;
      this.l1Cache.delete(firstKey);
    }

    this.l1Cache.set(key, {
      value,
      expiry: Date.now() + (this.l1TTL * 1000)
    });
  }

  private cleanupL1Cache(): void {
    const now = Date.now();
    for (const [key, entry] of this.l1Cache.entries()) {
      if (now > entry.expiry) {
        this.l1Cache.delete(key);
      }
    }
  }
}
\`\`\`

### Cache Warming Strategy
\`\`\`typescript
export class CacheWarmer {
  private cache: CacheService;
  private db: Database;

  constructor(cache: CacheService, db: Database) {
    this.cache = cache;
    this.db = db;
  }

  async warmPopularProducts(): Promise<void> {
    console.log('Starting cache warm for popular products');

    const popularProducts = await this.db.product.findMany({
      where: {
        viewCount: { gte: 1000 }
      },
      take: 100,
      orderBy: { viewCount: 'desc' }
    });

    const warmPromises = popularProducts.map(async (product) => {
      const cacheKey = \`product:\${product.id}\`;
      await this.cache.set(cacheKey, product, 7200); // 2 hours
    });

    await Promise.all(warmPromises);
    console.log(\`Warmed cache for \${popularProducts.length} popular products\`);
  }

  async warmUserSessions(): Promise<void> {
    const activeUsers = await this.db.user.findMany({
      where: {
        lastLoginAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      include: { profile: true }
    });

    const warmPromises = activeUsers.map(async (user) => {
      await Promise.all([
        this.cache.set(\`user:\${user.id}\`, user, 3600),
        this.cache.set(\`user:email:\${user.email}\`, user, 3600)
      ]);
    });

    await Promise.all(warmPromises);
    console.log(\`Warmed cache for \${activeUsers.length} active users\`);
  }

  async scheduleWarmup(): Promise<void> {
    // Warm cache every hour
    setInterval(async () => {
      try {
        await Promise.all([
          this.warmPopularProducts(),
          this.warmUserSessions()
        ]);
      } catch (error) {
        console.error('Cache warming failed:', error);
      }
    }, 3600000); // 1 hour

    // Initial warmup
    await this.warmPopularProducts();
    await this.warmUserSessions();
  }
}
\`\`\`

## 6. Redis Data Structures for Caching

### Advanced Data Structure Usage
\`\`\`typescript
export class RedisDataStructures {
  private redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  // Rate limiting with sliding window
  async checkRateLimit(
    userId: string,
    limit: number,
    windowMs: number
  ): Promise<{ allowed: boolean; remaining: number }> {
    const key = \`rate_limit:\${userId}\`;
    const now = Date.now();
    const windowStart = now - windowMs;

    const pipeline = this.redis.pipeline();

    // Remove expired entries
    pipeline.zremrangebyscore(key, 0, windowStart);

    // Count current requests
    pipeline.zcard(key);

    // Add current request
    pipeline.zadd(key, now, \`\${now}-\${Math.random()}\`);

    // Set expiry
    pipeline.expire(key, Math.ceil(windowMs / 1000));

    const results = await pipeline.exec();
    const count = results[1][1] as number;

    return {
      allowed: count < limit,
      remaining: Math.max(0, limit - count - 1)
    };
  }

  // Leaderboard implementation
  async updateLeaderboard(
    leaderboardId: string,
    userId: string,
    score: number
  ): Promise<void> {
    const key = \`leaderboard:\${leaderboardId}\`;
    await this.redis.zadd(key, score, userId);
  }

  async getLeaderboard(
    leaderboardId: string,
    start: number = 0,
    end: number = 9
  ): Promise<Array<{ userId: string; score: number; rank: number }>> {
    const key = \`leaderboard:\${leaderboardId}\`;

    const results = await this.redis.zrevrange(
      key,
      start,
      end,
      'WITHSCORES'
    );

    const leaderboard = [];
    for (let i = 0; i < results.length; i += 2) {
      leaderboard.push({
        userId: results[i],
        score: parseFloat(results[i + 1]),
        rank: start + (i / 2) + 1
      });
    }

    return leaderboard;
  }

  // Distributed locking
  async acquireLock(
    lockKey: string,
    ttl: number = 10000
  ): Promise<string | null> {
    const lockValue = \`\${Date.now()}-\${Math.random()}\`;

    const result = await this.redis.set(
      \`lock:\${lockKey}\`,
      lockValue,
      'PX',
      ttl,
      'NX'
    );

    return result === 'OK' ? lockValue : null;
  }

  async releaseLock(lockKey: string, lockValue: string): Promise<boolean> {
    const script = \`
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    \`;

    const result = await this.redis.eval(
      script,
      1,
      \`lock:\${lockKey}\`,
      lockValue
    );

    return result === 1;
  }

  // Session storage
  async setSession(
    sessionId: string,
    sessionData: any,
    ttl: number = 86400
  ): Promise<void> {
    const key = \`session:\${sessionId}\`;
    await this.redis.hmset(key, sessionData);
    await this.redis.expire(key, ttl);
  }

  async getSession(sessionId: string): Promise<any> {
    const key = \`session:\${sessionId}\`;
    return await this.redis.hgetall(key);
  }

  async updateSessionField(
    sessionId: string,
    field: string,
    value: string
  ): Promise<void> {
    const key = \`session:\${sessionId}\`;
    await this.redis.hset(key, field, value);
  }
}
\`\`\`

## 7. Cache Monitoring and Metrics

### Performance Monitoring
\`\`\`typescript
export class CacheMonitor {
  private cache: CacheService;
  private metrics: Map<string, CacheMetrics> = new Map();

  constructor(cache: CacheService) {
    this.cache = cache;
    this.startMetricsCollection();
  }

  async get<T>(key: string): Promise<T | null> {
    const startTime = Date.now();
    const result = await this.cache.get<T>(key);
    const duration = Date.now() - startTime;

    this.recordMetric(key, {
      operation: 'get',
      hit: result !== null,
      duration
    });

    return result;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    const startTime = Date.now();
    const result = await this.cache.set(key, value, ttl);
    const duration = Date.now() - startTime;

    this.recordMetric(key, {
      operation: 'set',
      success: result,
      duration
    });

    return result;
  }

  private recordMetric(key: string, metric: any): void {
    const keyPrefix = key.split(':')[0];
    const existing = this.metrics.get(keyPrefix) || {
      hits: 0,
      misses: 0,
      sets: 0,
      totalDuration: 0,
      operationCount: 0
    };

    if (metric.operation === 'get') {
      if (metric.hit) {
        existing.hits++;
      } else {
        existing.misses++;
      }
    } else if (metric.operation === 'set') {
      existing.sets++;
    }

    existing.totalDuration += metric.duration;
    existing.operationCount++;

    this.metrics.set(keyPrefix, existing);
  }

  getMetrics(): Map<string, CacheMetrics & { hitRatio: number; avgDuration: number }> {
    const result = new Map();

    for (const [key, metrics] of this.metrics.entries()) {
      const total = metrics.hits + metrics.misses;
      result.set(key, {
        ...metrics,
        hitRatio: total > 0 ? metrics.hits / total : 0,
        avgDuration: metrics.operationCount > 0
          ? metrics.totalDuration / metrics.operationCount
          : 0
      });
    }

    return result;
  }

  private startMetricsCollection(): void {
    setInterval(() => {
      const metrics = this.getMetrics();
      console.log('Cache Metrics:', Object.fromEntries(metrics));

      // Reset metrics for next interval
      this.metrics.clear();
    }, 60000); // Every minute
  }
}

interface CacheMetrics {
  hits: number;
  misses: number;
  sets: number;
  totalDuration: number;
  operationCount: number;
}
\`\`\`

## 8. Testing Cache Implementation

### Comprehensive Test Suite
\`\`\`typescript
import { describe, test, expect, beforeEach, afterEach } from '@jest/jest';
import Redis from 'ioredis-mock';
import { CacheService } from '../src/cache-service';

describe('CacheService', () => {
  let cache: CacheService;
  let redis: Redis;

  beforeEach(() => {
    redis = new Redis();
    cache = new CacheService({
      host: 'localhost',
      port: 6379,
      db: 0,
      keyPrefix: 'test:'
    });
    // Replace redis instance with mock
    (cache as any).redis = redis;
  });

  afterEach(async () => {
    await redis.flushall();
    redis.disconnect();
  });

  test('should set and get values', async () => {
    const key = 'test-key';
    const value = { id: 1, name: 'Test' };

    await cache.set(key, value);
    const result = await cache.get(key);

    expect(result).toEqual(value);
  });

  test('should handle TTL expiration', async () => {
    const key = 'test-ttl';
    const value = 'test-value';

    await cache.set(key, value, 1); // 1 second TTL

    // Should exist immediately
    const immediate = await cache.get(key);
    expect(immediate).toBe(value);

    // Should expire after TTL
    await new Promise(resolve => setTimeout(resolve, 1100));
    const expired = await cache.get(key);
    expect(expired).toBeNull();
  });

  test('should handle getOrSet pattern', async () => {
    const key = 'test-get-or-set';
    let factoryCalled = 0;

    const factory = async () => {
      factoryCalled++;
      return { id: 1, name: 'Generated' };
    };

    // First call should invoke factory
    const result1 = await cache.getOrSet(key, factory);
    expect(factoryCalled).toBe(1);
    expect(result1).toEqual({ id: 1, name: 'Generated' });

    // Second call should use cache
    const result2 = await cache.getOrSet(key, factory);
    expect(factoryCalled).toBe(1); // Factory not called again
    expect(result2).toEqual({ id: 1, name: 'Generated' });
  });

  test('should invalidate patterns', async () => {
    await Promise.all([
      cache.set('user:1', { id: 1 }),
      cache.set('user:2', { id: 2 }),
      cache.set('product:1', { id: 1 })
    ]);

    const deleted = await cache.invalidatePattern('user:*');
    expect(deleted).toBe(2);

    // User keys should be gone
    expect(await cache.get('user:1')).toBeNull();
    expect(await cache.get('user:2')).toBeNull();

    // Product key should remain
    expect(await cache.get('product:1')).toEqual({ id: 1 });
  });

  test('should handle Redis failures gracefully', async () => {
    // Simulate Redis failure
    const failingRedis = {
      get: jest.fn().mockRejectedValue(new Error('Redis down')),
      setex: jest.fn().mockRejectedValue(new Error('Redis down')),
      del: jest.fn().mockRejectedValue(new Error('Redis down'))
    };

    (cache as any).redis = failingRedis;

    // Should return null on get failure
    const result = await cache.get('test');
    expect(result).toBeNull();

    // Should return false on set failure
    const setResult = await cache.set('test', 'value');
    expect(setResult).toBe(false);

    // Should return 0 on delete failure
    const delResult = await cache.del('test');
    expect(delResult).toBe(0);
  });
});
\`\`\`

## 9. Production Optimization

### Memory and Performance Tuning
\`\`\`typescript
export class CacheOptimizer {
  static optimizeRedisConfig() {
    return {
      // Memory optimization
      maxmemory: '2gb',
      'maxmemory-policy': 'allkeys-lru',
      'maxmemory-samples': 5,

      // Network optimization
      'tcp-nodelay': 'yes',
      'tcp-keepalive': 60,

      // Persistence optimization
      save: ['900 1', '300 10', '60 10000'],
      'rdbcompression': 'yes',
      'rdbchecksum': 'yes',

      // Client optimization
      timeout: 300,
      'client-output-buffer-limit': [
        'normal 0 0 0',
        'replica 256mb 64mb 60',
        'pubsub 32mb 8mb 60'
      ]
    };
  }

  static createKeyNamingStrategy() {
    return {
      // Use consistent, hierarchical naming
      userKey: (id: string) => \`user:\${id}\`,
      userEmailKey: (email: string) => \`user:email:\${email}\`,
      userSessionKey: (sessionId: string) => \`session:\${sessionId}\`,

      // Use prefixes for easy pattern matching
      productKey: (id: string) => \`product:\${id}\`,
      productCategoryKey: (category: string) => \`products:category:\${category}\`,

      // Include version in keys for cache busting
      versionedKey: (key: string, version: string) => \`\${key}:v\${version}\`,

      // Use short, meaningful prefixes to save memory
      lockKey: (resource: string) => \`lock:\${resource}\`,
      rateLimitKey: (userId: string) => \`rl:\${userId}\`
    };
  }
}
\`\`\`

## 10. Deployment and Scaling

### Redis Cluster Configuration
\`\`\`yaml
# redis-cluster.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis-cluster
spec:
  serviceName: redis-cluster
  replicas: 6
  selector:
    matchLabels:
      app: redis-cluster
  template:
    metadata:
      labels:
        app: redis-cluster
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        - containerPort: 16379
        env:
        - name: REDIS_CLUSTER_ANNOUNCE_IP
          valueFrom:
            fieldRef:
              fieldPath: status.podIP
        command:
        - redis-server
        args:
        - /etc/redis/redis.conf
        - --cluster-enabled
        - "yes"
        - --cluster-config-file
        - /data/nodes.conf
        - --cluster-node-timeout
        - "5000"
        - --appendonly
        - "yes"
        volumeMounts:
        - name: data
          mountPath: /data
        - name: config
          mountPath: /etc/redis
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1"
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
\`\`\`

## Implementation Checklist

- [ ] Set up Redis server with production configuration
- [ ] Implement cache service with proper error handling
- [ ] Choose appropriate caching patterns (cache-aside, write-through, etc.)
- [ ] Design cache key naming strategy
- [ ] Implement cache warming for critical data
- [ ] Set up multi-level caching if needed
- [ ] Use Redis data structures for advanced use cases
- [ ] Implement cache monitoring and metrics
- [ ] Write comprehensive tests for cache functionality
- [ ] Configure Redis cluster for high availability
- [ ] Set up cache invalidation strategies
- [ ] Monitor cache hit ratios and performance metrics

This guide provides a comprehensive foundation for implementing Redis caching strategies that can significantly improve application performance and scalability while maintaining data consistency and reliability.`,
};
