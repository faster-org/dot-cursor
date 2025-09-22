import { Rule } from "../types";

export const rule: Rule = {
	id: "websocket-realtime",
	slug: "websocket-realtime",
	title: "WebSocket Real-time Applications",
	description:
		"Build real-time applications with WebSockets, Socket.IO, and live data synchronization",
	content: `# WebSocket Real-time Applications

This document provides comprehensive guidelines for building robust, scalable real-time applications using WebSockets and related technologies.

---

## Core Principles

1. **Connection Lifecycle Management**
   - Understand the WebSocket protocol and handshake process
   - Implement proper connection establishment and termination
   - Handle browser and server compatibility issues

2. **Event-Driven Architecture**
   - Design around real-time bidirectional communication
   - Use event-based messaging patterns
   - Implement proper message framing and protocols

3. **Resilience and Recovery**
   - Build robust reconnection strategies
   - Implement graceful degradation and fallback mechanisms
   - Handle network interruptions and connection failures

---

## WebSocket Fundamentals

4. **Protocol Understanding**
   - Master WebSocket protocol specifications
   - Configure handshake process and headers correctly
   - Ensure cross-browser compatibility

5. **Connection Management**
   - Implement connection pooling and lifecycle management
   - Monitor connection health with heartbeat mechanisms
   - Handle connection limits and quotas

---

## Socket.IO Implementation

6. **Real-time Communication**
   - Use Socket.IO for enhanced WebSocket functionality
   - Implement room and namespace management
   - Configure automatic fallback mechanisms

7. **Event Management**
   - Design clear event naming conventions
   - Implement proper event handling and routing
   - Use acknowledgments for critical messages

---

## Client-Side Development

8. **JavaScript WebSocket API**
   - Use native WebSocket API efficiently
   - Implement message queue management
   - Handle state synchronization properly

9. **Error Handling and Recovery**
   - Build robust error handling mechanisms
   - Implement automatic reconnection strategies
   - Manage offline/online state transitions

---

## Server-Side Architecture

10. **WebSocket Server Implementation**
    - Design scalable server architecture
    - Implement connection pool management
    - Use efficient message broadcasting patterns

11. **Load Balancing and Scaling**
    - Configure sticky sessions for load balancing
    - Implement horizontal scaling strategies
    - Use Redis adapter for multi-server synchronization

---

## Authentication & Security

12. **Authentication Strategies**
    - Implement WebSocket authentication mechanisms
    - Use JWT token validation securely
    - Verify origins and implement CORS properly

13. **Security Best Practices**
    - Rate limit connections and messages
    - Implement message encryption when needed
    - Monitor for security threats and attacks

---

## Performance Optimization

14. **Connection Optimization**
    - Optimize connection management
    - Use message compression techniques
    - Implement efficient heartbeat mechanisms

15. **Resource Management**
    - Monitor memory and CPU usage
    - Optimize message serialization
    - Implement connection pooling

---

## Data Synchronization

16. **Conflict Resolution**
    - Implement conflict resolution strategies
    - Choose between optimistic and pessimistic updates
    - Use event sourcing patterns when appropriate

17. **Advanced Synchronization**
    - Consider CRDT (Conflict-free Replicated Data Types)
    - Implement proper synchronization algorithms
    - Handle concurrent modifications

---

## Framework Integration

18. **React Integration**
    \`\`\`javascript
    const useWebSocket = (url) => {
      const [socket, setSocket] = useState(null);
      const [isConnected, setIsConnected] = useState(false);

      useEffect(() => {
        const ws = new WebSocket(url);
        ws.onopen = () => setIsConnected(true);
        ws.onclose = () => setIsConnected(false);
        setSocket(ws);

        return () => ws.close();
      }, [url]);

      return { socket, isConnected };
    };
    \`\`\`

19. **Vue.js and Angular Integration**
    - Create reusable WebSocket services
    - Implement reactive data binding
    - Handle component lifecycle properly

---

## Testing Strategies

20. **WebSocket Testing**
    - Implement WebSocket testing strategies
    - Perform load testing on connections
    - Test message delivery reliability

21. **Performance Testing**
    - Benchmark connection stability
    - Monitor performance metrics
    - Test scaling limitations

---

## Production Considerations

22. **Monitoring and Debugging**
    - Implement connection monitoring
    - Analyze message flow patterns
    - Collect performance metrics and analytics

23. **Deployment and Maintenance**
    - Plan for graceful degradation
    - Implement health monitoring
    - Prepare disaster recovery procedures

---

## Summary Checklist

- [ ] WebSocket protocol properly implemented
- [ ] Connection lifecycle managed correctly
- [ ] Authentication and security configured
- [ ] Error handling and reconnection strategies in place
- [ ] Performance optimization implemented
- [ ] Load balancing and scaling configured
- [ ] Data synchronization strategy chosen
- [ ] Framework integration completed
- [ ] Testing strategy implemented
- [ ] Monitoring and debugging tools configured
- [ ] Production deployment plan ready

---

Build robust real-time applications by following these WebSocket best practices and patterns.`,
	categories: ["websocket", "real-time", "socket-io", "communication"],
	tags: ["websocket", "real-time", "socket-io", "live-data", "communication"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",
};
