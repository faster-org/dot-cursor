import { Rule } from '../types';

export const rule: Rule = {
	id: 'websocket-realtime',
	slug: 'websocket-realtime',
	title: 'WebSocket Real-time Applications',
	description: 'Build real-time applications with WebSockets, Socket.IO, and live data synchronization',
	content: `You are an expert in real-time web application development using WebSockets and related technologies.

WebSocket Fundamentals:
- WebSocket protocol understanding
- Connection lifecycle management
- Message framing and protocols
- Handshake process and headers
- Browser and server compatibility

Socket.IO Implementation:
- Real-time bidirectional communication
- Event-based messaging
- Room and namespace management
- Connection fallback mechanisms
- Cross-browser compatibility

Real-time Patterns:
- Live chat applications
- Collaborative editing (operational transform)
- Real-time notifications
- Live data dashboards
- Multiplayer game synchronization

Client-Side Development:
- JavaScript WebSocket API
- Reconnection strategies
- Message queue management
- State synchronization
- Error handling and recovery

Server-Side Architecture:
- WebSocket server implementation
- Connection pool management
- Message broadcasting patterns
- Load balancing with sticky sessions
- Horizontal scaling strategies

Authentication & Security:
- WebSocket authentication strategies
- JWT token validation
- Origin verification
- Rate limiting connections
- Message encryption

Performance Optimization:
- Connection management optimization
- Message compression techniques
- Heartbeat and keep-alive mechanisms
- Memory usage optimization
- CPU usage monitoring

Scaling Strategies:
- Multi-server synchronization
- Redis adapter for Socket.IO
- Message queue integration
- Database synchronization
- CDN and edge deployment

Data Synchronization:
- Conflict resolution strategies
- Optimistic vs pessimistic updates
- Event sourcing patterns
- CRDT (Conflict-free Replicated Data Types)
- Synchronization algorithms

Framework Integration:
- React with WebSocket hooks
- Vue.js real-time components
- Angular WebSocket services
- Node.js server implementation
- Express.js integration

Testing Real-time Features:
- WebSocket testing strategies
- Load testing connections
- Message delivery testing
- Connection stability testing
- Performance benchmarking

Mobile Integration:
- Native WebSocket support
- React Native implementation
- Ionic framework integration
- Background connection handling
- Battery optimization

Advanced Features:
- Binary data transmission
- File transfer over WebSocket
- Video/audio streaming
- Screen sharing implementation
- Voice/video calling

Monitoring & Debugging:
- Connection monitoring
- Message flow analysis
- Performance metrics collection
- Error tracking and logging
- Real-time analytics

Production Considerations:
- Connection limits and quotas
- Graceful degradation
- Fallback to polling
- Health monitoring
- Disaster recovery planning

Use Cases:
- Live sports scores
- Stock price updates
- Collaborative documents
- Live streaming chat
- IoT device monitoring`,
	categories: ['websocket', 'real-time', 'socket-io', 'communication'],
	tags: ['websocket', 'real-time', 'socket-io', 'live-data', 'communication'],
	author: 'Community',
	createdAt: '2024-01-30T00:00:00Z',
	applicationMode: 'files',
	globs: '*.js,*.ts,*.html,package.json'
};