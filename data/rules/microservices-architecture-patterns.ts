export default {
	title: "Microservices Architecture Patterns and Implementation",
	tags: ["microservices", "architecture", "distributed-systems", "apis", "scaling"],
	languages: ["javascript", "typescript", "python", "java", "go"],
	description:
		"Comprehensive guide for designing and implementing microservices architecture with communication patterns, data management, and deployment strategies.",
	content: `# Microservices Architecture Patterns and Implementation

## 1. Microservices Architecture Design Principles

### Core Design Principles
\`\`\`typescript
// Service boundaries based on business capabilities
interface ServiceBoundary {
  domain: string;
  responsibilities: string[];
  dataOwnership: string[];
  apis: ServiceAPI[];
  dependencies: string[];
}

// Example: E-commerce service boundaries
const userService: ServiceBoundary = {
  domain: 'User Management',
  responsibilities: [
    'User registration and authentication',
    'Profile management',
    'User preferences'
  ],
  dataOwnership: ['users', 'profiles', 'preferences'],
  apis: ['/users', '/auth', '/profiles'],
  dependencies: ['notification-service']
};

const orderService: ServiceBoundary = {
  domain: 'Order Management',
  responsibilities: [
    'Order creation and processing',
    'Order history',
    'Order status tracking'
  ],
  dataOwnership: ['orders', 'order_items'],
  apis: ['/orders', '/order-history'],
  dependencies: ['user-service', 'inventory-service', 'payment-service']
};

const inventoryService: ServiceBoundary = {
  domain: 'Inventory Management',
  responsibilities: [
    'Product catalog',
    'Stock management',
    'Pricing'
  ],
  dataOwnership: ['products', 'inventory', 'prices'],
  apis: ['/products', '/inventory'],
  dependencies: []
};
\`\`\`

### Service Design Template
\`\`\`typescript
interface MicroserviceConfiguration {
  serviceName: string;
  version: string;
  port: number;
  database: DatabaseConfig;
  messaging: MessagingConfig;
  monitoring: MonitoringConfig;
  security: SecurityConfig;
}

class BaseService {
  protected config: MicroserviceConfiguration;
  protected logger: Logger;
  protected metrics: MetricsCollector;
  protected healthChecker: HealthChecker;

  constructor(config: MicroserviceConfiguration) {
    this.config = config;
    this.logger = new Logger(config.serviceName);
    this.metrics = new MetricsCollector(config.monitoring);
    this.healthChecker = new HealthChecker();
  }

  async start(): Promise<void> {
    await this.initializeDatabase();
    await this.setupMessaging();
    await this.registerServiceDiscovery();
    await this.startHttpServer();
    this.logger.info(\`\${this.config.serviceName} started on port \${this.config.port}\`);
  }

  async stop(): Promise<void> {
    await this.gracefulShutdown();
    this.logger.info(\`\${this.config.serviceName} stopped\`);
  }

  protected abstract initializeDatabase(): Promise<void>;
  protected abstract setupMessaging(): Promise<void>;
  protected abstract registerServiceDiscovery(): Promise<void>;
  protected abstract startHttpServer(): Promise<void>;
  protected abstract gracefulShutdown(): Promise<void>;
}
\`\`\`

## 2. Service Communication Patterns

### Synchronous Communication with Circuit Breaker
\`\`\`typescript
interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number;
  monitoringPeriod: number;
}

enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private successCount: number = 0;

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CircuitState.HALF_OPEN;
        this.successCount = 0;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private shouldAttemptReset(): boolean {
    return Date.now() - this.lastFailureTime >= this.config.recoveryTimeout;
  }

  private onSuccess(): void {
    this.failures = 0;
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= 3) { // Configurable success threshold
        this.state = CircuitState.CLOSED;
      }
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN;
    }
  }
}

// Service client with circuit breaker
class UserServiceClient {
  private circuitBreaker: CircuitBreaker;
  private httpClient: HttpClient;

  constructor(baseUrl: string) {
    this.httpClient = new HttpClient(baseUrl);
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 5,
      recoveryTimeout: 30000,
      monitoringPeriod: 10000
    });
  }

  async getUser(userId: string): Promise<User | null> {
    return await this.circuitBreaker.execute(async () => {
      const response = await this.httpClient.get(\`/users/\${userId}\`);
      return response.data;
    });
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    return await this.circuitBreaker.execute(async () => {
      const response = await this.httpClient.post('/users', userData);
      return response.data;
    });
  }
}
\`\`\`

### Asynchronous Communication with Event Bus
\`\`\`typescript
interface Event {
  id: string;
  type: string;
  source: string;
  timestamp: Date;
  data: any;
  correlationId?: string;
}

interface EventHandler<T = any> {
  eventType: string;
  handler: (event: Event<T>) => Promise<void>;
}

class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();
  private messageQueue: MessageQueue;

  constructor(messageQueue: MessageQueue) {
    this.messageQueue = messageQueue;
  }

  async publish(event: Event): Promise<void> {
    await this.messageQueue.publish(event.type, event);
  }

  subscribe<T>(eventType: string, handler: (event: Event<T>) => Promise<void>): void {
    const handlers = this.handlers.get(eventType) || [];
    handlers.push({ eventType, handler });
    this.handlers.set(eventType, handlers);

    // Subscribe to message queue
    this.messageQueue.subscribe(eventType, async (message) => {
      const event = JSON.parse(message) as Event<T>;
      await handler(event);
    });
  }

  async handleEvent(event: Event): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];

    await Promise.all(
      handlers.map(async ({ handler }) => {
        try {
          await handler(event);
        } catch (error) {
          console.error(\`Error handling event \${event.type}:\`, error);
          // Implement dead letter queue or retry logic
        }
      })
    );
  }
}

// Example usage in Order Service
class OrderService extends BaseService {
  private eventBus: EventBus;
  private userServiceClient: UserServiceClient;
  private inventoryServiceClient: InventoryServiceClient;

  constructor(config: MicroserviceConfiguration) {
    super(config);
    this.eventBus = new EventBus(new MessageQueue(config.messaging));
    this.userServiceClient = new UserServiceClient(config.userServiceUrl);
    this.inventoryServiceClient = new InventoryServiceClient(config.inventoryServiceUrl);

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.eventBus.subscribe('user.updated', this.handleUserUpdated.bind(this));
    this.eventBus.subscribe('inventory.stock.low', this.handleLowStock.bind(this));
  }

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    // Validate user exists
    const user = await this.userServiceClient.getUser(orderData.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check inventory
    const inventoryCheck = await this.inventoryServiceClient.checkAvailability(
      orderData.items
    );
    if (!inventoryCheck.available) {
      throw new Error('Insufficient inventory');
    }

    // Create order
    const order = await this.orderRepository.create(orderData);

    // Publish events
    await this.eventBus.publish({
      id: generateId(),
      type: 'order.created',
      source: 'order-service',
      timestamp: new Date(),
      data: order,
      correlationId: orderData.correlationId
    });

    return order;
  }

  private async handleUserUpdated(event: Event<UserUpdatedData>): Promise<void> {
    // Update user information in order history
    await this.orderRepository.updateUserInfo(event.data.userId, event.data);
  }

  private async handleLowStock(event: Event<LowStockData>): Promise<void> {
    // Notify customers with pending orders
    const affectedOrders = await this.orderRepository.findByProduct(event.data.productId);
    // Send notifications...
  }
}
\`\`\`

## 3. Data Management Patterns

### Database per Service Pattern
\`\`\`typescript
// User Service Database Schema
interface UserDatabase {
  users: {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  };
  profiles: {
    userId: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  preferences: {
    userId: string;
    notifications: boolean;
    theme: string;
  };
}

// Order Service Database Schema
interface OrderDatabase {
  orders: {
    id: string;
    userId: string; // Reference only, no foreign key
    status: OrderStatus;
    totalAmount: number;
    createdAt: Date;
  };
  orderItems: {
    id: string;
    orderId: string;
    productId: string; // Reference only
    quantity: number;
    price: number;
  };
}

// Saga Pattern for Distributed Transactions
interface SagaStep {
  serviceName: string;
  action: string;
  compensationAction: string;
  data: any;
}

class OrderSaga {
  private steps: SagaStep[] = [];
  private completedSteps: SagaStep[] = [];

  constructor(private eventBus: EventBus) {}

  async execute(orderData: CreateOrderRequest): Promise<void> {
    this.steps = [
      {
        serviceName: 'inventory-service',
        action: 'reserve-items',
        compensationAction: 'release-items',
        data: { items: orderData.items }
      },
      {
        serviceName: 'payment-service',
        action: 'charge-payment',
        compensationAction: 'refund-payment',
        data: { amount: orderData.totalAmount, paymentMethod: orderData.paymentMethod }
      },
      {
        serviceName: 'order-service',
        action: 'create-order',
        compensationAction: 'cancel-order',
        data: orderData
      }
    ];

    try {
      for (const step of this.steps) {
        await this.executeStep(step);
        this.completedSteps.push(step);
      }

      await this.eventBus.publish({
        id: generateId(),
        type: 'order.saga.completed',
        source: 'order-saga',
        timestamp: new Date(),
        data: { orderId: orderData.id }
      });

    } catch (error) {
      await this.compensate();
      throw error;
    }
  }

  private async executeStep(step: SagaStep): Promise<void> {
    await this.eventBus.publish({
      id: generateId(),
      type: \`saga.\${step.serviceName}.\${step.action}\`,
      source: 'order-saga',
      timestamp: new Date(),
      data: step.data
    });
  }

  private async compensate(): Promise<void> {
    // Execute compensation actions in reverse order
    for (const step of this.completedSteps.reverse()) {
      try {
        await this.eventBus.publish({
          id: generateId(),
          type: \`saga.\${step.serviceName}.\${step.compensationAction}\`,
          source: 'order-saga',
          timestamp: new Date(),
          data: step.data
        });
      } catch (error) {
        console.error(\`Failed to compensate step \${step.serviceName}:\`, error);
      }
    }
  }
}
\`\`\`

### Event Sourcing Implementation
\`\`\`typescript
interface DomainEvent {
  aggregateId: string;
  eventType: string;
  eventData: any;
  version: number;
  timestamp: Date;
  metadata?: any;
}

class EventStore {
  private events: Map<string, DomainEvent[]> = new Map();

  async saveEvents(
    aggregateId: string,
    events: DomainEvent[],
    expectedVersion: number
  ): Promise<void> {
    const existingEvents = this.events.get(aggregateId) || [];

    if (existingEvents.length !== expectedVersion) {
      throw new Error('Concurrency conflict');
    }

    const newEvents = events.map((event, index) => ({
      ...event,
      version: expectedVersion + index + 1
    }));

    this.events.set(aggregateId, [...existingEvents, ...newEvents]);

    // Publish events to event bus
    for (const event of newEvents) {
      await this.eventBus.publish({
        id: generateId(),
        type: event.eventType,
        source: 'event-store',
        timestamp: event.timestamp,
        data: event
      });
    }
  }

  async getEvents(aggregateId: string, fromVersion?: number): Promise<DomainEvent[]> {
    const events = this.events.get(aggregateId) || [];
    return fromVersion ? events.filter(e => e.version > fromVersion) : events;
  }
}

// Order Aggregate with Event Sourcing
class OrderAggregate {
  private id: string;
  private version: number = 0;
  private uncommittedEvents: DomainEvent[] = [];

  // State
  private userId: string;
  private status: OrderStatus;
  private items: OrderItem[] = [];
  private totalAmount: number = 0;

  constructor(id: string) {
    this.id = id;
  }

  static fromHistory(id: string, events: DomainEvent[]): OrderAggregate {
    const aggregate = new OrderAggregate(id);

    for (const event of events) {
      aggregate.applyEvent(event);
      aggregate.version = event.version;
    }

    return aggregate;
  }

  createOrder(userId: string, items: OrderItem[]): void {
    if (this.status) {
      throw new Error('Order already exists');
    }

    const event: DomainEvent = {
      aggregateId: this.id,
      eventType: 'OrderCreated',
      eventData: { userId, items, totalAmount: this.calculateTotal(items) },
      version: 0,
      timestamp: new Date()
    };

    this.applyEvent(event);
    this.uncommittedEvents.push(event);
  }

  updateStatus(newStatus: OrderStatus): void {
    if (this.status === newStatus) return;

    const event: DomainEvent = {
      aggregateId: this.id,
      eventType: 'OrderStatusUpdated',
      eventData: { oldStatus: this.status, newStatus },
      version: 0,
      timestamp: new Date()
    };

    this.applyEvent(event);
    this.uncommittedEvents.push(event);
  }

  private applyEvent(event: DomainEvent): void {
    switch (event.eventType) {
      case 'OrderCreated':
        this.userId = event.eventData.userId;
        this.items = event.eventData.items;
        this.totalAmount = event.eventData.totalAmount;
        this.status = OrderStatus.PENDING;
        break;

      case 'OrderStatusUpdated':
        this.status = event.eventData.newStatus;
        break;

      default:
        throw new Error(\`Unknown event type: \${event.eventType}\`);
    }
  }

  getUncommittedEvents(): DomainEvent[] {
    return [...this.uncommittedEvents];
  }

  markEventsAsCommitted(): void {
    this.uncommittedEvents = [];
  }

  private calculateTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}
\`\`\`

## 4. Service Discovery and Load Balancing

### Service Registry Implementation
\`\`\`typescript
interface ServiceInstance {
  id: string;
  serviceName: string;
  host: string;
  port: number;
  healthCheckUrl: string;
  metadata: Map<string, string>;
  lastHeartbeat: Date;
}

class ServiceRegistry {
  private services: Map<string, ServiceInstance[]> = new Map();
  private readonly heartbeatInterval = 30000; // 30 seconds
  private readonly serviceTimeout = 90000; // 90 seconds

  constructor() {
    this.startHealthChecking();
  }

  async register(instance: ServiceInstance): Promise<void> {
    const instances = this.services.get(instance.serviceName) || [];

    // Remove existing instance with same id
    const filtered = instances.filter(i => i.id !== instance.id);
    filtered.push(instance);

    this.services.set(instance.serviceName, filtered);
    console.log(\`Registered service: \${instance.serviceName} (\${instance.id})\`);
  }

  async deregister(serviceName: string, instanceId: string): Promise<void> {
    const instances = this.services.get(serviceName) || [];
    const filtered = instances.filter(i => i.id !== instanceId);
    this.services.set(serviceName, filtered);
    console.log(\`Deregistered service: \${serviceName} (\${instanceId})\`);
  }

  async discover(serviceName: string): Promise<ServiceInstance[]> {
    return this.services.get(serviceName) || [];
  }

  async heartbeat(serviceName: string, instanceId: string): Promise<void> {
    const instances = this.services.get(serviceName) || [];
    const instance = instances.find(i => i.id === instanceId);

    if (instance) {
      instance.lastHeartbeat = new Date();
    }
  }

  private startHealthChecking(): void {
    setInterval(async () => {
      const now = new Date();

      for (const [serviceName, instances] of this.services.entries()) {
        const healthyInstances = instances.filter(instance => {
          const timeSinceHeartbeat = now.getTime() - instance.lastHeartbeat.getTime();
          return timeSinceHeartbeat < this.serviceTimeout;
        });

        if (healthyInstances.length !== instances.length) {
          this.services.set(serviceName, healthyInstances);
          console.log(\`Removed unhealthy instances for \${serviceName}\`);
        }
      }
    }, this.heartbeatInterval);
  }
}

// Load Balancer with different strategies
enum LoadBalancingStrategy {
  ROUND_ROBIN = 'ROUND_ROBIN',
  RANDOM = 'RANDOM',
  LEAST_CONNECTIONS = 'LEAST_CONNECTIONS'
}

class LoadBalancer {
  private roundRobinCounters: Map<string, number> = new Map();
  private connections: Map<string, number> = new Map();

  constructor(
    private serviceRegistry: ServiceRegistry,
    private strategy: LoadBalancingStrategy = LoadBalancingStrategy.ROUND_ROBIN
  ) {}

  async getServiceInstance(serviceName: string): Promise<ServiceInstance | null> {
    const instances = await this.serviceRegistry.discover(serviceName);
    if (instances.length === 0) return null;

    switch (this.strategy) {
      case LoadBalancingStrategy.ROUND_ROBIN:
        return this.roundRobinSelection(serviceName, instances);

      case LoadBalancingStrategy.RANDOM:
        return this.randomSelection(instances);

      case LoadBalancingStrategy.LEAST_CONNECTIONS:
        return this.leastConnectionsSelection(instances);

      default:
        return instances[0];
    }
  }

  private roundRobinSelection(serviceName: string, instances: ServiceInstance[]): ServiceInstance {
    const counter = this.roundRobinCounters.get(serviceName) || 0;
    const selected = instances[counter % instances.length];
    this.roundRobinCounters.set(serviceName, counter + 1);
    return selected;
  }

  private randomSelection(instances: ServiceInstance[]): ServiceInstance {
    const index = Math.floor(Math.random() * instances.length);
    return instances[index];
  }

  private leastConnectionsSelection(instances: ServiceInstance[]): ServiceInstance {
    return instances.reduce((least, current) => {
      const leastConnections = this.connections.get(least.id) || 0;
      const currentConnections = this.connections.get(current.id) || 0;
      return currentConnections < leastConnections ? current : least;
    });
  }

  incrementConnections(instanceId: string): void {
    const current = this.connections.get(instanceId) || 0;
    this.connections.set(instanceId, current + 1);
  }

  decrementConnections(instanceId: string): void {
    const current = this.connections.get(instanceId) || 0;
    this.connections.set(instanceId, Math.max(0, current - 1));
  }
}
\`\`\`

## 5. API Gateway Implementation

### Comprehensive API Gateway
\`\`\`typescript
interface Route {
  path: string;
  method: string;
  serviceName: string;
  targetPath: string;
  middlewares: Middleware[];
  rateLimit?: RateLimitConfig;
  cacheConfig?: CacheConfig;
}

interface Middleware {
  name: string;
  execute: (request: any, response: any, next: () => void) => Promise<void>;
}

class APIGateway {
  private routes: Map<string, Route> = new Map();
  private loadBalancer: LoadBalancer;
  private rateLimiter: RateLimiter;
  private cache: CacheService;

  constructor(
    loadBalancer: LoadBalancer,
    rateLimiter: RateLimiter,
    cache: CacheService
  ) {
    this.loadBalancer = loadBalancer;
    this.rateLimiter = rateLimiter;
    this.cache = cache;
  }

  addRoute(route: Route): void {
    const key = \`\${route.method}:\${route.path}\`;
    this.routes.set(key, route);
  }

  async handleRequest(request: any, response: any): Promise<void> {
    const routeKey = \`\${request.method}:\${request.path}\`;
    const route = this.findMatchingRoute(routeKey, request.path);

    if (!route) {
      response.status(404).json({ error: 'Route not found' });
      return;
    }

    try {
      // Apply middlewares
      await this.applyMiddlewares(route.middlewares, request, response);

      // Rate limiting
      if (route.rateLimit) {
        const allowed = await this.rateLimiter.checkLimit(
          request.ip,
          route.rateLimit
        );
        if (!allowed) {
          response.status(429).json({ error: 'Rate limit exceeded' });
          return;
        }
      }

      // Check cache
      if (route.cacheConfig && request.method === 'GET') {
        const cacheKey = this.generateCacheKey(request);
        const cached = await this.cache.get(cacheKey);
        if (cached) {
          response.json(cached);
          return;
        }
      }

      // Route to service
      const serviceResponse = await this.routeToService(route, request);

      // Cache response
      if (route.cacheConfig && request.method === 'GET') {
        const cacheKey = this.generateCacheKey(request);
        await this.cache.set(cacheKey, serviceResponse.data, route.cacheConfig.ttl);
      }

      response.status(serviceResponse.status).json(serviceResponse.data);

    } catch (error) {
      console.error('Gateway error:', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  }

  private findMatchingRoute(routeKey: string, path: string): Route | null {
    // Exact match first
    const exactMatch = this.routes.get(routeKey);
    if (exactMatch) return exactMatch;

    // Pattern matching for dynamic routes
    for (const [key, route] of this.routes.entries()) {
      if (this.matchesPattern(route.path, path)) {
        return route;
      }
    }

    return null;
  }

  private matchesPattern(pattern: string, path: string): boolean {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) return false;

    return patternParts.every((part, index) => {
      return part.startsWith(':') || part === pathParts[index];
    });
  }

  private async applyMiddlewares(
    middlewares: Middleware[],
    request: any,
    response: any
  ): Promise<void> {
    for (const middleware of middlewares) {
      await new Promise<void>((resolve, reject) => {
        middleware.execute(request, response, () => resolve()).catch(reject);
      });
    }
  }

  private async routeToService(route: Route, request: any): Promise<any> {
    const serviceInstance = await this.loadBalancer.getServiceInstance(route.serviceName);

    if (!serviceInstance) {
      throw new Error(\`No healthy instances for service \${route.serviceName}\`);
    }

    const targetUrl = \`http://\${serviceInstance.host}:\${serviceInstance.port}\${route.targetPath}\`;

    // Make HTTP request to service
    const httpClient = new HttpClient();
    return await httpClient.request({
      method: request.method,
      url: targetUrl,
      headers: this.forwardHeaders(request.headers),
      data: request.body,
      params: request.query
    });
  }

  private forwardHeaders(headers: any): any {
    // Forward necessary headers, filter out gateway-specific ones
    const forwardedHeaders = { ...headers };
    delete forwardedHeaders['host'];
    delete forwardedHeaders['connection'];

    // Add correlation ID for tracing
    forwardedHeaders['x-correlation-id'] = headers['x-correlation-id'] || generateId();

    return forwardedHeaders;
  }

  private generateCacheKey(request: any): string {
    return \`\${request.method}:\${request.path}:\${JSON.stringify(request.query)}\`;
  }
}
\`\`\`

## 6. Monitoring and Observability

### Distributed Tracing Implementation
\`\`\`typescript
interface TraceSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  serviceName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  tags: Map<string, string>;
  logs: TraceLog[];
  status: SpanStatus;
}

interface TraceLog {
  timestamp: number;
  level: string;
  message: string;
  fields?: Map<string, any>;
}

enum SpanStatus {
  OK = 'OK',
  ERROR = 'ERROR',
  TIMEOUT = 'TIMEOUT'
}

class DistributedTracing {
  private spans: Map<string, TraceSpan> = new Map();
  private activeSpans: Map<string, TraceSpan> = new Map();

  startSpan(
    operationName: string,
    serviceName: string,
    parentSpanId?: string,
    traceId?: string
  ): TraceSpan {
    const span: TraceSpan = {
      traceId: traceId || generateId(),
      spanId: generateId(),
      parentSpanId,
      operationName,
      serviceName,
      startTime: Date.now(),
      tags: new Map(),
      logs: [],
      status: SpanStatus.OK
    };

    this.spans.set(span.spanId, span);
    this.activeSpans.set(span.spanId, span);

    return span;
  }

  finishSpan(spanId: string, status: SpanStatus = SpanStatus.OK): void {
    const span = this.activeSpans.get(spanId);
    if (!span) return;

    span.endTime = Date.now();
    span.duration = span.endTime - span.startTime;
    span.status = status;

    this.activeSpans.delete(spanId);

    // Send to tracing backend (Jaeger, Zipkin, etc.)
    this.sendToTracingBackend(span);
  }

  addTag(spanId: string, key: string, value: string): void {
    const span = this.activeSpans.get(spanId);
    if (span) {
      span.tags.set(key, value);
    }
  }

  addLog(spanId: string, level: string, message: string, fields?: Map<string, any>): void {
    const span = this.activeSpans.get(spanId);
    if (span) {
      span.logs.push({
        timestamp: Date.now(),
        level,
        message,
        fields
      });
    }
  }

  private async sendToTracingBackend(span: TraceSpan): Promise<void> {
    // Implementation depends on your tracing backend
    console.log('Sending span to tracing backend:', span);
  }
}

// Instrumented service base class
class InstrumentedService extends BaseService {
  protected tracing: DistributedTracing;

  constructor(config: MicroserviceConfiguration) {
    super(config);
    this.tracing = new DistributedTracing();
  }

  protected async executeWithTracing<T>(
    operationName: string,
    operation: (span: TraceSpan) => Promise<T>,
    parentSpanId?: string
  ): Promise<T> {
    const span = this.tracing.startSpan(
      operationName,
      this.config.serviceName,
      parentSpanId
    );

    try {
      span.tags.set('service.name', this.config.serviceName);
      span.tags.set('service.version', this.config.version);

      const result = await operation(span);

      this.tracing.finishSpan(span.spanId, SpanStatus.OK);
      return result;

    } catch (error) {
      this.tracing.addLog(span.spanId, 'ERROR', error.message);
      this.tracing.finishSpan(span.spanId, SpanStatus.ERROR);
      throw error;
    }
  }
}
\`\`\`

## 7. Security Patterns

### Service-to-Service Authentication
\`\`\`typescript
interface ServiceToken {
  serviceName: string;
  permissions: string[];
  issuedAt: number;
  expiresAt: number;
  signature: string;
}

class ServiceAuthenticator {
  private secretKey: string;
  private tokenTTL: number = 3600000; // 1 hour

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  generateToken(serviceName: string, permissions: string[]): string {
    const token: ServiceToken = {
      serviceName,
      permissions,
      issuedAt: Date.now(),
      expiresAt: Date.now() + this.tokenTTL,
      signature: ''
    };

    const payload = JSON.stringify({
      serviceName: token.serviceName,
      permissions: token.permissions,
      issuedAt: token.issuedAt,
      expiresAt: token.expiresAt
    });

    token.signature = this.createSignature(payload);

    return Buffer.from(JSON.stringify(token)).toString('base64');
  }

  validateToken(tokenString: string): ServiceToken | null {
    try {
      const token: ServiceToken = JSON.parse(
        Buffer.from(tokenString, 'base64').toString()
      );

      // Check expiration
      if (Date.now() > token.expiresAt) {
        return null;
      }

      // Verify signature
      const payload = JSON.stringify({
        serviceName: token.serviceName,
        permissions: token.permissions,
        issuedAt: token.issuedAt,
        expiresAt: token.expiresAt
      });

      const expectedSignature = this.createSignature(payload);
      if (token.signature !== expectedSignature) {
        return null;
      }

      return token;

    } catch (error) {
      return null;
    }
  }

  private createSignature(payload: string): string {
    const crypto = require('crypto');
    return crypto.createHmac('sha256', this.secretKey)
                 .update(payload)
                 .digest('hex');
  }
}

// Authentication middleware
const authenticationMiddleware: Middleware = {
  name: 'authentication',
  execute: async (request: any, response: any, next: () => void) => {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      response.status(401).json({ error: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.substring(7);
    const authenticator = new ServiceAuthenticator(process.env.SERVICE_SECRET!);
    const validatedToken = authenticator.validateToken(token);

    if (!validatedToken) {
      response.status(401).json({ error: 'Invalid token' });
      return;
    }

    request.serviceToken = validatedToken;
    next();
  }
};
\`\`\`

## 8. Testing Strategies

### Integration Testing Framework
\`\`\`typescript
class TestEnvironment {
  private services: Map<string, TestService> = new Map();
  private messageQueue: TestMessageQueue;
  private database: TestDatabase;

  constructor() {
    this.messageQueue = new TestMessageQueue();
    this.database = new TestDatabase();
  }

  async startService(serviceName: string, config: any): Promise<TestService> {
    const service = new TestService(serviceName, config, this.messageQueue, this.database);
    await service.start();
    this.services.set(serviceName, service);
    return service;
  }

  async stopService(serviceName: string): Promise<void> {
    const service = this.services.get(serviceName);
    if (service) {
      await service.stop();
      this.services.delete(serviceName);
    }
  }

  async stopAll(): Promise<void> {
    await Promise.all(
      Array.from(this.services.values()).map(service => service.stop())
    );
    this.services.clear();
  }

  getService(serviceName: string): TestService | undefined {
    return this.services.get(serviceName);
  }

  getMessageQueue(): TestMessageQueue {
    return this.messageQueue;
  }
}

describe('Order Service Integration Tests', () => {
  let testEnv: TestEnvironment;
  let orderService: TestService;
  let userService: TestService;
  let inventoryService: TestService;

  beforeEach(async () => {
    testEnv = new TestEnvironment();

    // Start dependent services
    userService = await testEnv.startService('user-service', {
      port: 3001,
      database: 'test_users'
    });

    inventoryService = await testEnv.startService('inventory-service', {
      port: 3002,
      database: 'test_inventory'
    });

    orderService = await testEnv.startService('order-service', {
      port: 3003,
      database: 'test_orders',
      dependencies: {
        userService: 'http://localhost:3001',
        inventoryService: 'http://localhost:3002'
      }
    });

    // Seed test data
    await userService.request('POST', '/users', {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User'
    });

    await inventoryService.request('POST', '/products', {
      id: 'product-1',
      name: 'Test Product',
      price: 99.99,
      stock: 10
    });
  });

  afterEach(async () => {
    await testEnv.stopAll();
  });

  test('should create order successfully', async () => {
    const orderData = {
      userId: 'user-1',
      items: [
        { productId: 'product-1', quantity: 2, price: 99.99 }
      ]
    };

    const response = await orderService.request('POST', '/orders', orderData);

    expect(response.status).toBe(201);
    expect(response.data.userId).toBe('user-1');
    expect(response.data.items).toHaveLength(1);

    // Verify inventory was updated
    const inventoryResponse = await inventoryService.request('GET', '/products/product-1');
    expect(inventoryResponse.data.stock).toBe(8);

    // Verify event was published
    const messages = testEnv.getMessageQueue().getMessages('order.created');
    expect(messages).toHaveLength(1);
  });

  test('should handle insufficient inventory', async () => {
    const orderData = {
      userId: 'user-1',
      items: [
        { productId: 'product-1', quantity: 15, price: 99.99 }
      ]
    };

    const response = await orderService.request('POST', '/orders', orderData);

    expect(response.status).toBe(400);
    expect(response.data.error).toContain('Insufficient inventory');
  });
});
\`\`\`

## 9. Deployment Strategies

### Kubernetes Microservices Deployment
\`\`\`yaml
# user-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  labels:
    app: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: myregistry/user-service:v1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: user-db-url
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: redis-config
              key: redis-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP

---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: user-service-vs
spec:
  http:
  - match:
    - uri:
        prefix: /users
    route:
    - destination:
        host: user-service
        port:
          number: 80
  - fault:
      delay:
        percentage:
          value: 0.1
        fixedDelay: 5s
\`\`\`

## 10. Performance Optimization

### Performance Monitoring and Optimization
\`\`\`typescript
class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();

  recordMetric(operation: string, duration: number, success: boolean): void {
    const metric: PerformanceMetric = {
      operation,
      duration,
      success,
      timestamp: Date.now()
    };

    const existing = this.metrics.get(operation) || [];
    existing.push(metric);

    // Keep only last 1000 metrics per operation
    if (existing.length > 1000) {
      existing.shift();
    }

    this.metrics.set(operation, existing);
  }

  getAverageResponseTime(operation: string, timeWindow: number = 300000): number {
    const metrics = this.getMetricsInWindow(operation, timeWindow);
    if (metrics.length === 0) return 0;

    const total = metrics.reduce((sum, metric) => sum + metric.duration, 0);
    return total / metrics.length;
  }

  getErrorRate(operation: string, timeWindow: number = 300000): number {
    const metrics = this.getMetricsInWindow(operation, timeWindow);
    if (metrics.length === 0) return 0;

    const errors = metrics.filter(m => !m.success).length;
    return errors / metrics.length;
  }

  getThroughput(operation: string, timeWindow: number = 300000): number {
    const metrics = this.getMetricsInWindow(operation, timeWindow);
    return (metrics.length / timeWindow) * 1000; // requests per second
  }

  private getMetricsInWindow(operation: string, timeWindow: number): PerformanceMetric[] {
    const metrics = this.metrics.get(operation) || [];
    const cutoff = Date.now() - timeWindow;
    return metrics.filter(m => m.timestamp > cutoff);
  }
}

interface PerformanceMetric {
  operation: string;
  duration: number;
  success: boolean;
  timestamp: number;
}
\`\`\`

## Implementation Checklist

- [ ] Define service boundaries based on business capabilities
- [ ] Implement service communication patterns (sync/async)
- [ ] Set up service discovery and load balancing
- [ ] Implement API gateway with routing and middleware
- [ ] Design data management strategy (database per service)
- [ ] Implement distributed transaction patterns (Saga, Event Sourcing)
- [ ] Set up distributed tracing and monitoring
- [ ] Implement service-to-service authentication
- [ ] Create comprehensive testing strategy
- [ ] Set up CI/CD pipelines for microservices
- [ ] Deploy to container orchestration platform
- [ ] Implement performance monitoring and alerting
- [ ] Plan for service versioning and backward compatibility
- [ ] Set up centralized logging and metrics collection

This comprehensive guide provides the foundation for building robust, scalable microservices architecture with proper patterns, communication strategies, and operational considerations.`,
};
