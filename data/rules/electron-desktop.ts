import { Rule } from "../types";

export const rule: Rule = {
	id: "electron-desktop",
	slug: "electron-desktop",
	title: "Electron Desktop Applications",
	description: "Build cross-platform desktop applications using Electron with web technologies",
	content: `# Electron Desktop

This document provides comprehensive guidelines for electron desktop development and best practices.

---

## Electron Fundamentals

1. **Main**
   - Main and renderer process architecture
   - Implement proper main and renderer process architecture
   - Follow best practices for optimal results

2. **IPC**
   - IPC (Inter-Process Communication) patterns
   - Implement proper ipc (inter-process communication) patterns
   - Follow best practices for optimal results

3. **BrowserWindow**
   - BrowserWindow management
   - Implement proper browserwindow management
   - Follow best practices for optimal results

4. **Menu**
   - Menu and dialog creation
   - Implement proper menu and dialog creation
   - Follow best practices for optimal results

5. **Application**
   - Application lifecycle management
   - Implement proper application lifecycle management
   - Follow best practices for optimal results

---

## Process Communication

6. **IPC**
   - IPC between main and renderer
   - Implement proper ipc between main and renderer
   - Follow best practices for optimal results

7. **Context**
   - Context isolation and security
   - Implement proper context isolation and security
   - Follow best practices for optimal results

8. **Preload**
   - Preload scripts for safe APIs
   - Implement proper preload scripts for safe apis
   - Follow best practices for optimal results

9. **Remote**
   - Remote module alternatives
   - Implement proper remote module alternatives
   - Follow best practices for optimal results

10. **Message**
   - Message passing patterns
   - Implement proper message passing patterns
   - Follow best practices for optimal results

---

## Application Architecture

11. **Main**
   - Main process setup and configuration
   - Implement proper main process setup and configuration
   - Follow best practices for optimal results

12. **Renderer**
   - Renderer process development
   - Implement proper renderer process development
   - Follow best practices for optimal results

13. **Window**
   - Window management strategies
   - Implement proper window management strategies
   - Follow best practices for optimal results

14. **State**
   - State management across processes
   - Implement proper state management across processes
   - Follow best practices for optimal results

15. **Event**
   - Event handling and coordination
   - Implement proper event handling and coordination
   - Follow best practices for optimal results

---

## Security Best Practices

16. **Context**
   - Context isolation implementation
   - Implement proper context isolation implementation
   - Follow best practices for optimal results

17. **Node.js**
   - Node.js integration guidelines
   - Implement proper node.js integration guidelines
   - Follow best practices for optimal results

18. **Content**
   - Content Security Policy (CSP)
   - Implement proper content security policy (csp)
   - Follow best practices for optimal results

19. **Secure**
   - Secure preload script development
   - Implement proper secure preload script development
   - Follow best practices for optimal results

20. **External**
   - External content handling
   - Implement proper external content handling
   - Follow best practices for optimal results

---

## Native API Integration

21. **File**
   - File system operations
   - Implement proper file system operations
   - Follow best practices for optimal results

22. **System**
   - System notifications
   - Implement proper system notifications
   - Follow best practices for optimal results

23. **Clipboard**
   - Clipboard and drag-drop
   - Implement proper clipboard and drag-drop
   - Follow best practices for optimal results

24. **System**
   - System tray integration
   - Implement proper system tray integration
   - Follow best practices for optimal results

25. **Native**
   - Native menus and shortcuts
   - Implement proper native menus and shortcuts
   - Follow best practices for optimal results

---

## Window Management

26. **Multi-window**
   - Multi-window applications
   - Implement proper multi-window applications
   - Follow best practices for optimal results

27. **Window**
   - Window state persistence
   - Implement proper window state persistence
   - Follow best practices for optimal results

28. **Modal**
   - Modal and frameless windows
   - Implement proper modal and frameless windows
   - Follow best practices for optimal results

29. **Window**
   - Window customization
   - Implement proper window customization
   - Follow best practices for optimal results

30. **Screen**
   - Screen and display management
   - Implement proper screen and display management
   - Follow best practices for optimal results

---

## Build & Distribution

31. **Electron**
   - Electron Builder configuration
   - Implement proper electron builder configuration
   - Follow best practices for optimal results

32. **Auto-updater**
   - Auto-updater implementation
   - Implement proper auto-updater implementation
   - Follow best practices for optimal results

33. **Code**
   - Code signing for security
   - Implement proper code signing for security
   - Follow best practices for optimal results

34. **Platform-specific**
   - Platform-specific builds
   - Implement proper platform-specific builds
   - Follow best practices for optimal results

35. **App**
   - App store distribution
   - Implement proper app store distribution
   - Follow best practices for optimal results

---

## Performance Optimization

36. **Memory**
   - Memory usage optimization
   - Implement proper memory usage optimization
   - Follow best practices for optimal results

37. **CPU**
   - CPU performance tuning
   - Implement proper cpu performance tuning
   - Follow best practices for optimal results

38. **Startup**
   - Startup time improvement
   - Implement proper startup time improvement
   - Follow best practices for optimal results

39. **Bundle**
   - Bundle size reduction
   - Implement proper bundle size reduction
   - Follow best practices for optimal results

40. **Resource**
   - Resource loading optimization
   - Implement proper resource loading optimization
   - Follow best practices for optimal results

---

## Development Tools

41. **DevTools**
   - DevTools integration
   - Implement proper devtools integration
   - Follow best practices for optimal results

42. **Hot**
   - Hot reload setup
   - Implement proper hot reload setup
   - Follow best practices for optimal results

43. **Debugging**
   - Debugging techniques
   - Implement proper debugging techniques
   - Follow best practices for optimal results

44. **Testing**
   - Testing strategies
   - Implement proper testing strategies
   - Follow best practices for optimal results

45. **Development**
   - Development workflow
   - Implement proper development workflow
   - Follow best practices for optimal results

---

## UI Framework Integration

46. **React**
   - React with Electron
   - Implement proper react with electron
   - Follow best practices for optimal results

47. **Vue.js**
   - Vue.js desktop applications
   - Implement proper vue.js desktop applications
   - Follow best practices for optimal results

48. **Angular**
   - Angular Electron apps
   - Implement proper angular electron apps
   - Follow best practices for optimal results

49. **Vanilla**
   - Vanilla JavaScript development
   - Implement proper vanilla javascript development
   - Follow best practices for optimal results

50. **CSS**
   - CSS framework integration
   - Implement proper css framework integration
   - Follow best practices for optimal results

---

## Native Module Usage

51. **Node.js**
   - Node.js native modules
   - Implement proper node.js native modules
   - Follow best practices for optimal results

52. **FFI**
   - FFI (Foreign Function Interface)
   - Implement proper ffi (foreign function interface)
   - Follow best practices for optimal results

53. **Platform-specific**
   - Platform-specific functionality
   - Implement proper platform-specific functionality
   - Follow best practices for optimal results

54. **Hardware**
   - Hardware access patterns
   - Implement proper hardware access patterns
   - Follow best practices for optimal results

55. **System**
   - System integration
   - Implement proper system integration
   - Follow best practices for optimal results

---

## Storage & Data

56. **Local**
   - Local database integration
   - Implement proper local database integration
   - Follow best practices for optimal results

57. **File-based**
   - File-based storage
   - Implement proper file-based storage
   - Follow best practices for optimal results

58. **Encrypted**
   - Encrypted data storage
   - Implement proper encrypted data storage
   - Follow best practices for optimal results

59. **Configuration**
   - Configuration management
   - Implement proper configuration management
   - Follow best practices for optimal results

60. **User**
   - User data handling
   - Implement proper user data handling
   - Follow best practices for optimal results

---

## Packaging & Deployment

61. **Application**
   - Application packaging
   - Implement proper application packaging
   - Follow best practices for optimal results

62. **Installer**
   - Installer creation
   - Implement proper installer creation
   - Follow best practices for optimal results

63. **Auto-update**
   - Auto-update mechanisms
   - Implement proper auto-update mechanisms
   - Follow best practices for optimal results

64. **Distribution**
   - Distribution strategies
   - Implement proper distribution strategies
   - Follow best practices for optimal results

65. **Version**
   - Version management
   - Implement proper version management
   - Follow best practices for optimal results

---

## Cross-Platform Considerations

66. **Platform-specific**
   - Platform-specific code
   - Implement proper platform-specific code
   - Follow best practices for optimal results

67. **UI/UX**
   - UI/UX differences
   - Implement proper ui/ux differences
   - Follow best practices for optimal results

68. **File**
   - File path handling
   - Implement proper file path handling
   - Follow best practices for optimal results

69. **System**
   - System integration variations
   - Implement proper system integration variations
   - Follow best practices for optimal results

70. **Testing**
   - Testing across platforms
   - Implement proper testing across platforms
   - Follow best practices for optimal results

---

## Advanced Features

71. **Custom**
   - Custom protocol handling
   - Implement proper custom protocol handling
   - Follow best practices for optimal results

72. **Deep**
   - Deep linking support
   - Implement proper deep linking support
   - Follow best practices for optimal results

73. **Background**
   - Background process management
   - Implement proper background process management
   - Follow best practices for optimal results

74. **System**
   - System service integration
   - Implement proper system service integration
   - Follow best practices for optimal results

75. **Hardware**
   - Hardware acceleration
   - Implement proper hardware acceleration
   - Follow best practices for optimal results

---

## Production Readiness

76. **Error**
   - Error handling and recovery
   - Implement proper error handling and recovery
   - Follow best practices for optimal results

77. **Crash**
   - Crash reporting integration
   - Implement proper crash reporting integration
   - Follow best practices for optimal results

78. **Performance**
   - Performance monitoring
   - Implement proper performance monitoring
   - Follow best practices for optimal results

79. **User**
   - User analytics
   - Implement proper user analytics
   - Follow best practices for optimal results

80. **Support**
   - Support and maintenance
   - Implement proper support and maintenance
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

Follow these comprehensive guidelines for successful electron desktop implementation.`,
	categories: ["electron", "desktop", "cross-platform", "javascript"],
	tags: ["electron", "desktop-app", "cross-platform", "nodejs", "web-technologies"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
