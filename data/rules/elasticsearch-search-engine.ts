import { Rule } from "../types";

export const rule: Rule = {
	id: "elasticsearch-search-engine",
	slug: "elasticsearch-search-engine",
	title: "Elasticsearch Search Engine Development",
	tags: ["elasticsearch", "search", "indexing", "performance", "analytics"],
	languages: ["javascript", "typescript", "python", "java"],
	description:
		"Comprehensive guide for building search engines with Elasticsearch, including indexing strategies, query optimization, and analytics implementation.",
	
	categories: ["best-practices", "development"],content: `# Elasticsearch Search Engine Development

## 1. Elasticsearch Setup and Configuration

### Basic Cluster Configuration
\`\`\`yaml
# docker-compose.yml
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.10.0
    environment:
      - cluster.name=search-cluster
      - node.name=search-node-1
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms2g -Xmx2g"
      - xpack.security.enabled=false
      - discovery.type=single-node
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - esdata:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
      - "9300:9300"

  kibana:
    image: docker.elastic.co/kibana/kibana:8.10.0
    ports:
      - "5601:5601"
    environment:
      ELASTICSEARCH_HOSTS: http://elasticsearch:9200
    depends_on:
      - elasticsearch

volumes:
  esdata:
    driver: local
\`\`\`

### Production Configuration
\`\`\`yaml
# elasticsearch.yml
cluster.name: production-search
node.name: \${HOSTNAME}
path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch
network.host: 0.0.0.0
http.port: 9200
discovery.seed_hosts: ["node-1", "node-2", "node-3"]
cluster.initial_master_nodes: ["node-1", "node-2", "node-3"]
bootstrap.memory_lock: true
indices.memory.index_buffer_size: 30%
thread_pool.search.queue_size: 10000
\`\`\`

## 2. Index Design and Mapping

### Document Mapping Strategy
\`\`\`typescript
interface ProductDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  tags: string[];
  created_at: Date;
  updated_at: Date;
  availability: boolean;
  brand: string;
  rating: number;
  review_count: number;
}

const productMapping = {
  mappings: {
    properties: {
      title: {
        type: 'text',
        analyzer: 'english',
        fields: {
          keyword: { type: 'keyword' },
          suggest: {
            type: 'completion',
            analyzer: 'simple'
          }
        }
      },
      description: {
        type: 'text',
        analyzer: 'english'
      },
      category: {
        type: 'keyword',
        fields: {
          text: { type: 'text', analyzer: 'standard' }
        }
      },
      price: { type: 'float' },
      tags: { type: 'keyword' },
      created_at: { type: 'date' },
      updated_at: { type: 'date' },
      availability: { type: 'boolean' },
      brand: { type: 'keyword' },
      rating: { type: 'float' },
      review_count: { type: 'integer' }
    }
  },
  settings: {
    number_of_shards: 3,
    number_of_replicas: 1,
    analysis: {
      analyzer: {
        english: {
          tokenizer: 'standard',
          filter: ['lowercase', 'english_stemmer', 'english_stop']
        }
      },
      filter: {
        english_stemmer: {
          type: 'stemmer',
          language: 'english'
        },
        english_stop: {
          type: 'stop',
          stopwords: '_english_'
        }
      }
    }
  }
};
\`\`\`

## 3. Search Client Implementation

### TypeScript Client Setup
\`\`\`typescript
import { Client } from '@elastic/elasticsearch';

export class SearchService {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      auth: {
        username: process.env.ES_USERNAME,
        password: process.env.ES_PASSWORD
      },
      maxRetries: 3,
      requestTimeout: 30000,
      sniffOnStart: true
    });
  }

  async createIndex(indexName: string, mapping: any): Promise<void> {
    try {
      const exists = await this.client.indices.exists({ index: indexName });

      if (!exists) {
        await this.client.indices.create({
          index: indexName,
          body: mapping
        });
        console.log(\`Index \${indexName} created successfully\`);
      }
    } catch (error) {
      console.error('Error creating index:', error);
      throw error;
    }
  }

  async indexDocument(
    indexName: string,
    document: any,
    id?: string
  ): Promise<void> {
    try {
      await this.client.index({
        index: indexName,
        id,
        body: document,
        refresh: 'wait_for'
      });
    } catch (error) {
      console.error('Error indexing document:', error);
      throw error;
    }
  }

  async bulkIndex(indexName: string, documents: any[]): Promise<void> {
    const body = documents.flatMap(doc => [
      { index: { _index: indexName, _id: doc.id } },
      doc
    ]);

    try {
      const response = await this.client.bulk({
        refresh: 'wait_for',
        body
      });

      if (response.errors) {
        const erroredDocuments = response.items.filter(item =>
          item.index?.error
        );
        console.error('Bulk indexing errors:', erroredDocuments);
      }
    } catch (error) {
      console.error('Error bulk indexing:', error);
      throw error;
    }
  }
}
\`\`\`

## 4. Advanced Search Queries

### Multi-Field Search with Boosting
\`\`\`typescript
export class AdvancedSearch extends SearchService {
  async searchProducts(query: {
    q?: string;
    category?: string;
    priceRange?: { min: number; max: number };
    tags?: string[];
    availability?: boolean;
    sortBy?: 'relevance' | 'price' | 'rating' | 'date';
    page?: number;
    size?: number;
  }): Promise<SearchResult> {
    const {
      q = '',
      category,
      priceRange,
      tags = [],
      availability,
      sortBy = 'relevance',
      page = 1,
      size = 20
    } = query;

    const searchBody: any = {
      query: {
        bool: {
          must: [],
          filter: [],
          should: [],
          minimum_should_match: 0
        }
      },
      highlight: {
        fields: {
          title: {},
          description: {}
        }
      },
      aggs: {
        categories: {
          terms: { field: 'category', size: 20 }
        },
        price_ranges: {
          range: {
            field: 'price',
            ranges: [
              { to: 50 },
              { from: 50, to: 100 },
              { from: 100, to: 200 },
              { from: 200 }
            ]
          }
        },
        brands: {
          terms: { field: 'brand', size: 10 }
        }
      },
      from: (page - 1) * size,
      size
    };

    // Main search query
    if (q) {
      searchBody.query.bool.must.push({
        multi_match: {
          query: q,
          fields: [
            'title^3',
            'description^1',
            'tags^2',
            'brand^2'
          ],
          type: 'best_fields',
          fuzziness: 'AUTO'
        }
      });
    } else {
      searchBody.query.bool.must.push({ match_all: {} });
    }

    // Filters
    if (category) {
      searchBody.query.bool.filter.push({
        term: { category }
      });
    }

    if (priceRange) {
      searchBody.query.bool.filter.push({
        range: {
          price: {
            gte: priceRange.min,
            lte: priceRange.max
          }
        }
      });
    }

    if (tags.length > 0) {
      searchBody.query.bool.filter.push({
        terms: { tags }
      });
    }

    if (availability !== undefined) {
      searchBody.query.bool.filter.push({
        term: { availability }
      });
    }

    // Sorting
    if (sortBy !== 'relevance') {
      const sortMap = {
        price: [{ price: { order: 'asc' } }],
        rating: [{ rating: { order: 'desc' } }],
        date: [{ created_at: { order: 'desc' } }]
      };
      searchBody.sort = sortMap[sortBy];
    }

    try {
      const response = await this.client.search({
        index: 'products',
        body: searchBody
      });

      return this.formatSearchResponse(response);
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  private formatSearchResponse(response: any): SearchResult {
    return {
      hits: response.hits.hits.map((hit: any) => ({
        id: hit._id,
        score: hit._score,
        source: hit._source,
        highlight: hit.highlight
      })),
      total: response.hits.total.value,
      aggregations: response.aggregations,
      took: response.took
    };
  }
}
\`\`\`

## 5. Auto-Complete and Suggestions

### Completion Suggester Implementation
\`\`\`typescript
export class AutoCompleteService extends SearchService {
  async getSuggestions(
    prefix: string,
    size: number = 10
  ): Promise<Suggestion[]> {
    try {
      const response = await this.client.search({
        index: 'products',
        body: {
          suggest: {
            title_suggest: {
              prefix,
              completion: {
                field: 'title.suggest',
                size,
                skip_duplicates: true
              }
            }
          },
          _source: false
        }
      });

      return response.suggest.title_suggest[0].options.map((option: any) => ({
        text: option.text,
        score: option._score
      }));
    } catch (error) {
      console.error('Suggestion error:', error);
      return [];
    }
  }

  async getTermSuggestions(
    text: string,
    field: string = 'title'
  ): Promise<string[]> {
    try {
      const response = await this.client.search({
        index: 'products',
        body: {
          suggest: {
            term_suggest: {
              text,
              term: {
                field,
                suggest_mode: 'popular',
                sort: 'frequency'
              }
            }
          },
          _source: false
        }
      });

      return response.suggest.term_suggest[0].options.map(
        (option: any) => option.text
      );
    } catch (error) {
      console.error('Term suggestion error:', error);
      return [];
    }
  }

  async getPhraseSuggestions(
    text: string,
    field: string = 'title'
  ): Promise<string[]> {
    try {
      const response = await this.client.search({
        index: 'products',
        body: {
          suggest: {
            phrase_suggest: {
              text,
              phrase: {
                field,
                max_errors: 2,
                confidence: 0.5,
                direct_generator: [
                  {
                    field,
                    suggest_mode: 'always',
                    max_edits: 2
                  }
                ]
              }
            }
          },
          _source: false
        }
      });

      return response.suggest.phrase_suggest[0].options.map(
        (option: any) => option.text
      );
    } catch (error) {
      console.error('Phrase suggestion error:', error);
      return [];
    }
  }
}
\`\`\`

## 6. Performance Optimization

### Query Optimization Strategies
\`\`\`typescript
export class PerformanceOptimizer {
  // Use filters instead of queries when possible
  static buildOptimizedQuery(searchParams: any) {
    return {
      query: {
        bool: {
          must: searchParams.textQuery ? [searchParams.textQuery] : [],
          filter: [
            ...searchParams.termFilters,
            ...searchParams.rangeFilters
          ]
        }
      },
      // Use source filtering to reduce payload
      _source: {
        includes: ['title', 'price', 'rating', 'availability'],
        excludes: ['description', 'internal_*']
      },
      // Use request cache for repeated searches
      request_cache: true,
      // Limit deep pagination
      from: Math.min(searchParams.from, 10000),
      size: Math.min(searchParams.size, 100)
    };
  }

  // Index template for time-based indices
  static createTimeBasedTemplate() {
    return {
      index_patterns: ['logs-*'],
      template: {
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0,
          refresh_interval: '30s',
          index: {
            lifecycle: {
              name: 'logs-policy',
              rollover_alias: 'logs'
            }
          }
        },
        mappings: {
          properties: {
            '@timestamp': { type: 'date' },
            message: { type: 'text', index: false },
            level: { type: 'keyword' },
            service: { type: 'keyword' }
          }
        }
      }
    };
  }
}
\`\`\`

## 7. Analytics and Monitoring

### Search Analytics Implementation
\`\`\`typescript
export class SearchAnalytics {
  private searchService: SearchService;

  constructor(searchService: SearchService) {
    this.searchService = searchService;
  }

  async trackSearchEvent(event: {
    query: string;
    results_count: number;
    user_id?: string;
    session_id: string;
    timestamp: Date;
    clicked_results?: string[];
  }): Promise<void> {
    await this.searchService.indexDocument('search_analytics', {
      ...event,
      '@timestamp': event.timestamp
    });
  }

  async getPopularQueries(
    timeRange: { from: Date; to: Date },
    size: number = 20
  ): Promise<any[]> {
    const response = await this.searchService.client.search({
      index: 'search_analytics',
      body: {
        query: {
          range: {
            '@timestamp': {
              gte: timeRange.from,
              lte: timeRange.to
            }
          }
        },
        aggs: {
          popular_queries: {
            terms: {
              field: 'query.keyword',
              size,
              order: { _count: 'desc' }
            }
          }
        },
        size: 0
      }
    });

    return response.aggregations.popular_queries.buckets;
  }

  async getZeroResultQueries(
    timeRange: { from: Date; to: Date }
  ): Promise<string[]> {
    const response = await this.searchService.client.search({
      index: 'search_analytics',
      body: {
        query: {
          bool: {
            must: [
              {
                range: {
                  '@timestamp': {
                    gte: timeRange.from,
                    lte: timeRange.to
                  }
                }
              },
              {
                term: { results_count: 0 }
              }
            ]
          }
        },
        aggs: {
          zero_result_queries: {
            terms: {
              field: 'query.keyword',
              size: 100
            }
          }
        },
        size: 0
      }
    });

    return response.aggregations.zero_result_queries.buckets.map(
      (bucket: any) => bucket.key
    );
  }
}
\`\`\`

## 8. Real-time Indexing Pipeline

### Event-Driven Indexing
\`\`\`typescript
import { EventEmitter } from 'events';

export class RealTimeIndexer extends EventEmitter {
  private searchService: SearchService;
  private batchSize: number = 100;
  private batchTimeout: number = 5000;
  private batch: any[] = [];
  private batchTimer?: NodeJS.Timeout;

  constructor(searchService: SearchService) {
    super();
    this.searchService = searchService;
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.on('document_created', this.handleDocumentCreated.bind(this));
    this.on('document_updated', this.handleDocumentUpdated.bind(this));
    this.on('document_deleted', this.handleDocumentDeleted.bind(this));
  }

  private async handleDocumentCreated(document: any): Promise<void> {
    this.addToBatch({
      action: 'index',
      document
    });
  }

  private async handleDocumentUpdated(document: any): Promise<void> {
    this.addToBatch({
      action: 'update',
      document
    });
  }

  private async handleDocumentDeleted(id: string): Promise<void> {
    this.addToBatch({
      action: 'delete',
      id
    });
  }

  private addToBatch(operation: any): void {
    this.batch.push(operation);

    if (this.batch.length >= this.batchSize) {
      this.processBatch();
    } else if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => {
        this.processBatch();
      }, this.batchTimeout);
    }
  }

  private async processBatch(): Promise<void> {
    if (this.batch.length === 0) return;

    const currentBatch = [...this.batch];
    this.batch = [];

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = undefined;
    }

    try {
      const body = currentBatch.flatMap(operation => {
        switch (operation.action) {
          case 'index':
            return [
              { index: { _index: 'products', _id: operation.document.id } },
              operation.document
            ];
          case 'update':
            return [
              { update: { _index: 'products', _id: operation.document.id } },
              { doc: operation.document }
            ];
          case 'delete':
            return [
              { delete: { _index: 'products', _id: operation.id } }
            ];
          default:
            return [];
        }
      });

      await this.searchService.client.bulk({
        refresh: 'wait_for',
        body
      });

      console.log(\`Processed batch of \${currentBatch.length} operations\`);
    } catch (error) {
      console.error('Error processing batch:', error);
      // Implement retry logic or dead letter queue
    }
  }
}
\`\`\`

## 9. Testing Strategy

### Comprehensive Test Suite
\`\`\`typescript
import { describe, test, expect, beforeAll, afterAll } from '@jest/jest';
import { SearchService } from '../src/search-service';

describe('SearchService', () => {
  let searchService: SearchService;
  const testIndex = 'test_products';

  beforeAll(async () => {
    searchService = new SearchService();
    await searchService.createIndex(testIndex, productMapping);

    // Index test data
    const testProducts = [
      {
        id: '1',
        title: 'iPhone 14 Pro',
        description: 'Latest Apple smartphone',
        category: 'electronics',
        price: 999,
        brand: 'Apple',
        rating: 4.8
      },
      {
        id: '2',
        title: 'Samsung Galaxy S23',
        description: 'Android flagship phone',
        category: 'electronics',
        price: 899,
        brand: 'Samsung',
        rating: 4.6
      }
    ];

    await searchService.bulkIndex(testIndex, testProducts);
  });

  afterAll(async () => {
    await searchService.client.indices.delete({ index: testIndex });
  });

  test('should search products by title', async () => {
    const results = await searchService.searchProducts({
      q: 'iPhone',
      size: 10
    });

    expect(results.hits.length).toBeGreaterThan(0);
    expect(results.hits[0].source.title).toContain('iPhone');
  });

  test('should filter by category', async () => {
    const results = await searchService.searchProducts({
      category: 'electronics',
      size: 10
    });

    expect(results.hits.length).toBe(2);
    results.hits.forEach(hit => {
      expect(hit.source.category).toBe('electronics');
    });
  });

  test('should handle fuzzy search', async () => {
    const results = await searchService.searchProducts({
      q: 'iPhoen', // intentional typo
      size: 10
    });

    expect(results.hits.length).toBeGreaterThan(0);
    expect(results.hits[0].source.title).toContain('iPhone');
  });

  test('should return aggregations', async () => {
    const results = await searchService.searchProducts({
      q: '',
      size: 10
    });

    expect(results.aggregations.categories).toBeDefined();
    expect(results.aggregations.brands).toBeDefined();
  });
});
\`\`\`

## 10. Production Deployment

### Docker and Kubernetes Deployment
\`\`\`yaml
# k8s-elasticsearch.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: elasticsearch
spec:
  serviceName: elasticsearch
  replicas: 3
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
      - name: elasticsearch
        image: docker.elastic.co/elasticsearch/elasticsearch:8.10.0
        ports:
        - containerPort: 9200
        - containerPort: 9300
        env:
        - name: cluster.name
          value: "production-cluster"
        - name: node.name
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: discovery.seed_hosts
          value: "elasticsearch-0.elasticsearch,elasticsearch-1.elasticsearch,elasticsearch-2.elasticsearch"
        - name: cluster.initial_master_nodes
          value: "elasticsearch-0,elasticsearch-1,elasticsearch-2"
        - name: ES_JAVA_OPTS
          value: "-Xms2g -Xmx2g"
        resources:
          requests:
            memory: "4Gi"
            cpu: "1"
          limits:
            memory: "4Gi"
            cpu: "2"
        volumeMounts:
        - name: data
          mountPath: /usr/share/elasticsearch/data
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: "fast-ssd"
      resources:
        requests:
          storage: 100Gi
\`\`\`

## Implementation Checklist

- [ ] Set up Elasticsearch cluster with proper configuration
- [ ] Design index mappings for your data structure
- [ ] Implement search service with TypeScript client
- [ ] Create advanced search queries with filters and aggregations
- [ ] Build auto-complete and suggestion features
- [ ] Optimize query performance and indexing strategies
- [ ] Implement search analytics and monitoring
- [ ] Set up real-time indexing pipeline
- [ ] Write comprehensive tests for search functionality
- [ ] Deploy to production with monitoring and alerting
- [ ] Configure index lifecycle management
- [ ] Implement security and access controls

This guide provides a production-ready foundation for building sophisticated search engines with Elasticsearch, covering everything from basic setup to advanced features and deployment strategies.`,	applicationMode: "intelligent",

}