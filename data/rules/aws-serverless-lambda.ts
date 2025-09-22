import { Rule } from "../types";

export const rule: Rule = {
	id: "aws-serverless-lambda",
	slug: "aws-serverless-lambda",
	title: "AWS Serverless Development with Lambda",
	tags: ["aws", "serverless", "lambda", "cloud", "api-gateway", "dynamodb"],
	languages: ["javascript", "typescript", "python"],
	description:
		"Build scalable serverless applications using AWS Lambda, API Gateway, and serverless framework",
	content: `# AWS Serverless Development with Lambda

## 1. Serverless Framework Setup

### Project Structure and Configuration
\`\`\`yaml
# serverless.yml
service: my-serverless-api
frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs18.x
  region: \${opt:region, 'us-east-1'}
  stage: \${opt:stage, 'dev'}

  environment:
    STAGE: \${self:provider.stage}
    REGION: \${self:provider.region}
    DYNAMODB_TABLE: \${self:service}-\${self:provider.stage}-users
    JWT_SECRET: \${ssm:/\${self:service}/\${self:provider.stage}/jwt-secret}

  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - dynamodb:Query
            - dynamodb:Scan
            - dynamodb:GetItem
            - dynamodb:PutItem
            - dynamodb:UpdateItem
            - dynamodb:DeleteItem
          Resource:
            - "arn:aws:dynamodb:\${self:provider.region}:*:table/\${self:provider.environment.DYNAMODB_TABLE}"
            - "arn:aws:dynamodb:\${self:provider.region}:*:table/\${self:provider.environment.DYNAMODB_TABLE}/index/*"
        - Effect: Allow
          Action:
            - s3:GetObject
            - s3:PutObject
            - s3:DeleteObject
          Resource:
            - "arn:aws:s3:::my-app-uploads-\${self:provider.stage}/*"
        - Effect: Allow
          Action:
            - ses:SendEmail
            - ses:SendRawEmail
          Resource: "*"

plugins:
  - serverless-webpack
  - serverless-offline
  - serverless-dynamodb-local
  - serverless-dotenv-plugin
  - serverless-prune-plugin
  - serverless-plugin-tracing

custom:
  webpack:
    webpackConfig: 'webpack.config.js'
    includeModules: true
    packager: 'npm'
    excludeFiles: src/**/*.test.js

  dynamodb:
    start:
      port: 8000
      inMemory: true
      migrate: true
    stages:
      - dev
      - test

  prune:
    automatic: true
    number: 3

functions:
  authorizer:
    handler: src/handlers/auth.authorize

  # User Management
  createUser:
    handler: src/handlers/users.create
    events:
      - http:
          path: /users
          method: post
          cors: true

  getUser:
    handler: src/handlers/users.get
    events:
      - http:
          path: /users/{id}
          method: get
          cors: true
          authorizer: authorizer

  updateUser:
    handler: src/handlers/users.update
    events:
      - http:
          path: /users/{id}
          method: put
          cors: true
          authorizer: authorizer

  listUsers:
    handler: src/handlers/users.list
    events:
      - http:
          path: /users
          method: get
          cors: true
          authorizer: authorizer
          request:
            parameters:
              querystrings:
                limit: false
                cursor: false

  # File Upload
  uploadFile:
    handler: src/handlers/files.upload
    timeout: 30
    events:
      - http:
          path: /upload
          method: post
          cors: true
          authorizer: authorizer

  # Background Jobs
  processImage:
    handler: src/handlers/jobs.processImage
    timeout: 300
    memorySize: 1024
    events:
      - s3:
          bucket: my-app-uploads-\${self:provider.stage}
          event: s3:ObjectCreated:*
          rules:
            - suffix: .jpg
            - suffix: .png

  sendNotification:
    handler: src/handlers/notifications.send
    events:
      - sqs:
          arn:
            Fn::GetAtt:
              - NotificationQueue
              - Arn

  # Scheduled Jobs
  dailyCleanup:
    handler: src/handlers/scheduled.cleanup
    events:
      - schedule: cron(0 2 * * ? *)

resources:
  Resources:
    UsersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: \${self:provider.environment.DYNAMODB_TABLE}
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
          - AttributeName: email
            AttributeType: S
          - AttributeName: createdAt
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        GlobalSecondaryIndexes:
          - IndexName: EmailIndex
            KeySchema:
              - AttributeName: email
                KeyType: HASH
            Projection:
              ProjectionType: ALL
            BillingMode: PAY_PER_REQUEST
          - IndexName: CreatedAtIndex
            KeySchema:
              - AttributeName: createdAt
                KeyType: HASH
            Projection:
              ProjectionType: ALL
            BillingMode: PAY_PER_REQUEST
        BillingMode: PAY_PER_REQUEST
        StreamSpecification:
          StreamViewType: NEW_AND_OLD_IMAGES

    S3Bucket:
      Type: AWS::S3::Bucket
      Properties:
        BucketName: my-app-uploads-\${self:provider.stage}
        CorsConfiguration:
          CorsRules:
            - AllowedHeaders: ['*']
              AllowedMethods: [GET, PUT, POST, DELETE]
              AllowedOrigins: ['*']

    NotificationQueue:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: \${self:service}-\${self:provider.stage}-notifications
        VisibilityTimeoutSeconds: 300
        MessageRetentionPeriod: 1209600
\`\`\`

## 2. Lambda Function Implementation

### User Management Handler
\`\`\`typescript
// src/handlers/users.ts
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { createResponse, parseJSON, validateEmail, hashPassword } from '../utils/helpers';
import { UserService } from '../services/userService';
import { ValidationError, NotFoundError } from '../utils/errors';

const dynamodb = new DynamoDB.DocumentClient();
const userService = new UserService(dynamodb);

export const create: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Creating user:', JSON.stringify(event, null, 2));

    const body = parseJSON(event.body);

    // Validation
    if (!body.email || !body.name || !body.password) {
      throw new ValidationError('Email, name, and password are required');
    }

    if (!validateEmail(body.email)) {
      throw new ValidationError('Invalid email format');
    }

    if (body.password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }

    // Check if user already exists
    const existingUser = await userService.findByEmail(body.email);
    if (existingUser) {
      throw new ValidationError('User with this email already exists');
    }

    // Create user
    const user = {
      id: uuidv4(),
      email: body.email.toLowerCase(),
      name: body.name,
      passwordHash: await hashPassword(body.password),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await userService.create(user);

    // Return user without password hash
    const { passwordHash, ...userResponse } = user;

    return createResponse(201, {
      message: 'User created successfully',
      user: userResponse,
    });

  } catch (error) {
    console.error('Error creating user:', error);

    if (error instanceof ValidationError) {
      return createResponse(400, { message: error.message });
    }

    return createResponse(500, { message: 'Internal server error' });
  }
};

export const get: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.pathParameters?.id;

    if (!userId) {
      return createResponse(400, { message: 'User ID is required' });
    }

    const user = await userService.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Remove sensitive data
    const { passwordHash, ...userResponse } = user;

    return createResponse(200, { user: userResponse });

  } catch (error) {
    console.error('Error getting user:', error);

    if (error instanceof NotFoundError) {
      return createResponse(404, { message: error.message });
    }

    return createResponse(500, { message: 'Internal server error' });
  }
};

export const update: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.pathParameters?.id;
    const currentUser = event.requestContext.authorizer?.user;

    if (!userId) {
      return createResponse(400, { message: 'User ID is required' });
    }

    // Check authorization
    if (currentUser.id !== userId && currentUser.role !== 'admin') {
      return createResponse(403, { message: 'Unauthorized to update this user' });
    }

    const body = parseJSON(event.body);
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    // Validate and add fields to update
    if (body.name) {
      updateData.name = body.name;
    }

    if (body.email) {
      if (!validateEmail(body.email)) {
        throw new ValidationError('Invalid email format');
      }
      updateData.email = body.email.toLowerCase();
    }

    if (body.password) {
      if (body.password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters');
      }
      updateData.passwordHash = await hashPassword(body.password);
    }

    const updatedUser = await userService.update(userId, updateData);

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    // Remove sensitive data
    const { passwordHash, ...userResponse } = updatedUser;

    return createResponse(200, {
      message: 'User updated successfully',
      user: userResponse,
    });

  } catch (error) {
    console.error('Error updating user:', error);

    if (error instanceof ValidationError) {
      return createResponse(400, { message: error.message });
    }

    if (error instanceof NotFoundError) {
      return createResponse(404, { message: error.message });
    }

    return createResponse(500, { message: 'Internal server error' });
  }
};

export const list: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const limit = parseInt(event.queryStringParameters?.limit || '20');
    const cursor = event.queryStringParameters?.cursor;

    const result = await userService.list({
      limit: Math.min(limit, 100), // Cap at 100
      cursor,
    });

    return createResponse(200, result);

  } catch (error) {
    console.error('Error listing users:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
};
\`\`\`

### Authentication Handler
\`\`\`typescript
// src/handlers/auth.ts
import { APIGatewayTokenAuthorizerHandler, APIGatewayAuthorizerResult } from 'aws-lambda';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();
const userService = new UserService(dynamodb);

export const authorize: APIGatewayTokenAuthorizerHandler = async (event) => {
  try {
    const token = event.authorizationToken?.replace('Bearer ', '');

    if (!token) {
      throw new Error('No token provided');
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Get user from database
    const user = await userService.findById(decoded.userId);

    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    // Generate policy
    const policy = generatePolicy(user.id, 'Allow', event.methodArn);

    // Add user context
    policy.context = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
    };

    return policy;

  } catch (error) {
    console.error('Authorization error:', error);
    throw new Error('Unauthorized');
  }
};

const generatePolicy = (
  principalId: string,
  effect: 'Allow' | 'Deny',
  resource: string
): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

// Login handler
import { APIGatewayProxyHandler } from 'aws-lambda';
import bcrypt from 'bcryptjs';
import { createResponse, parseJSON, validateEmail } from '../utils/helpers';
import { ValidationError } from '../utils/errors';

export const login: APIGatewayProxyHandler = async (event) => {
  try {
    const body = parseJSON(event.body);

    if (!body.email || !body.password) {
      throw new ValidationError('Email and password are required');
    }

    if (!validateEmail(body.email)) {
      throw new ValidationError('Invalid email format');
    }

    // Find user by email
    const user = await userService.findByEmail(body.email.toLowerCase());

    if (!user || !user.isActive) {
      throw new ValidationError('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(body.password, user.passwordHash);

    if (!isValidPassword) {
      throw new ValidationError('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Remove sensitive data
    const { passwordHash, ...userResponse } = user;

    return createResponse(200, {
      message: 'Login successful',
      token,
      user: userResponse,
    });

  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof ValidationError) {
      return createResponse(400, { message: error.message });
    }

    return createResponse(500, { message: 'Internal server error' });
  }
};
\`\`\`

## 3. DynamoDB Service Layer

### User Service with DynamoDB
\`\`\`typescript
// src/services/userService.ts
import { DynamoDB } from 'aws-sdk';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  isActive: boolean;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListOptions {
  limit: number;
  cursor?: string;
}

export interface ListResult {
  users: Omit<User, 'passwordHash'>[];
  nextCursor?: string;
  hasMore: boolean;
}

export class UserService {
  private tableName: string;

  constructor(private dynamodb: DynamoDB.DocumentClient) {
    this.tableName = process.env.DYNAMODB_TABLE!;
  }

  async create(user: User): Promise<User> {
    const params = {
      TableName: this.tableName,
      Item: user,
      ConditionExpression: 'attribute_not_exists(id)',
    };

    await this.dynamodb.put(params).promise();
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: { id },
    };

    const result = await this.dynamodb.get(params).promise();
    return result.Item as User || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    };

    const result = await this.dynamodb.query(params).promise();
    return result.Items?.[0] as User || null;
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    // Build update expression
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.keys(updateData).forEach((key, index) => {
      const attributeName = \`#attr\${index}\`;
      const attributeValue = \`:val\${index}\`;

      updateExpressions.push(\`\${attributeName} = \${attributeValue}\`);
      expressionAttributeNames[attributeName] = key;
      expressionAttributeValues[attributeValue] = updateData[key as keyof User];
    });

    const params = {
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: \`SET \${updateExpressions.join(', ')}\`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW' as const,
      ConditionExpression: 'attribute_exists(id)',
    };

    try {
      const result = await this.dynamodb.update(params).promise();
      return result.Attributes as User;
    } catch (error: any) {
      if (error.code === 'ConditionalCheckFailedException') {
        return null;
      }
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: { id },
      ConditionExpression: 'attribute_exists(id)',
    };

    try {
      await this.dynamodb.delete(params).promise();
      return true;
    } catch (error: any) {
      if (error.code === 'ConditionalCheckFailedException') {
        return false;
      }
      throw error;
    }
  }

  async list(options: ListOptions): Promise<ListResult> {
    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: this.tableName,
      Limit: options.limit,
      ProjectionExpression: 'id, email, #name, isActive, #role, createdAt, updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#role': 'role',
      },
    };

    if (options.cursor) {
      params.ExclusiveStartKey = JSON.parse(
        Buffer.from(options.cursor, 'base64').toString()
      );
    }

    const result = await this.dynamodb.scan(params).promise();

    const users = result.Items as Omit<User, 'passwordHash'>[];
    const hasMore = !!result.LastEvaluatedKey;
    const nextCursor = hasMore
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : undefined;

    return {
      users,
      nextCursor,
      hasMore,
    };
  }
}
\`\`\`

## 4. File Upload and Processing

### S3 File Upload Handler
\`\`\`typescript
// src/handlers/files.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { createResponse, parseJSON } from '../utils/helpers';
import { ValidationError } from '../utils/errors';

const s3 = new S3();
const bucketName = process.env.S3_BUCKET!;

export const upload: APIGatewayProxyHandler = async (event) => {
  try {
    const body = parseJSON(event.body);
    const currentUser = event.requestContext.authorizer?.user;

    if (!body.fileName || !body.fileType || !body.fileContent) {
      throw new ValidationError('fileName, fileType, and fileContent are required');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(body.fileType)) {
      throw new ValidationError('File type not allowed');
    }

    // Generate unique file key
    const fileExtension = body.fileName.split('.').pop();
    const fileKey = \`uploads/\${currentUser.userId}/\${uuidv4()}.\${fileExtension}\`;

    // Convert base64 to buffer
    const fileBuffer = Buffer.from(body.fileContent, 'base64');

    // Check file size (max 5MB)
    if (fileBuffer.length > 5 * 1024 * 1024) {
      throw new ValidationError('File size exceeds 5MB limit');
    }

    // Upload to S3
    const uploadParams = {
      Bucket: bucketName,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: body.fileType,
      Metadata: {
        originalName: body.fileName,
        uploadedBy: currentUser.userId,
        uploadedAt: new Date().toISOString(),
      },
    };

    const result = await s3.upload(uploadParams).promise();

    // Generate signed URL for download
    const downloadUrl = s3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: fileKey,
      Expires: 3600, // 1 hour
    });

    return createResponse(200, {
      message: 'File uploaded successfully',
      fileId: fileKey,
      downloadUrl,
      location: result.Location,
    });

  } catch (error) {
    console.error('Upload error:', error);

    if (error instanceof ValidationError) {
      return createResponse(400, { message: error.message });
    }

    return createResponse(500, { message: 'Internal server error' });
  }
};

// Image processing handler
import sharp from 'sharp';

export const processImage = async (event: any) => {
  try {
    const records = event.Records || [];

    for (const record of records) {
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\\+/g, ' '));

      console.log(\`Processing image: \${bucket}/\${key}\`);

      // Download original image
      const originalImage = await s3.getObject({ Bucket: bucket, Key: key }).promise();

      if (!originalImage.Body) {
        continue;
      }

      // Create thumbnails
      const thumbnailSizes = [
        { width: 150, height: 150, suffix: 'thumb' },
        { width: 300, height: 300, suffix: 'small' },
        { width: 800, height: 600, suffix: 'medium' },
      ];

      for (const size of thumbnailSizes) {
        const resizedImage = await sharp(originalImage.Body as Buffer)
          .resize(size.width, size.height, {
            fit: 'cover',
            position: 'center',
          })
          .jpeg({ quality: 80 })
          .toBuffer();

        const thumbnailKey = key.replace(
          /\\.(jpg|jpeg|png|gif)$/i,
          \`_\${size.suffix}.jpg\`
        );

        await s3.putObject({
          Bucket: bucket,
          Key: thumbnailKey,
          Body: resizedImage,
          ContentType: 'image/jpeg',
          Metadata: {
            originalKey: key,
            thumbnailSize: \`\${size.width}x\${size.height}\`,
          },
        }).promise();

        console.log(\`Created thumbnail: \${thumbnailKey}\`);
      }
    }

  } catch (error) {
    console.error('Image processing error:', error);
    throw error;
  }
};
\`\`\`

## 5. Background Jobs and Queues

### SQS Message Processing
\`\`\`typescript
// src/handlers/notifications.ts
import { SQSHandler } from 'aws-lambda';
import { SES } from 'aws-sdk';
import { UserService } from '../services/userService';
import { DynamoDB } from 'aws-sdk';

const ses = new SES();
const dynamodb = new DynamoDB.DocumentClient();
const userService = new UserService(dynamodb);

export interface NotificationMessage {
  type: 'email' | 'sms' | 'push';
  recipient: string;
  subject: string;
  message: string;
  metadata?: Record<string, any>;
}

export const send: SQSHandler = async (event) => {
  try {
    for (const record of event.Records) {
      const message: NotificationMessage = JSON.parse(record.body);

      console.log('Processing notification:', message);

      switch (message.type) {
        case 'email':
          await sendEmail(message);
          break;
        case 'sms':
          await sendSMS(message);
          break;
        case 'push':
          await sendPushNotification(message);
          break;
        default:
          console.warn('Unknown notification type:', message.type);
      }
    }
  } catch (error) {
    console.error('Notification processing error:', error);
    throw error; // This will put the message back in the queue for retry
  }
};

async function sendEmail(message: NotificationMessage): Promise<void> {
  const params = {
    Source: 'noreply@example.com',
    Destination: {
      ToAddresses: [message.recipient],
    },
    Message: {
      Subject: {
        Data: message.subject,
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: message.message,
          Charset: 'UTF-8',
        },
      },
    },
  };

  await ses.sendEmail(params).promise();
  console.log(\`Email sent to \${message.recipient}\`);
}

async function sendSMS(message: NotificationMessage): Promise<void> {
  // Implement SMS sending logic (e.g., using SNS)
  console.log(\`SMS would be sent to \${message.recipient}: \${message.message}\`);
}

async function sendPushNotification(message: NotificationMessage): Promise<void> {
  // Implement push notification logic
  console.log(\`Push notification would be sent to \${message.recipient}: \${message.message}\`);
}

// Utility function to queue notifications
import { SQS } from 'aws-sdk';

const sqs = new SQS();
const queueUrl = process.env.NOTIFICATION_QUEUE_URL!;

export async function queueNotification(message: NotificationMessage): Promise<void> {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(message),
    DelaySeconds: 0,
  };

  await sqs.sendMessage(params).promise();
  console.log('Notification queued:', message.type, message.recipient);
}
\`\`\`

### Scheduled Tasks
\`\`\`typescript
// src/handlers/scheduled.ts
import { ScheduledHandler } from 'aws-lambda';
import { DynamoDB, S3 } from 'aws-sdk';
import { UserService } from '../services/userService';

const dynamodb = new DynamoDB.DocumentClient();
const s3 = new S3();
const userService = new UserService(dynamodb);

export const cleanup: ScheduledHandler = async (event) => {
  try {
    console.log('Starting daily cleanup job');

    // Clean up expired files
    await cleanupExpiredFiles();

    // Clean up inactive users
    await cleanupInactiveUsers();

    // Generate daily reports
    await generateDailyReports();

    console.log('Daily cleanup completed successfully');

  } catch (error) {
    console.error('Cleanup job failed:', error);
    throw error;
  }
};

async function cleanupExpiredFiles(): Promise<void> {
  const bucketName = process.env.S3_BUCKET!;
  const expiredDate = new Date();
  expiredDate.setDate(expiredDate.getDate() - 30); // 30 days old

  try {
    const objects = await s3.listObjectsV2({ Bucket: bucketName }).promise();

    const expiredObjects = objects.Contents?.filter(obj =>
      obj.LastModified && obj.LastModified < expiredDate
    ) || [];

    if (expiredObjects.length > 0) {
      const deleteParams = {
        Bucket: bucketName,
        Delete: {
          Objects: expiredObjects.map(obj => ({ Key: obj.Key! })),
        },
      };

      await s3.deleteObjects(deleteParams).promise();
      console.log(\`Deleted \${expiredObjects.length} expired files\`);
    }

  } catch (error) {
    console.error('Error cleaning up files:', error);
  }
}

async function cleanupInactiveUsers(): Promise<void> {
  // Implementation for cleaning up inactive users
  console.log('Cleaning up inactive users...');
}

async function generateDailyReports(): Promise<void> {
  // Implementation for generating daily reports
  console.log('Generating daily reports...');
}
\`\`\`

## 6. Testing Serverless Functions

### Unit Tests
\`\`\`typescript
// tests/handlers/users.test.ts
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { create, get } from '../../src/handlers/users';
import { UserService } from '../../src/services/userService';

// Mock AWS SDK
jest.mock('aws-sdk');

// Mock UserService
jest.mock('../../src/services/userService');
const MockedUserService = UserService as jest.MockedClass<typeof UserService>;

describe('User Handlers', () => {
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    mockUserService = new MockedUserService({} as any) as jest.Mocked<UserService>;
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const event: Partial<APIGatewayProxyEvent> = {
        body: JSON.stringify({
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123',
        }),
      };

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashed-password',
        isActive: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(mockUser);

      const result = await create(event as APIGatewayProxyEvent, {} as Context, () => {});

      expect(result.statusCode).toBe(201);
      expect(JSON.parse(result.body)).toEqual({
        message: 'User created successfully',
        user: expect.objectContaining({
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
        }),
      });
      expect(JSON.parse(result.body).user.passwordHash).toBeUndefined();
    });

    it('should return error for existing email', async () => {
      const event: Partial<APIGatewayProxyEvent> = {
        body: JSON.stringify({
          email: 'existing@example.com',
          name: 'Test User',
          password: 'password123',
        }),
      };

      const existingUser = {
        id: 'user-456',
        email: 'existing@example.com',
        name: 'Existing User',
        passwordHash: 'hashed-password',
        isActive: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      mockUserService.findByEmail.mockResolvedValue(existingUser);

      const result = await create(event as APIGatewayProxyEvent, {} as Context, () => {});

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({
        message: 'User with this email already exists',
      });
    });

    it('should validate required fields', async () => {
      const event: Partial<APIGatewayProxyEvent> = {
        body: JSON.stringify({
          email: 'test@example.com',
          // Missing name and password
        }),
      };

      const result = await create(event as APIGatewayProxyEvent, {} as Context, () => {});

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({
        message: 'Email, name, and password are required',
      });
    });
  });

  describe('get', () => {
    it('should return user by ID', async () => {
      const event: Partial<APIGatewayProxyEvent> = {
        pathParameters: { id: 'user-123' },
      };

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashed-password',
        isActive: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await get(event as APIGatewayProxyEvent, {} as Context, () => {});

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({
        user: expect.objectContaining({
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
        }),
      });
      expect(JSON.parse(result.body).user.passwordHash).toBeUndefined();
    });

    it('should return 404 for non-existent user', async () => {
      const event: Partial<APIGatewayProxyEvent> = {
        pathParameters: { id: 'non-existent' },
      };

      mockUserService.findById.mockResolvedValue(null);

      const result = await get(event as APIGatewayProxyEvent, {} as Context, () => {});

      expect(result.statusCode).toBe(404);
      expect(JSON.parse(result.body)).toEqual({
        message: 'User not found',
      });
    });
  });
});
\`\`\`

### Integration Tests
\`\`\`typescript
// tests/integration/api.test.ts
import { handler } from '../../src/handlers/users';
import { DynamoDB } from 'aws-sdk';

// Use DynamoDB Local for integration tests
const dynamodb = new DynamoDB.DocumentClient({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

describe('User API Integration Tests', () => {
  beforeAll(async () => {
    // Set up test database
    await setupTestDatabase();
  });

  afterAll(async () => {
    // Clean up test database
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    // Clear test data before each test
    await clearTestData();
  });

  it('should create and retrieve a user', async () => {
    // Create user
    const createEvent = {
      httpMethod: 'POST',
      path: '/users',
      body: JSON.stringify({
        email: 'integration@example.com',
        name: 'Integration Test',
        password: 'password123',
      }),
      headers: {},
      pathParameters: null,
      queryStringParameters: null,
      requestContext: {} as any,
      resource: '',
      stageVariables: null,
      isBase64Encoded: false,
      multiValueHeaders: {},
      multiValueQueryStringParameters: null,
    };

    const createResult = await handler(createEvent, {} as any, () => {});
    expect(createResult.statusCode).toBe(201);

    const createdUser = JSON.parse(createResult.body).user;

    // Retrieve user
    const getEvent = {
      ...createEvent,
      httpMethod: 'GET',
      path: \`/users/\${createdUser.id}\`,
      pathParameters: { id: createdUser.id },
      body: null,
    };

    const getResult = await handler(getEvent, {} as any, () => {});
    expect(getResult.statusCode).toBe(200);

    const retrievedUser = JSON.parse(getResult.body).user;
    expect(retrievedUser.email).toBe('integration@example.com');
    expect(retrievedUser.name).toBe('Integration Test');
  });
});

async function setupTestDatabase() {
  // Create test table
  // Implementation depends on your test setup
}

async function cleanupTestDatabase() {
  // Delete test table
  // Implementation depends on your test setup
}

async function clearTestData() {
  // Clear all items from test table
  // Implementation depends on your test setup
}
\`\`\`

## Checklist for AWS Serverless Development

- [ ] Set up Serverless Framework with proper configuration
- [ ] Implement Lambda functions with proper error handling
- [ ] Configure DynamoDB tables with appropriate indexes
- [ ] Set up API Gateway with authentication and CORS
- [ ] Implement file upload and processing with S3
- [ ] Create background job processing with SQS
- [ ] Add scheduled tasks for maintenance operations
- [ ] Configure proper IAM roles and permissions
- [ ] Implement comprehensive logging and monitoring
- [ ] Set up local development environment
- [ ] Add unit and integration tests
- [ ] Configure environment-specific deployments
- [ ] Implement proper secret management
- [ ] Add performance monitoring and alerting
- [ ] Set up CI/CD pipeline for automated deployments`,
};
