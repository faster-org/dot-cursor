export default {
	title: "MongoDB Database Design and Optimization",
	tags: ["mongodb", "database", "nosql", "schema-design", "performance"],
	languages: ["javascript", "typescript", "python"],
	description:
		"Comprehensive guide for MongoDB database design, schema optimization, indexing strategies, and performance tuning for scalable applications.",
	content: `# MongoDB Database Design and Optimization

## 1. Schema Design Patterns

### Document Structure Design
\`\`\`javascript
// User document with embedded profile
const userSchema = {
  _id: ObjectId,
  email: String,
  username: String,
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String,
    location: {
      city: String,
      country: String,
      coordinates: [Number] // [longitude, latitude]
    }
  },
  preferences: {
    theme: String,
    notifications: {
      email: Boolean,
      push: Boolean,
      sms: Boolean
    },
    privacy: {
      profileVisible: Boolean,
      showEmail: Boolean
    }
  },
  metadata: {
    createdAt: Date,
    updatedAt: Date,
    lastLoginAt: Date,
    loginCount: Number
  }
};

// Product catalog with variants
const productSchema = {
  _id: ObjectId,
  name: String,
  description: String,
  category: {
    primary: String,
    secondary: [String],
    tags: [String]
  },
  variants: [
    {
      _id: ObjectId,
      sku: String,
      attributes: {
        color: String,
        size: String,
        material: String
      },
      pricing: {
        cost: Number,
        price: Number,
        currency: String,
        discount: {
          type: String, // percentage, fixed
          value: Number,
          validUntil: Date
        }
      },
      inventory: {
        quantity: Number,
        reserved: Number,
        warehouse: String
      }
    }
  ],
  media: {
    images: [String],
    videos: [String],
    documents: [String]
  },
  seo: {
    slug: String,
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  status: String, // active, inactive, discontinued
  createdAt: Date,
  updatedAt: Date
};
\`\`\`

### Referenced vs Embedded Data
\`\`\`javascript
// Order with references to products (normalized approach)
const orderSchema = {
  _id: ObjectId,
  orderNumber: String,
  customerId: ObjectId, // Reference to User
  items: [
    {
      productId: ObjectId, // Reference to Product
      variantId: ObjectId,
      quantity: Number,
      priceAtTime: Number, // Snapshot of price when ordered
      productSnapshot: { // Denormalized product data
        name: String,
        sku: String,
        image: String
      }
    }
  ],
  shipping: {
    method: String,
    cost: Number,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    trackingNumber: String,
    estimatedDelivery: Date
  },
  payment: {
    method: String,
    transactionId: String,
    amount: Number,
    currency: String,
    status: String
  },
  status: String,
  timeline: [
    {
      status: String,
      timestamp: Date,
      note: String,
      updatedBy: ObjectId
    }
  ],
  totals: {
    subtotal: Number,
    tax: Number,
    shipping: Number,
    discount: Number,
    total: Number
  },
  createdAt: Date,
  updatedAt: Date
};

// Blog post with embedded comments (denormalized approach)
const blogPostSchema = {
  _id: ObjectId,
  title: String,
  slug: String,
  content: String,
  author: {
    _id: ObjectId,
    name: String,
    avatar: String
  },
  comments: [
    {
      _id: ObjectId,
      author: {
        _id: ObjectId,
        name: String,
        avatar: String
      },
      content: String,
      createdAt: Date,
      replies: [
        {
          _id: ObjectId,
          author: {
            _id: ObjectId,
            name: String,
            avatar: String
          },
          content: String,
          createdAt: Date
        }
      ]
    }
  ],
  tags: [String],
  categories: [String],
  metadata: {
    views: Number,
    likes: Number,
    shares: Number,
    readTime: Number
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  published: Boolean,
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
};
\`\`\`

## 2. Indexing Strategies

### Compound Index Design
\`\`\`javascript
// User collection indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ "metadata.lastLoginAt": -1 });
db.users.createIndex({ "profile.location.coordinates": "2dsphere" });

// Product collection indexes
db.products.createIndex({
  "category.primary": 1,
  "category.secondary": 1,
  status: 1
});
db.products.createIndex({
  name: "text",
  description: "text",
  "category.tags": "text"
}, {
  weights: {
    name: 10,
    "category.tags": 5,
    description: 1
  }
});
db.products.createIndex({ "variants.sku": 1 }, { unique: true });
db.products.createIndex({ "seo.slug": 1 }, { unique: true });

// Order collection indexes
db.orders.createIndex({ customerId: 1, createdAt: -1 });
db.orders.createIndex({ orderNumber: 1 }, { unique: true });
db.orders.createIndex({
  status: 1,
  createdAt: -1
});
db.orders.createIndex({ "items.productId": 1 });
db.orders.createIndex({ "payment.transactionId": 1 });

// Partial indexes for specific use cases
db.products.createIndex(
  { "variants.inventory.quantity": 1 },
  {
    partialFilterExpression: {
      "variants.inventory.quantity": { $lt: 10 }
    },
    name: "low_stock_products"
  }
);

// TTL index for temporary data
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 } // 1 hour
);
\`\`\`

### Index Performance Analysis
\`\`\`javascript
// Query performance analysis functions
function analyzeQueryPerformance(collection, query) {
  const explain = db[collection].find(query).explain("executionStats");

  return {
    executionTimeMillis: explain.executionStats.executionTimeMillis,
    totalDocsExamined: explain.executionStats.totalDocsExamined,
    totalDocsReturned: explain.executionStats.totalDocsReturned,
    indexUsed: explain.executionStats.executionStages.indexName || "COLLSCAN",
    efficiency: explain.executionStats.totalDocsReturned / explain.executionStats.totalDocsExamined
  };
}

// Index usage statistics
function getIndexStats(collection) {
  return db[collection].aggregate([
    { $indexStats: {} }
  ]);
}

// Identify unused indexes
function findUnusedIndexes(collection) {
  const stats = db[collection].aggregate([{ $indexStats: {} }]);
  return stats.filter(stat => stat.accesses.ops === 0);
}
\`\`\`

## 3. Aggregation Pipeline Optimization

### Complex Aggregation Patterns
\`\`\`javascript
// E-commerce analytics pipeline
const salesAnalyticsPipeline = [
  // Stage 1: Match orders from last 30 days
  {
    $match: {
      createdAt: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      status: { $in: ["completed", "shipped", "delivered"] }
    }
  },

  // Stage 2: Unwind order items
  { $unwind: "$items" },

  // Stage 3: Lookup product details
  {
    $lookup: {
      from: "products",
      localField: "items.productId",
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },

  // Stage 4: Group by product category and calculate metrics
  {
    $group: {
      _id: {
        category: "$product.category.primary",
        month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
      },
      totalRevenue: {
        $sum: { $multiply: ["$items.quantity", "$items.priceAtTime"] }
      },
      totalQuantity: { $sum: "$items.quantity" },
      averageOrderValue: { $avg: "$totals.total" },
      uniqueCustomers: { $addToSet: "$customerId" },
      orderCount: { $sum: 1 }
    }
  },

  // Stage 5: Add calculated fields
  {
    $addFields: {
      customerCount: { $size: "$uniqueCustomers" },
      revenuePerCustomer: {
        $divide: ["$totalRevenue", { $size: "$uniqueCustomers" }]
      }
    }
  },

  // Stage 6: Sort by revenue descending
  { $sort: { totalRevenue: -1 } },

  // Stage 7: Limit results
  { $limit: 50 }
];

// Product recommendation pipeline
const recommendationPipeline = [
  // Find similar customers based on purchase history
  {
    $match: { customerId: ObjectId("customer_id") }
  },
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.productId",
      purchaseCount: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "orders",
      let: { productIds: "$_id" },
      pipeline: [
        { $unwind: "$items" },
        { $match: { $expr: { $eq: ["$items.productId", "$$productIds"] } } },
        { $group: { _id: "$customerId", products: { $addToSet: "$items.productId" } } }
      ],
      as: "similarCustomers"
    }
  },
  { $unwind: "$similarCustomers" },
  { $unwind: "$similarCustomers.products" },
  {
    $group: {
      _id: "$similarCustomers.products",
      score: { $sum: 1 }
    }
  },
  { $sort: { score: -1 } },
  { $limit: 10 }
];
\`\`\`

### Performance Optimization Techniques
\`\`\`javascript
// Use projection to limit returned fields
const optimizedQuery = db.products.find(
  { "category.primary": "electronics" },
  {
    name: 1,
    "variants.sku": 1,
    "variants.pricing.price": 1,
    _id: 1
  }
);

// Use $limit and $skip efficiently
const paginatedResults = db.products.aggregate([
  { $match: { status: "active" } },
  { $sort: { createdAt: -1 } },
  { $skip: (page - 1) * pageSize },
  { $limit: pageSize },
  {
    $facet: {
      data: [{ $skip: 0 }, { $limit: pageSize }],
      count: [{ $count: "total" }]
    }
  }
]);

// Use $lookup with pipeline for better performance
const efficientLookup = [
  {
    $lookup: {
      from: "products",
      let: { productId: "$items.productId" },
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$productId"] } } },
        { $project: { name: 1, "variants.pricing.price": 1 } }
      ],
      as: "productDetails"
    }
  }
];
\`\`\`

## 4. Data Modeling Patterns

### Polymorphic Pattern
\`\`\`javascript
// Different types of content in same collection
const contentSchema = {
  _id: ObjectId,
  type: String, // "article", "video", "podcast", "course"
  title: String,
  author: {
    _id: ObjectId,
    name: String
  },
  // Common fields
  description: String,
  tags: [String],
  publishedAt: Date,

  // Type-specific fields
  // Article fields
  content: String, // Only for articles
  readTime: Number, // Only for articles

  // Video fields
  videoUrl: String, // Only for videos
  duration: Number, // For videos and podcasts
  thumbnail: String, // Only for videos

  // Podcast fields
  audioUrl: String, // Only for podcasts
  transcript: String, // Only for podcasts

  // Course fields
  modules: [ // Only for courses
    {
      title: String,
      lessons: [
        {
          title: String,
          videoUrl: String,
          duration: Number,
          materials: [String]
        }
      ]
    }
  ],

  metadata: {
    views: Number,
    likes: Number,
    comments: Number
  }
};

// Query patterns for polymorphic data
const getArticles = () => db.content.find({ type: "article" });
const getVideosWithDuration = () => db.content.find({
  type: "video",
  duration: { $exists: true }
});
\`\`\`

### Bucket Pattern for Time Series
\`\`\`javascript
// IoT sensor data bucketing
const sensorDataBucketSchema = {
  _id: ObjectId,
  sensorId: String,
  timestamp: Date, // Start of bucket (hourly buckets)
  measurements: [
    {
      timestamp: Date,
      temperature: Number,
      humidity: Number,
      pressure: Number
    }
  ],
  summary: {
    count: Number,
    avgTemperature: Number,
    minTemperature: Number,
    maxTemperature: Number,
    avgHumidity: Number,
    avgPressure: Number
  }
};

// Insert new measurement into bucket
function insertSensorData(sensorId, measurement) {
  const bucketTimestamp = new Date(
    Math.floor(measurement.timestamp.getTime() / (1000 * 60 * 60)) * (1000 * 60 * 60)
  );

  return db.sensorData.updateOne(
    {
      sensorId: sensorId,
      timestamp: bucketTimestamp,
      "measurements.99": { $exists: false } // Max 100 measurements per bucket
    },
    {
      $push: { measurements: measurement },
      $inc: {
        "summary.count": 1,
        "summary.avgTemperature": measurement.temperature / 100
      },
      $min: { "summary.minTemperature": measurement.temperature },
      $max: { "summary.maxTemperature": measurement.temperature },
      $setOnInsert: {
        sensorId: sensorId,
        timestamp: bucketTimestamp
      }
    },
    { upsert: true }
  );
}
\`\`\`

## 5. Transaction Management

### Multi-Document Transactions
\`\`\`javascript
async function transferInventory(fromWarehouse, toWarehouse, productId, quantity) {
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      // Check source warehouse has sufficient inventory
      const sourceWarehouse = await db.warehouses.findOne(
        { _id: fromWarehouse, "inventory.productId": productId },
        { session }
      );

      const productInventory = sourceWarehouse.inventory.find(
        item => item.productId.equals(productId)
      );

      if (!productInventory || productInventory.quantity < quantity) {
        throw new Error("Insufficient inventory");
      }

      // Decrease inventory in source warehouse
      await db.warehouses.updateOne(
        {
          _id: fromWarehouse,
          "inventory.productId": productId
        },
        {
          $inc: { "inventory.$.quantity": -quantity }
        },
        { session }
      );

      // Increase inventory in destination warehouse
      await db.warehouses.updateOne(
        { _id: toWarehouse },
        {
          $push: {
            inventory: {
              productId: productId,
              quantity: quantity,
              lastUpdated: new Date()
            }
          }
        },
        { session }
      );

      // Log the transfer
      await db.inventoryTransfers.insertOne({
        fromWarehouse: fromWarehouse,
        toWarehouse: toWarehouse,
        productId: productId,
        quantity: quantity,
        timestamp: new Date(),
        status: "completed"
      }, { session });

    }, {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' }
    });

  } finally {
    await session.endSession();
  }
}

// Order processing with inventory update
async function processOrder(orderData) {
  const session = client.startSession();

  try {
    const result = await session.withTransaction(async () => {
      // Create order
      const order = await db.orders.insertOne({
        ...orderData,
        status: "processing",
        createdAt: new Date()
      }, { session });

      // Update inventory for each item
      for (const item of orderData.items) {
        const updateResult = await db.products.updateOne(
          {
            _id: item.productId,
            "variants._id": item.variantId,
            "variants.inventory.quantity": { $gte: item.quantity }
          },
          {
            $inc: {
              "variants.$.inventory.quantity": -item.quantity,
              "variants.$.inventory.reserved": item.quantity
            }
          },
          { session }
        );

        if (updateResult.matchedCount === 0) {
          throw new Error(\`Insufficient inventory for product \${item.productId}\`);
        }
      }

      return order;
    });

    return result;

  } finally {
    await session.endSession();
  }
}
\`\`\`

## 6. Performance Monitoring and Optimization

### Database Profiling and Monitoring
\`\`\`javascript
// Enable profiling for slow operations
db.setProfilingLevel(1, { slowms: 100 });

// Query profiler data
const slowQueries = db.system.profile.find({
  millis: { $gt: 100 }
}).sort({ ts: -1 }).limit(10);

// Monitor collection statistics
function getCollectionStats(collectionName) {
  return db[collectionName].stats({
    indexDetails: true,
    scale: 1024 * 1024 // MB
  });
}

// Monitor index effectiveness
function analyzeIndexUsage() {
  const collections = db.runCommand("listCollections").cursor.firstBatch;

  collections.forEach(collection => {
    console.log(\`Collection: \${collection.name}\`);

    const indexStats = db[collection.name].aggregate([
      { $indexStats: {} }
    ]).toArray();

    indexStats.forEach(stat => {
      console.log(\`  Index: \${stat.name}\`);
      console.log(\`    Operations: \${stat.accesses.ops}\`);
      console.log(\`    Since: \${stat.accesses.since}\`);
    });
  });
}

// Memory usage monitoring
function getMemoryUsage() {
  const serverStatus = db.serverStatus();
  return {
    resident: serverStatus.mem.resident,
    virtual: serverStatus.mem.virtual,
    mapped: serverStatus.mem.mapped,
    wiredTiger: serverStatus.wiredTiger.cache
  };
}
\`\`\`

### Query Optimization Strategies
\`\`\`javascript
// Use explain() to analyze query performance
function optimizeQuery() {
  // Before optimization
  const slowQuery = db.products.find({
    "category.primary": "electronics",
    "variants.pricing.price": { $lt: 1000 },
    status: "active"
  });

  console.log("Slow query plan:", slowQuery.explain("executionStats"));

  // Create compound index
  db.products.createIndex({
    "category.primary": 1,
    status: 1,
    "variants.pricing.price": 1
  });

  // After optimization
  console.log("Optimized query plan:", slowQuery.explain("executionStats"));
}

// Use aggregation instead of multiple queries
function getProductSummary(categoryId) {
  // Instead of multiple queries, use single aggregation
  return db.products.aggregate([
    { $match: { "category.primary": categoryId, status: "active" } },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        averagePrice: { $avg: "$variants.pricing.price" },
        priceRange: {
          $push: {
            min: { $min: "$variants.pricing.price" },
            max: { $max: "$variants.pricing.price" }
          }
        },
        topBrands: { $addToSet: "$brand" }
      }
    }
  ]);
}
\`\`\`

## 7. Data Validation and Schema Enforcement

### JSON Schema Validation
\`\`\`javascript
// Create collection with validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "username", "createdAt"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "must be a valid email address"
        },
        username: {
          bsonType: "string",
          minLength: 3,
          maxLength: 30,
          pattern: "^[a-zA-Z0-9_]+$",
          description: "must be 3-30 characters alphanumeric"
        },
        age: {
          bsonType: "int",
          minimum: 13,
          maximum: 120,
          description: "must be between 13 and 120"
        },
        profile: {
          bsonType: "object",
          properties: {
            firstName: { bsonType: "string", maxLength: 50 },
            lastName: { bsonType: "string", maxLength: 50 },
            bio: { bsonType: "string", maxLength: 500 }
          }
        },
        preferences: {
          bsonType: "object",
          properties: {
            theme: {
              enum: ["light", "dark", "auto"],
              description: "must be one of the allowed values"
            },
            notifications: {
              bsonType: "object",
              properties: {
                email: { bsonType: "bool" },
                push: { bsonType: "bool" },
                sms: { bsonType: "bool" }
              }
            }
          }
        },
        createdAt: {
          bsonType: "date",
          description: "must be a date"
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});

// Product validation schema
const productValidation = {
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "category", "variants"],
    properties: {
      name: {
        bsonType: "string",
        minLength: 1,
        maxLength: 200
      },
      category: {
        bsonType: "object",
        required: ["primary"],
        properties: {
          primary: {
            enum: ["electronics", "clothing", "books", "home", "sports"],
            description: "must be a valid category"
          },
          secondary: {
            bsonType: "array",
            items: { bsonType: "string" }
          }
        }
      },
      variants: {
        bsonType: "array",
        minItems: 1,
        items: {
          bsonType: "object",
          required: ["sku", "pricing"],
          properties: {
            sku: {
              bsonType: "string",
              pattern: "^[A-Z0-9-]+$"
            },
            pricing: {
              bsonType: "object",
              required: ["price", "currency"],
              properties: {
                price: {
                  bsonType: "number",
                  minimum: 0
                },
                currency: {
                  enum: ["USD", "EUR", "GBP"],
                  description: "must be a supported currency"
                }
              }
            }
          }
        }
      }
    }
  }
};
\`\`\`

## 8. Data Migration and Versioning

### Schema Migration Patterns
\`\`\`javascript
// Migration framework
class MigrationManager {
  constructor(db) {
    this.db = db;
    this.migrations = [];
  }

  addMigration(version, up, down) {
    this.migrations.push({ version, up, down });
  }

  async migrate(targetVersion) {
    const currentVersion = await this.getCurrentVersion();
    const migrationsToRun = this.migrations
      .filter(m => m.version > currentVersion && m.version <= targetVersion)
      .sort((a, b) => a.version - b.version);

    for (const migration of migrationsToRun) {
      console.log(\`Running migration \${migration.version}\`);
      await migration.up(this.db);
      await this.updateVersion(migration.version);
    }
  }

  async getCurrentVersion() {
    const versionDoc = await this.db.migrations.findOne({});
    return versionDoc ? versionDoc.version : 0;
  }

  async updateVersion(version) {
    await this.db.migrations.replaceOne(
      {},
      { version, updatedAt: new Date() },
      { upsert: true }
    );
  }
}

// Example migrations
const migrationManager = new MigrationManager(db);

// Migration 1: Add email verification field
migrationManager.addMigration(1,
  async (db) => {
    await db.users.updateMany(
      {},
      {
        $set: {
          emailVerified: false,
          emailVerifiedAt: null
        }
      }
    );
  },
  async (db) => {
    await db.users.updateMany(
      {},
      {
        $unset: {
          emailVerified: 1,
          emailVerifiedAt: 1
        }
      }
    );
  }
);

// Migration 2: Restructure product variants
migrationManager.addMigration(2,
  async (db) => {
    const products = await db.products.find({}).toArray();

    for (const product of products) {
      if (product.variants) {
        const updatedVariants = product.variants.map(variant => ({
          ...variant,
          inventory: {
            quantity: variant.stock || 0,
            reserved: 0,
            warehouse: "main"
          }
        }));

        await db.products.updateOne(
          { _id: product._id },
          {
            $set: { variants: updatedVariants },
            $unset: { stock: 1 }
          }
        );
      }
    }
  },
  async (db) => {
    // Rollback logic
    const products = await db.products.find({}).toArray();

    for (const product of products) {
      if (product.variants) {
        const updatedVariants = product.variants.map(variant => ({
          ...variant,
          stock: variant.inventory?.quantity || 0
        }));

        await db.products.updateOne(
          { _id: product._id },
          {
            $set: { variants: updatedVariants },
            $unset: { "variants.$[].inventory": 1 }
          }
        );
      }
    }
  }
);
\`\`\`

## 9. Backup and Recovery Strategies

### Automated Backup Solutions
\`\`\`bash
#!/bin/bash
# MongoDB backup script

BACKUP_DIR="/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="production_db"
RETENTION_DAYS=7

# Create backup directory
mkdir -p $BACKUP_DIR/$DATE

# Dump database
mongodump --host mongodb://localhost:27017 --db $DB_NAME --out $BACKUP_DIR/$DATE

# Compress backup
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz -C $BACKUP_DIR $DATE

# Remove uncompressed files
rm -rf $BACKUP_DIR/$DATE

# Upload to cloud storage (AWS S3)
aws s3 cp $BACKUP_DIR/backup_$DATE.tar.gz s3://my-mongodb-backups/

# Clean up old backups
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: backup_$DATE.tar.gz"
\`\`\`

### Point-in-Time Recovery
\`\`\`javascript
// Oplog tailing for real-time backup
function tailOplog() {
  const oplogCursor = db.oplog.rs.find({
    ts: { $gt: getLastProcessedTimestamp() }
  }, {
    tailable: true,
    awaitData: true
  });

  oplogCursor.forEach(entry => {
    // Process oplog entry
    processOplogEntry(entry);

    // Update last processed timestamp
    updateLastProcessedTimestamp(entry.ts);
  });
}

function processOplogEntry(entry) {
  // Replicate operation to backup database
  switch (entry.op) {
    case 'i': // insert
      backupDb[entry.ns.split('.')[1]].insertOne(entry.o);
      break;
    case 'u': // update
      backupDb[entry.ns.split('.')[1]].updateOne(
        entry.o2,
        { $set: entry.o }
      );
      break;
    case 'd': // delete
      backupDb[entry.ns.split('.')[1]].deleteOne(entry.o);
      break;
  }
}
\`\`\`

## 10. Security Best Practices

### Authentication and Authorization
\`\`\`javascript
// Create users with specific roles
db.createUser({
  user: "appUser",
  pwd: "securePassword123",
  roles: [
    { role: "readWrite", db: "production" },
    { role: "read", db: "analytics" }
  ]
});

// Create custom role
db.createRole({
  role: "productManager",
  privileges: [
    {
      resource: { db: "production", collection: "products" },
      actions: ["find", "insert", "update"]
    },
    {
      resource: { db: "production", collection: "categories" },
      actions: ["find"]
    }
  ],
  roles: []
});

// Field-level security
const userSchema = {
  // ... other fields
  sensitiveData: {
    ssn: String, // Encrypt this field
    creditCard: String // Encrypt this field
  }
};

// Client-side field level encryption
const clientSideEncryption = {
  keyVaultNamespace: "encryption.__keyVault",
  kmsProviders: {
    local: {
      key: BinData(0, "your-master-key-here")
    }
  },
  schemaMap: {
    "production.users": {
      properties: {
        "sensitiveData.ssn": {
          encrypt: {
            keyId: "your-key-id",
            bsonType: "string",
            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
          }
        }
      }
    }
  }
};
\`\`\`

## Implementation Checklist

- [ ] Design document schema based on access patterns
- [ ] Choose between embedding and referencing appropriately
- [ ] Create compound indexes for common query patterns
- [ ] Implement text search indexes for full-text search
- [ ] Set up geospatial indexes for location-based queries
- [ ] Use aggregation pipelines for complex data analysis
- [ ] Implement proper error handling and transactions
- [ ] Set up database validation rules
- [ ] Configure monitoring and profiling
- [ ] Implement automated backup strategy
- [ ] Set up proper authentication and authorization
- [ ] Plan for data migration and schema evolution
- [ ] Optimize queries based on explain plans
- [ ] Monitor collection and index statistics

This comprehensive guide provides the foundation for building scalable, performant MongoDB applications with proper schema design, indexing strategies, and operational best practices.`,
};
