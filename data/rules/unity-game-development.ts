import { Rule } from "../types";

export const rule: Rule = {
	id: "unity-game-development",
	slug: "unity-game-development",
	title: "Unity Game Development",
	description: "Create 2D and 3D games using Unity engine with C# scripting",
	content: `# Unity Game Development

This document provides comprehensive guidelines for unity game development development and best practices.

---

## Unity Fundamentals

1. **GameObject**
   - GameObject and Component architecture
   - Implement proper gameobject and component architecture
   - Follow best practices for optimal results

2. **Scene**
   - Scene management and hierarchy
   - Implement proper scene management and hierarchy
   - Follow best practices for optimal results

3. **Inspector**
   - Inspector window and serialization
   - Implement proper inspector window and serialization
   - Follow best practices for optimal results

4. **Prefab**
   - Prefab system for reusable objects
   - Implement proper prefab system for reusable objects
   - Follow best practices for optimal results

5. **Asset**
   - Asset pipeline and project organization
   - Implement proper asset pipeline and project organization
   - Follow best practices for optimal results

---

## C# Scripting in Unity

6. **MonoBehaviour**
   - MonoBehaviour lifecycle methods
   - Implement proper monobehaviour lifecycle methods
   - Follow best practices for optimal results

7. **Unity-specific**
   - Unity-specific attributes ([SerializeField], [Header])
   - Implement proper unity-specific attributes ([serializefield], [header])
   - Follow best practices for optimal results

8. **Coroutines**
   - Coroutines for time-based operations
   - Implement proper coroutines for time-based operations
   - Follow best practices for optimal results

9. **Unity**
   - Unity Events and UnityAction
   - Implement proper unity events and unityaction
   - Follow best practices for optimal results

10. **ScriptableObjects**
   - ScriptableObjects for data containers
   - Implement proper scriptableobjects for data containers
   - Follow best practices for optimal results

---

## Physics Systems

11. **Rigidbody**
   - Rigidbody components for physics simulation
   - Implement proper rigidbody components for physics simulation
   - Follow best practices for optimal results

12. **Collider**
   - Collider types and collision detection
   - Implement proper collider types and collision detection
   - Follow best practices for optimal results

13. **Triggers**
   - Triggers for interaction zones
   - Implement proper triggers for interaction zones
   - Follow best practices for optimal results

14. **Physics**
   - Physics materials and constraints
   - Implement proper physics materials and constraints
   - Follow best practices for optimal results

15. **2D**
   - 2D vs 3D physics considerations
   - Implement proper 2d vs 3d physics considerations
   - Follow best practices for optimal results

---

## Animation

16. **Animator**
   - Animator Controller state machines
   - Implement proper animator controller state machines
   - Follow best practices for optimal results

17. **Animation**
   - Animation clips and curves
   - Implement proper animation clips and curves
   - Follow best practices for optimal results

18. **Blend**
   - Blend trees for smooth transitions
   - Implement proper blend trees for smooth transitions
   - Follow best practices for optimal results

19. **Timeline**
   - Timeline for cutscenes and sequences
   - Implement proper timeline for cutscenes and sequences
   - Follow best practices for optimal results

20. **Inverse**
   - Inverse kinematics (IK) setup
   - Implement proper inverse kinematics (ik) setup
   - Follow best practices for optimal results

---

## UI Development

21. **Canvas**
   - Canvas and UI components
   - Implement proper canvas and ui components
   - Follow best practices for optimal results

22. **Event**
   - Event system for user interaction
   - Implement proper event system for user interaction
   - Follow best practices for optimal results

23. **Responsive**
   - Responsive UI design
   - Implement proper responsive ui design
   - Follow best practices for optimal results

24. **UI**
   - UI animation and tweening
   - Implement proper ui animation and tweening
   - Follow best practices for optimal results

25. **World**
   - World space vs screen space UI
   - Implement proper world space vs screen space ui
   - Follow best practices for optimal results

---

## Graphics & Rendering

26. **Shader**
   - Shader Graph for visual effects
   - Implement proper shader graph for visual effects
   - Follow best practices for optimal results

27. **Material**
   - Material creation and properties
   - Implement proper material creation and properties
   - Follow best practices for optimal results

28. **Lighting**
   - Lighting and post-processing
   - Implement proper lighting and post-processing
   - Follow best practices for optimal results

29. **Particle**
   - Particle systems for effects
   - Implement proper particle systems for effects
   - Follow best practices for optimal results

30. **Performance**
   - Performance optimization techniques
   - Implement proper performance optimization techniques
   - Follow best practices for optimal results

---

## Audio Implementation

31. **Audio**
   - Audio Source and Audio Listener
   - Implement proper audio source and audio listener
   - Follow best practices for optimal results

32. **Audio**
   - Audio Mixer for sound management
   - Implement proper audio mixer for sound management
   - Follow best practices for optimal results

33. **3D**
   - 3D spatial audio setup
   - Implement proper 3d spatial audio setup
   - Follow best practices for optimal results

34. **Music**
   - Music and sound effect integration
   - Implement proper music and sound effect integration
   - Follow best practices for optimal results

35. **Audio**
   - Audio compression and optimization
   - Implement proper audio compression and optimization
   - Follow best practices for optimal results

---

## Input Handling

36. **Input**
   - Input Manager and Input System
   - Implement proper input manager and input system
   - Follow best practices for optimal results

37. **Cross-platform**
   - Cross-platform input considerations
   - Implement proper cross-platform input considerations
   - Follow best practices for optimal results

38. **Touch**
   - Touch and gesture recognition
   - Implement proper touch and gesture recognition
   - Follow best practices for optimal results

39. **Controller**
   - Controller support implementation
   - Implement proper controller support implementation
   - Follow best practices for optimal results

40. **Input**
   - Input buffering and queuing
   - Implement proper input buffering and queuing
   - Follow best practices for optimal results

---

## Game Architecture

41. **Singleton**
   - Singleton pattern for managers
   - Implement proper singleton pattern for managers
   - Follow best practices for optimal results

42. **Observer**
   - Observer pattern for events
   - Implement proper observer pattern for events
   - Follow best practices for optimal results

43. **State**
   - State machines for game states
   - Implement proper state machines for game states
   - Follow best practices for optimal results

44. **Object**
   - Object pooling for performance
   - Implement proper object pooling for performance
   - Follow best practices for optimal results

45. **Scene**
   - Scene loading and management
   - Implement proper scene loading and management
   - Follow best practices for optimal results

---

## Performance Optimization

46. **Profiler**
   - Profiler usage for bottleneck identification
   - Implement proper profiler usage for bottleneck identification
   - Follow best practices for optimal results

47. **Draw**
   - Draw call optimization
   - Implement proper draw call optimization
   - Follow best practices for optimal results

48. **Memory**
   - Memory management best practices
   - Implement proper memory management best practices
   - Follow best practices for optimal results

49. **LOD**
   - LOD (Level of Detail) systems
   - Implement proper lod (level of detail) systems
   - Follow best practices for optimal results

50. **Occlusion**
   - Occlusion culling setup
   - Implement proper occlusion culling setup
   - Follow best practices for optimal results

---

## Mobile Development

51. **Platform-specific**
   - Platform-specific considerations
   - Implement proper platform-specific considerations
   - Follow best practices for optimal results

52. **Touch**
   - Touch input optimization
   - Implement proper touch input optimization
   - Follow best practices for optimal results

53. **Performance**
   - Performance tuning for mobile
   - Implement proper performance tuning for mobile
   - Follow best practices for optimal results

54. **Battery**
   - Battery usage optimization
   - Implement proper battery usage optimization
   - Follow best practices for optimal results

55. **Store**
   - Store submission guidelines
   - Implement proper store submission guidelines
   - Follow best practices for optimal results

---

## Multiplayer Gaming

56. **Unity**
   - Unity Netcode for multiplayer
   - Implement proper unity netcode for multiplayer
   - Follow best practices for optimal results

57. **Client-server**
   - Client-server architecture
   - Implement proper client-server architecture
   - Follow best practices for optimal results

58. **Network**
   - Network synchronization
   - Implement proper network synchronization
   - Follow best practices for optimal results

59. **Lag**
   - Lag compensation techniques
   - Implement proper lag compensation techniques
   - Follow best practices for optimal results

60. **Security**
   - Security considerations
   - Implement proper security considerations
   - Follow best practices for optimal results

---

## Testing & Debugging

61. **Unit**
   - Unit testing with Unity Test Runner
   - Implement proper unit testing with unity test runner
   - Follow best practices for optimal results

62. **Debugging**
   - Debugging tools and techniques
   - Implement proper debugging tools and techniques
   - Follow best practices for optimal results

63. **Performance**
   - Performance testing on target devices
   - Implement proper performance testing on target devices
   - Follow best practices for optimal results

64. **Automated**
   - Automated testing strategies
   - Implement proper automated testing strategies
   - Follow best practices for optimal results

65. **Bug**
   - Bug reporting and tracking
   - Implement proper bug reporting and tracking
   - Follow best practices for optimal results

---

## Deployment

66. **Build**
   - Build settings and player settings
   - Implement proper build settings and player settings
   - Follow best practices for optimal results

67. **Platform-specific**
   - Platform-specific build configurations
   - Implement proper platform-specific build configurations
   - Follow best practices for optimal results

68. **Asset**
   - Asset bundles for content delivery
   - Implement proper asset bundles for content delivery
   - Follow best practices for optimal results

69. **Version**
   - Version control with Git
   - Implement proper version control with git
   - Follow best practices for optimal results

70. **Continuous**
   - Continuous integration setup
   - Implement proper continuous integration setup
   - Follow best practices for optimal results

---

## Summary Checklist

- [ ] Core principles implemented
- [ ] Best practices followed
- [ ] Performance optimized
- [ ] Security measures in place
- [ ] Testing strategy implemented
- [ ] Documentation completed
- [ ] Monitoring configured
- [ ] Production deployment ready

---

Follow these comprehensive guidelines for successful unity game development implementation.`,
	categories: ["unity", "game-development", "csharp", "gamedev"],
	tags: ["unity", "game-development", "csharp", "3d", "2d-games"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
