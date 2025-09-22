import { Rule } from "../types";

export const rule: Rule = {
	id: "socket-io-realtime-apps",
	slug: "socket-io-realtime-apps",
	title: "Socket.IO Real-time Application Development",
	tags: ["socket-io", "realtime", "websockets", "nodejs", "chat"],
	languages: ["javascript", "typescript"],
	description:
		"Comprehensive guide for building real-time applications with Socket.IO, including chat systems, live updates, gaming, and collaboration features.",
	content: `# Socket.IO Real-time Application Development

## 1. Basic Socket.IO Setup and Configuration

### Server Setup with Express
\`\`\`typescript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

interface ServerToClientEvents {
  message: (data: MessageData) => void;
  userJoined: (data: UserJoinedData) => void;
  userLeft: (data: UserLeftData) => void;
  typing: (data: TypingData) => void;
  notification: (data: NotificationData) => void;
}

interface ClientToServerEvents {
  joinRoom: (data: JoinRoomData) => void;
  sendMessage: (data: SendMessageData) => void;
  startTyping: () => void;
  stopTyping: () => void;
  disconnect: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  userId: string;
  username: string;
  rooms: string[];
}

class SocketServer {
  private app: express.Application;
  private server: any;
  private io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
  private connectedUsers: Map<string, ConnectedUser> = new Map();

  constructor(port: number = 3000) {
    this.app = express();
    this.server = createServer(this.app);

    this.io = new Server(this.server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling'],
      allowEIO3: true
    });

    this.setupMiddleware();
    this.setupSocketHandlers();
    this.startServer(port);
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());

    // Socket.IO authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        const user = await this.authenticateUser(token);

        socket.data.userId = user.id;
        socket.data.username = user.username;
        socket.data.rooms = [];

        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });

    // Rate limiting middleware
    this.io.use(this.rateLimitMiddleware);
  }

  private rateLimitMiddleware = (socket: any, next: any) => {
    const userId = socket.data.userId;
    const now = Date.now();

    if (!this.rateLimits.has(userId)) {
      this.rateLimits.set(userId, { count: 1, resetTime: now + 60000 });
      return next();
    }

    const limit = this.rateLimits.get(userId)!;

    if (now > limit.resetTime) {
      limit.count = 1;
      limit.resetTime = now + 60000;
      return next();
    }

    if (limit.count >= 100) { // 100 requests per minute
      return next(new Error('Rate limit exceeded'));
    }

    limit.count++;
    next();
  };

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(\`User connected: \${socket.data.username} (\${socket.data.userId})\`);

      this.handleUserConnection(socket);
      this.handleRoomEvents(socket);
      this.handleMessageEvents(socket);
      this.handleTypingEvents(socket);
      this.handleDisconnection(socket);
    });
  }

  private handleUserConnection(socket: any): void {
    const user: ConnectedUser = {
      id: socket.data.userId,
      username: socket.data.username,
      socketId: socket.id,
      connectedAt: new Date(),
      isActive: true
    };

    this.connectedUsers.set(socket.data.userId, user);

    // Send user list to client
    socket.emit('connectedUsers', Array.from(this.connectedUsers.values()));
  }

  private startServer(port: number): void {
    this.server.listen(port, () => {
      console.log(\`Socket.IO server running on port \${port}\`);
    });
  }
}
\`\`\`

### Client-Side Setup
\`\`\`typescript
import { io, Socket } from 'socket.io-client';

interface ServerToClientEvents {
  message: (data: MessageData) => void;
  userJoined: (data: UserJoinedData) => void;
  userLeft: (data: UserLeftData) => void;
  typing: (data: TypingData) => void;
  notification: (data: NotificationData) => void;
  connectedUsers: (users: ConnectedUser[]) => void;
}

interface ClientToServerEvents {
  joinRoom: (data: JoinRoomData) => void;
  sendMessage: (data: SendMessageData) => void;
  startTyping: () => void;
  stopTyping: () => void;
}

class SocketClient {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  private reconnectionAttempts: number = 0;
  private maxReconnectionAttempts: number = 5;

  constructor(serverUrl: string, token: string) {
    this.socket = io(serverUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    this.setupEventHandlers();
    this.setupConnectionHandlers();
  }

  private setupConnectionHandlers(): void {
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.reconnectionAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);

      if (reason === 'io server disconnect') {
        // Server forcefully disconnected, try to reconnect
        this.handleReconnection();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.handleReconnection();
    });
  }

  private handleReconnection(): void {
    if (this.reconnectionAttempts < this.maxReconnectionAttempts) {
      this.reconnectionAttempts++;
      const delay = Math.pow(2, this.reconnectionAttempts) * 1000; // Exponential backoff

      setTimeout(() => {
        console.log(\`Attempting to reconnect (\${this.reconnectionAttempts}/\${this.maxReconnectionAttempts})\`);
        this.socket.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private setupEventHandlers(): void {
    this.socket.on('message', this.handleMessage.bind(this));
    this.socket.on('userJoined', this.handleUserJoined.bind(this));
    this.socket.on('userLeft', this.handleUserLeft.bind(this));
    this.socket.on('typing', this.handleTyping.bind(this));
    this.socket.on('notification', this.handleNotification.bind(this));
  }

  // Public methods for interacting with the socket
  joinRoom(roomId: string): void {
    this.socket.emit('joinRoom', { roomId });
  }

  sendMessage(roomId: string, content: string): void {
    this.socket.emit('sendMessage', {
      roomId,
      content,
      timestamp: new Date()
    });
  }

  startTyping(roomId: string): void {
    this.socket.emit('startTyping', { roomId });
  }

  stopTyping(roomId: string): void {
    this.socket.emit('stopTyping', { roomId });
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
\`\`\`

## 2. Real-time Chat Application

### Chat Room Management
\`\`\`typescript
interface ChatRoom {
  id: string;
  name: string;
  type: 'public' | 'private' | 'direct';
  participants: string[];
  createdBy: string;
  createdAt: Date;
  settings: {
    maxParticipants?: number;
    isModerated: boolean;
    allowFileSharing: boolean;
  };
}

interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  timestamp: Date;
  edited?: boolean;
  editedAt?: Date;
  replyTo?: string;
  reactions: Map<string, string[]>; // emoji -> user IDs
}

class ChatManager {
  private rooms: Map<string, ChatRoom> = new Map();
  private messages: Map<string, Message[]> = new Map();
  private typingUsers: Map<string, Set<string>> = new Map();

  constructor(private io: Server) {
    this.setupChatHandlers();
  }

  private setupChatHandlers(): void {
    this.io.on('connection', (socket) => {
      socket.on('joinRoom', this.handleJoinRoom.bind(this, socket));
      socket.on('leaveRoom', this.handleLeaveRoom.bind(this, socket));
      socket.on('sendMessage', this.handleSendMessage.bind(this, socket));
      socket.on('editMessage', this.handleEditMessage.bind(this, socket));
      socket.on('deleteMessage', this.handleDeleteMessage.bind(this, socket));
      socket.on('reactToMessage', this.handleMessageReaction.bind(this, socket));
      socket.on('startTyping', this.handleStartTyping.bind(this, socket));
      socket.on('stopTyping', this.handleStopTyping.bind(this, socket));
    });
  }

  private async handleJoinRoom(socket: any, data: { roomId: string }): Promise<void> {
    const { roomId } = data;
    const userId = socket.data.userId;
    const username = socket.data.username;

    try {
      // Validate user can join room
      await this.validateRoomAccess(roomId, userId);

      // Add user to room
      socket.join(roomId);
      socket.data.rooms.push(roomId);

      // Update room participants
      const room = this.rooms.get(roomId);
      if (room && !room.participants.includes(userId)) {
        room.participants.push(userId);
      }

      // Send recent messages to newly joined user
      const recentMessages = this.messages.get(roomId)?.slice(-50) || [];
      socket.emit('roomHistory', {
        roomId,
        messages: recentMessages
      });

      // Notify other users in room
      socket.to(roomId).emit('userJoined', {
        roomId,
        userId,
        username,
        timestamp: new Date()
      });

      // Send updated participant list
      this.io.to(roomId).emit('participantsUpdated', {
        roomId,
        participants: room?.participants || []
      });

    } catch (error) {
      socket.emit('error', {
        type: 'JOIN_ROOM_FAILED',
        message: error.message
      });
    }
  }

  private async handleSendMessage(socket: any, data: SendMessageData): Promise<void> {
    const { roomId, content, type = 'text', replyTo } = data;
    const userId = socket.data.userId;
    const username = socket.data.username;

    try {
      // Validate message
      await this.validateMessage(roomId, userId, content);

      const message: Message = {
        id: this.generateMessageId(),
        roomId,
        senderId: userId,
        senderName: username,
        content: this.sanitizeContent(content),
        type,
        timestamp: new Date(),
        replyTo,
        reactions: new Map()
      };

      // Store message
      if (!this.messages.has(roomId)) {
        this.messages.set(roomId, []);
      }
      this.messages.get(roomId)!.push(message);

      // Persist to database
      await this.persistMessage(message);

      // Broadcast to room
      this.io.to(roomId).emit('message', message);

      // Clear typing status for sender
      this.handleStopTyping(socket, { roomId });

      // Send push notifications to offline users
      await this.sendPushNotifications(roomId, message, userId);

    } catch (error) {
      socket.emit('error', {
        type: 'SEND_MESSAGE_FAILED',
        message: error.message
      });
    }
  }

  private handleStartTyping(socket: any, data: { roomId: string }): void {
    const { roomId } = data;
    const userId = socket.data.userId;
    const username = socket.data.username;

    if (!this.typingUsers.has(roomId)) {
      this.typingUsers.set(roomId, new Set());
    }

    this.typingUsers.get(roomId)!.add(userId);

    socket.to(roomId).emit('typing', {
      roomId,
      userId,
      username,
      isTyping: true
    });

    // Auto-stop typing after 3 seconds
    setTimeout(() => {
      this.handleStopTyping(socket, { roomId });
    }, 3000);
  }

  private handleStopTyping(socket: any, data: { roomId: string }): void {
    const { roomId } = data;
    const userId = socket.data.userId;
    const username = socket.data.username;

    if (this.typingUsers.has(roomId)) {
      this.typingUsers.get(roomId)!.delete(userId);

      socket.to(roomId).emit('typing', {
        roomId,
        userId,
        username,
        isTyping: false
      });
    }
  }

  private async handleMessageReaction(socket: any, data: {
    roomId: string;
    messageId: string;
    emoji: string;
  }): Promise<void> {
    const { roomId, messageId, emoji } = data;
    const userId = socket.data.userId;

    const roomMessages = this.messages.get(roomId);
    const message = roomMessages?.find(m => m.id === messageId);

    if (message) {
      if (!message.reactions.has(emoji)) {
        message.reactions.set(emoji, []);
      }

      const users = message.reactions.get(emoji)!;
      const userIndex = users.indexOf(userId);

      if (userIndex === -1) {
        users.push(userId); // Add reaction
      } else {
        users.splice(userIndex, 1); // Remove reaction
      }

      // Remove emoji if no users
      if (users.length === 0) {
        message.reactions.delete(emoji);
      }

      // Broadcast reaction update
      this.io.to(roomId).emit('messageReactionUpdated', {
        roomId,
        messageId,
        reactions: Object.fromEntries(message.reactions)
      });

      // Persist reaction
      await this.persistMessageReaction(messageId, emoji, userId);
    }
  }
}
\`\`\`

## 3. Live Collaboration Features

### Real-time Document Editing
\`\`\`typescript
interface DocumentOperation {
  type: 'insert' | 'delete' | 'retain';
  position: number;
  content?: string;
  length?: number;
  userId: string;
  timestamp: Date;
}

interface DocumentState {
  id: string;
  content: string;
  version: number;
  lastModified: Date;
  collaborators: Map<string, CollaboratorInfo>;
}

interface CollaboratorInfo {
  userId: string;
  username: string;
  cursor: {
    position: number;
    selection?: { start: number; end: number };
  };
  color: string;
  isActive: boolean;
}

class CollaborativeEditor {
  private documents: Map<string, DocumentState> = new Map();
  private operationQueue: Map<string, DocumentOperation[]> = new Map();

  constructor(private io: Server) {
    this.setupCollaborationHandlers();
  }

  private setupCollaborationHandlers(): void {
    this.io.on('connection', (socket) => {
      socket.on('joinDocument', this.handleJoinDocument.bind(this, socket));
      socket.on('leaveDocument', this.handleLeaveDocument.bind(this, socket));
      socket.on('documentOperation', this.handleDocumentOperation.bind(this, socket));
      socket.on('cursorUpdate', this.handleCursorUpdate.bind(this, socket));
      socket.on('textSelection', this.handleTextSelection.bind(this, socket));
    });
  }

  private handleJoinDocument(socket: any, data: { documentId: string }): void {
    const { documentId } = data;
    const userId = socket.data.userId;
    const username = socket.data.username;

    socket.join(\`doc:\${documentId}\`);

    // Get or create document
    if (!this.documents.has(documentId)) {
      this.documents.set(documentId, {
        id: documentId,
        content: '',
        version: 0,
        lastModified: new Date(),
        collaborators: new Map()
      });
    }

    const doc = this.documents.get(documentId)!;

    // Add collaborator
    const collaborator: CollaboratorInfo = {
      userId,
      username,
      cursor: { position: 0 },
      color: this.generateUserColor(userId),
      isActive: true
    };

    doc.collaborators.set(userId, collaborator);

    // Send document state to new collaborator
    socket.emit('documentState', {
      documentId,
      content: doc.content,
      version: doc.version,
      collaborators: Array.from(doc.collaborators.values())
    });

    // Notify other collaborators
    socket.to(\`doc:\${documentId}\`).emit('collaboratorJoined', collaborator);
  }

  private async handleDocumentOperation(socket: any, data: {
    documentId: string;
    operations: DocumentOperation[];
  }): Promise<void> {
    const { documentId, operations } = data;
    const userId = socket.data.userId;

    const doc = this.documents.get(documentId);
    if (!doc) return;

    try {
      // Apply operations with operational transformation
      const transformedOps = await this.applyOperationalTransform(
        documentId,
        operations,
        doc.version
      );

      // Update document
      for (const op of transformedOps) {
        this.applyOperation(doc, op);
      }

      doc.version++;
      doc.lastModified = new Date();

      // Broadcast operations to other collaborators
      socket.to(\`doc:\${documentId}\`).emit('documentOperations', {
        documentId,
        operations: transformedOps,
        version: doc.version
      });

      // Acknowledge to sender
      socket.emit('operationAcknowledged', {
        documentId,
        version: doc.version
      });

      // Persist changes
      await this.persistDocumentChanges(documentId, transformedOps);

    } catch (error) {
      socket.emit('operationError', {
        documentId,
        error: error.message
      });
    }
  }

  private applyOperationalTransform(
    documentId: string,
    operations: DocumentOperation[],
    expectedVersion: number
  ): DocumentOperation[] {
    const doc = this.documents.get(documentId)!;

    if (doc.version !== expectedVersion) {
      // Transform operations against concurrent operations
      const concurrentOps = this.operationQueue.get(documentId) || [];
      return this.transformOperations(operations, concurrentOps);
    }

    return operations;
  }

  private transformOperations(
    clientOps: DocumentOperation[],
    serverOps: DocumentOperation[]
  ): DocumentOperation[] {
    let transformedOps = [...clientOps];

    for (const serverOp of serverOps) {
      transformedOps = transformedOps.map(clientOp => {
        return this.transformOperation(clientOp, serverOp);
      });
    }

    return transformedOps;
  }

  private transformOperation(
    clientOp: DocumentOperation,
    serverOp: DocumentOperation
  ): DocumentOperation {
    // Simplified operational transformation logic
    if (serverOp.type === 'insert') {
      if (clientOp.position >= serverOp.position) {
        return {
          ...clientOp,
          position: clientOp.position + (serverOp.content?.length || 0)
        };
      }
    } else if (serverOp.type === 'delete') {
      if (clientOp.position >= serverOp.position) {
        return {
          ...clientOp,
          position: Math.max(
            serverOp.position,
            clientOp.position - (serverOp.length || 0)
          )
        };
      }
    }

    return clientOp;
  }

  private applyOperation(doc: DocumentState, operation: DocumentOperation): void {
    switch (operation.type) {
      case 'insert':
        doc.content =
          doc.content.slice(0, operation.position) +
          (operation.content || '') +
          doc.content.slice(operation.position);
        break;

      case 'delete':
        doc.content =
          doc.content.slice(0, operation.position) +
          doc.content.slice(operation.position + (operation.length || 0));
        break;

      case 'retain':
        // No change to content for retain operations
        break;
    }
  }

  private handleCursorUpdate(socket: any, data: {
    documentId: string;
    position: number;
  }): void {
    const { documentId, position } = data;
    const userId = socket.data.userId;

    const doc = this.documents.get(documentId);
    const collaborator = doc?.collaborators.get(userId);

    if (collaborator) {
      collaborator.cursor.position = position;

      socket.to(\`doc:\${documentId}\`).emit('cursorMoved', {
        userId,
        position
      });
    }
  }
}
\`\`\`

## 4. Live Updates and Notifications

### Real-time Notification System
\`\`\`typescript
interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'mention' | 'system' | 'update';
  title: string;
  content: string;
  data?: any;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: Date;
  readAt?: Date;
  actionUrl?: string;
}

class NotificationManager {
  private userNotifications: Map<string, Notification[]> = new Map();
  private pushService: PushNotificationService;

  constructor(private io: Server) {
    this.pushService = new PushNotificationService();
    this.setupNotificationHandlers();
  }

  private setupNotificationHandlers(): void {
    this.io.on('connection', (socket) => {
      socket.on('markNotificationRead', this.handleMarkAsRead.bind(this, socket));
      socket.on('markAllRead', this.handleMarkAllRead.bind(this, socket));
      socket.on('getNotifications', this.handleGetNotifications.bind(this, socket));
    });
  }

  async sendNotification(notification: Notification): Promise<void> {
    const { userId } = notification;

    // Store notification
    if (!this.userNotifications.has(userId)) {
      this.userNotifications.set(userId, []);
    }
    this.userNotifications.get(userId)!.push(notification);

    // Persist to database
    await this.persistNotification(notification);

    // Send real-time notification if user is online
    const userSocket = this.findUserSocket(userId);
    if (userSocket) {
      userSocket.emit('notification', notification);
    } else {
      // Send push notification if user is offline
      await this.pushService.sendPushNotification(userId, notification);
    }

    // Update notification count
    await this.updateNotificationCount(userId);
  }

  async sendBulkNotification(
    userIds: string[],
    notificationTemplate: Omit<Notification, 'id' | 'userId' | 'createdAt'>
  ): Promise<void> {
    const notifications = userIds.map(userId => ({
      ...notificationTemplate,
      id: this.generateNotificationId(),
      userId,
      createdAt: new Date()
    }));

    // Send notifications in batches
    const batchSize = 100;
    for (let i = 0; i < notifications.length; i += batchSize) {
      const batch = notifications.slice(i, i + batchSize);
      await Promise.all(
        batch.map(notification => this.sendNotification(notification))
      );
    }
  }

  private findUserSocket(userId: string): any {
    for (const [, socket] of this.io.sockets.sockets) {
      if (socket.data.userId === userId) {
        return socket;
      }
    }
    return null;
  }

  private async updateNotificationCount(userId: string): Promise<void> {
    const notifications = this.userNotifications.get(userId) || [];
    const unreadCount = notifications.filter(n => !n.readAt).length;

    const userSocket = this.findUserSocket(userId);
    if (userSocket) {
      userSocket.emit('notificationCountUpdated', { unreadCount });
    }
  }
}

// Live data updates for dashboard/analytics
class LiveDataManager {
  private dataStreams: Map<string, any> = new Map();

  constructor(private io: Server) {
    this.setupDataStreams();
  }

  private setupDataStreams(): void {
    // Real-time analytics updates
    setInterval(() => {
      this.broadcastAnalyticsUpdate();
    }, 5000);

    // Live user activity
    setInterval(() => {
      this.broadcastUserActivity();
    }, 2000);

    // System status updates
    setInterval(() => {
      this.broadcastSystemStatus();
    }, 10000);
  }

  private async broadcastAnalyticsUpdate(): Promise<void> {
    const analytics = await this.getRealtimeAnalytics();

    this.io.to('analytics').emit('analyticsUpdate', {
      timestamp: new Date(),
      data: analytics
    });
  }

  private async broadcastUserActivity(): Promise<void> {
    const activeUsers = await this.getActiveUserCount();
    const onlineUsers = this.io.sockets.sockets.size;

    this.io.emit('userActivityUpdate', {
      activeUsers,
      onlineUsers,
      timestamp: new Date()
    });
  }

  private async broadcastSystemStatus(): Promise<void> {
    const systemStatus = await this.getSystemHealth();

    this.io.emit('systemStatusUpdate', systemStatus);
  }
}
\`\`\`

## 5. Gaming and Interactive Features

### Multiplayer Game Framework
\`\`\`typescript
interface GameState {
  id: string;
  type: string;
  players: Map<string, Player>;
  status: 'waiting' | 'playing' | 'paused' | 'finished';
  currentTurn?: string;
  board?: any;
  settings: GameSettings;
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}

interface Player {
  id: string;
  username: string;
  score: number;
  isReady: boolean;
  joinedAt: Date;
  lastAction?: Date;
}

interface GameAction {
  type: string;
  playerId: string;
  data: any;
  timestamp: Date;
}

class GameManager {
  private games: Map<string, GameState> = new Map();
  private playerGameMap: Map<string, string> = new Map();

  constructor(private io: Server) {
    this.setupGameHandlers();
  }

  private setupGameHandlers(): void {
    this.io.on('connection', (socket) => {
      socket.on('createGame', this.handleCreateGame.bind(this, socket));
      socket.on('joinGame', this.handleJoinGame.bind(this, socket));
      socket.on('leaveGame', this.handleLeaveGame.bind(this, socket));
      socket.on('gameAction', this.handleGameAction.bind(this, socket));
      socket.on('playerReady', this.handlePlayerReady.bind(this, socket));
    });
  }

  private handleCreateGame(socket: any, data: {
    gameType: string;
    settings: GameSettings;
  }): void {
    const { gameType, settings } = data;
    const userId = socket.data.userId;
    const username = socket.data.username;

    const gameId = this.generateGameId();
    const game: GameState = {
      id: gameId,
      type: gameType,
      players: new Map(),
      status: 'waiting',
      settings,
      createdAt: new Date()
    };

    // Add creator as first player
    const player: Player = {
      id: userId,
      username,
      score: 0,
      isReady: false,
      joinedAt: new Date()
    };

    game.players.set(userId, player);
    this.games.set(gameId, game);
    this.playerGameMap.set(userId, gameId);

    socket.join(\`game:\${gameId}\`);

    socket.emit('gameCreated', {
      gameId,
      game: this.serializeGameState(game)
    });
  }

  private handleJoinGame(socket: any, data: { gameId: string }): void {
    const { gameId } = data;
    const userId = socket.data.userId;
    const username = socket.data.username;

    const game = this.games.get(gameId);
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    if (game.status !== 'waiting') {
      socket.emit('error', { message: 'Game already started' });
      return;
    }

    if (game.players.size >= game.settings.maxPlayers) {
      socket.emit('error', { message: 'Game is full' });
      return;
    }

    // Add player to game
    const player: Player = {
      id: userId,
      username,
      score: 0,
      isReady: false,
      joinedAt: new Date()
    };

    game.players.set(userId, player);
    this.playerGameMap.set(userId, gameId);

    socket.join(\`game:\${gameId}\`);

    // Notify all players
    this.io.to(\`game:\${gameId}\`).emit('playerJoined', {
      gameId,
      player,
      gameState: this.serializeGameState(game)
    });
  }

  private handleGameAction(socket: any, data: {
    gameId: string;
    action: GameAction;
  }): void {
    const { gameId, action } = data;
    const userId = socket.data.userId;

    const game = this.games.get(gameId);
    if (!game || !game.players.has(userId)) {
      socket.emit('error', { message: 'Invalid game or player' });
      return;
    }

    if (game.status !== 'playing') {
      socket.emit('error', { message: 'Game is not active' });
      return;
    }

    // Validate turn if applicable
    if (game.currentTurn && game.currentTurn !== userId) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }

    try {
      // Process game action based on game type
      const result = this.processGameAction(game, action);

      // Update game state
      this.updateGameState(game, result);

      // Broadcast action to all players
      this.io.to(\`game:\${gameId}\`).emit('gameAction', {
        gameId,
        action,
        result,
        gameState: this.serializeGameState(game)
      });

      // Check for game end conditions
      if (this.checkGameEnd(game)) {
        this.endGame(game);
      }

    } catch (error) {
      socket.emit('gameActionError', {
        gameId,
        action,
        error: error.message
      });
    }
  }

  private processGameAction(game: GameState, action: GameAction): any {
    // Game-specific logic would go here
    switch (game.type) {
      case 'tic-tac-toe':
        return this.processTicTacToeAction(game, action);
      case 'chess':
        return this.processChessAction(game, action);
      case 'card-game':
        return this.processCardGameAction(game, action);
      default:
        throw new Error('Unsupported game type');
    }
  }

  private endGame(game: GameState): void {
    game.status = 'finished';
    game.finishedAt = new Date();

    const winners = this.calculateWinners(game);

    this.io.to(\`game:\${game.id}\`).emit('gameEnded', {
      gameId: game.id,
      winners,
      finalScores: Array.from(game.players.values()).map(p => ({
        playerId: p.id,
        username: p.username,
        score: p.score
      }))
    });

    // Clean up
    for (const playerId of game.players.keys()) {
      this.playerGameMap.delete(playerId);
    }

    // Keep game in memory for a short time for final results
    setTimeout(() => {
      this.games.delete(game.id);
    }, 60000);
  }
}
\`\`\`

## 6. Performance Optimization and Scaling

### Connection Management and Clustering
\`\`\`typescript
import cluster from 'cluster';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

class ScalableSocketServer {
  private redisAdapter: any;

  constructor() {
    if (cluster.isMaster) {
      this.setupMasterProcess();
    } else {
      this.setupWorkerProcess();
    }
  }

  private setupMasterProcess(): void {
    const numCPUs = require('os').cpus().length;

    console.log(\`Master \${process.pid} is running\`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(\`Worker \${worker.process.pid} died\`);
      cluster.fork();
    });
  }

  private async setupWorkerProcess(): Promise<void> {
    const app = express();
    const server = createServer(app);
    const io = new Server(server);

    // Redis adapter for horizontal scaling
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    io.adapter(createAdapter(pubClient, subClient));

    // Connection limiting
    const connectionLimiter = this.createConnectionLimiter();

    io.use(connectionLimiter);

    // Memory usage monitoring
    this.setupMemoryMonitoring();

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        connections: io.engine.clientsCount,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      });
    });

    server.listen(process.env.PORT || 3000, () => {
      console.log(\`Worker \${process.pid} started\`);
    });
  }

  private createConnectionLimiter() {
    const connectionCounts = new Map<string, number>();
    const maxConnectionsPerIP = 10;

    return (socket: any, next: any) => {
      const ip = socket.request.connection.remoteAddress;
      const currentConnections = connectionCounts.get(ip) || 0;

      if (currentConnections >= maxConnectionsPerIP) {
        return next(new Error('Connection limit exceeded'));
      }

      connectionCounts.set(ip, currentConnections + 1);

      socket.on('disconnect', () => {
        const count = connectionCounts.get(ip) || 0;
        if (count <= 1) {
          connectionCounts.delete(ip);
        } else {
          connectionCounts.set(ip, count - 1);
        }
      });

      next();
    };
  }

  private setupMemoryMonitoring(): void {
    setInterval(() => {
      const memUsage = process.memoryUsage();
      const memoryThreshold = 500 * 1024 * 1024; // 500MB

      if (memUsage.heapUsed > memoryThreshold) {
        console.warn('High memory usage detected:', {
          heapUsed: \`\${Math.round(memUsage.heapUsed / 1024 / 1024)}MB\`,
          heapTotal: \`\${Math.round(memUsage.heapTotal / 1024 / 1024)}MB\`,
          external: \`\${Math.round(memUsage.external / 1024 / 1024)}MB\`
        });

        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }
      }
    }, 30000);
  }
}
\`\`\`

## 7. Security and Authentication

### Secure Socket Implementation
\`\`\`typescript
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

class SecureSocketServer {
  private ipAttempts: Map<string, { count: number; lastAttempt: Date }> = new Map();
  private suspiciousActivity: Map<string, number> = new Map();

  constructor(private io: Server) {
    this.setupSecurityMiddleware();
    this.setupSecurityMonitoring();
  }

  private setupSecurityMiddleware(): void {
    // JWT Authentication
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

        if (!token) {
          throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const user = await this.validateUser(decoded.userId);

        if (!user || !user.isActive) {
          throw new Error('Invalid or inactive user');
        }

        socket.data.userId = user.id;
        socket.data.username = user.username;
        socket.data.roles = user.roles;

        next();

      } catch (error) {
        this.logSecurityEvent('auth_failed', socket, error.message);
        next(new Error('Authentication failed'));
      }
    });

    // Rate limiting per connection
    this.io.use((socket, next) => {
      const ip = socket.request.connection.remoteAddress;
      const now = new Date();

      const attempts = this.ipAttempts.get(ip);
      if (attempts) {
        const timeDiff = now.getTime() - attempts.lastAttempt.getTime();

        if (timeDiff < 1000) { // Less than 1 second
          attempts.count++;
          if (attempts.count > 50) { // 50 connections per second
            this.logSecurityEvent('rate_limit_exceeded', socket, \`IP: \${ip}\`);
            return next(new Error('Rate limit exceeded'));
          }
        } else {
          attempts.count = 1;
        }

        attempts.lastAttempt = now;
      } else {
        this.ipAttempts.set(ip, { count: 1, lastAttempt: now });
      }

      next();
    });

    // Input validation middleware
    this.io.use((socket, next) => {
      const originalEmit = socket.emit;
      socket.emit = (event: string, ...args: any[]) => {
        // Validate and sanitize all outgoing data
        const sanitizedArgs = args.map(arg => this.sanitizeData(arg));
        return originalEmit.call(socket, event, ...sanitizedArgs);
      };

      // Wrap event handlers to validate incoming data
      const originalOn = socket.on;
      socket.on = (event: string, handler: Function) => {
        const wrappedHandler = (...args: any[]) => {
          try {
            // Validate and sanitize incoming data
            const sanitizedArgs = args.map(arg => this.validateAndSanitizeInput(arg));
            return handler(...sanitizedArgs);
          } catch (error) {
            this.logSecurityEvent('invalid_input', socket, \`Event: \${event}\`);
            socket.emit('error', { message: 'Invalid input' });
          }
        };
        return originalOn.call(socket, event, wrappedHandler);
      };

      next();
    });
  }

  private setupSecurityMonitoring(): void {
    // Monitor for suspicious patterns
    setInterval(() => {
      for (const [ip, count] of this.suspiciousActivity.entries()) {
        if (count > 100) { // Threshold for suspicious activity
          console.warn(\`Suspicious activity detected from IP: \${ip}\`);
          // Block IP or take other actions
          this.blockIP(ip);
        }
      }

      // Reset counters
      this.suspiciousActivity.clear();
    }, 60000); // Every minute

    // Clean up old IP attempt records
    setInterval(() => {
      const cutoff = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago

      for (const [ip, data] of this.ipAttempts.entries()) {
        if (data.lastAttempt < cutoff) {
          this.ipAttempts.delete(ip);
        }
      }
    }, 300000); // Every 5 minutes
  }

  private validateAndSanitizeInput(data: any): any {
    if (typeof data === 'string') {
      // Basic XSS prevention
      return data.replace(/<script.*?>.*?<\\/script>/gi, '')
                 .replace(/<iframe.*?>.*?<\\/iframe>/gi, '')
                 .replace(/javascript:/gi, '')
                 .trim()
                 .substring(0, 10000); // Limit length
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (typeof key === 'string' && key.length < 100) { // Limit key length
          sanitized[key] = this.validateAndSanitizeInput(value);
        }
      }
      return sanitized;
    }

    return data;
  }

  private sanitizeData(data: any): any {
    // Remove sensitive information from outgoing data
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      delete sanitized.password;
      delete sanitized.token;
      delete sanitized.secret;
      delete sanitized.apiKey;
      return sanitized;
    }
    return data;
  }

  private logSecurityEvent(type: string, socket: any, details: string): void {
    const event = {
      type,
      timestamp: new Date(),
      ip: socket.request.connection.remoteAddress,
      userAgent: socket.request.headers['user-agent'],
      userId: socket.data.userId,
      details
    };

    console.warn('Security Event:', event);

    // Track suspicious activity
    const ip = socket.request.connection.remoteAddress;
    const current = this.suspiciousActivity.get(ip) || 0;
    this.suspiciousActivity.set(ip, current + 1);

    // Store in security log database
    this.storeSecurityEvent(event);
  }

  private blockIP(ip: string): void {
    // Implementation depends on your infrastructure
    // Could use iptables, cloud firewall, or application-level blocking
    console.log(\`Blocking IP: \${ip}\`);
  }
}
\`\`\`

## Implementation Checklist

- [ ] Set up Socket.IO server with proper authentication
- [ ] Implement client connection management and reconnection logic
- [ ] Build real-time chat with room management
- [ ] Add typing indicators and message reactions
- [ ] Implement collaborative editing with operational transformation
- [ ] Create notification system with push notifications
- [ ] Build live data updates for dashboards
- [ ] Add gaming/interactive features if needed
- [ ] Implement proper error handling and validation
- [ ] Set up Redis adapter for horizontal scaling
- [ ] Add security middleware and rate limiting
- [ ] Monitor performance and memory usage
- [ ] Implement proper logging and analytics
- [ ] Test with load testing tools

This comprehensive guide provides the foundation for building robust, scalable real-time applications with Socket.IO, covering everything from basic setup to advanced features like collaborative editing and multiplayer gaming.`,
};
