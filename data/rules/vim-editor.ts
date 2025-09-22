import { Rule } from "../types";

export const rule: Rule = {
	id: "vim-editor",
	slug: "vim-editor",
	title: "Vim Editor Mastery",
	description: "Master Vim editor for efficient text editing and development workflows",
	content: `# Vim Editor

This document provides comprehensive guidelines for vim editor development and best practices.

---

## Vim Fundamentals

1. **Modal**
   - Modal editing concepts (Normal, Insert, Visual)
   - Implement proper modal editing concepts (normal, insert, visual)
   - Follow best practices for optimal results

2. **Navigation**
   - Navigation and movement commands
   - Implement proper navigation and movement commands
   - Follow best practices for optimal results

3. **Text**
   - Text object manipulation
   - Implement proper text object manipulation
   - Follow best practices for optimal results

4. **Command-line**
   - Command-line mode usage
   - Implement proper command-line mode usage
   - Follow best practices for optimal results

5. **Buffer,**
   - Buffer, window, and tab management
   - Implement proper buffer, window, and tab management
   - Follow best practices for optimal results

---

## Movement & Navigation

6. **Character**
   - Character and word movement (h, j, k, l, w, b, e)
   - Implement proper character and word movement (h, j, k, l, w, b, e)
   - Follow best practices for optimal results

7. **Line**
   - Line navigation (0, ^, $, gg, G)
   - Implement proper line navigation (0, ^, $, gg, g)
   - Follow best practices for optimal results

8. **Screen**
   - Screen movement (H, M, L, Ctrl-f, Ctrl-b)
   - Implement proper screen movement (h, m, l, ctrl-f, ctrl-b)
   - Follow best practices for optimal results

9. **Search**
   - Search and jump commands (/, ?, n, N, *, #)
   - Implement proper search and jump commands (/, ?, n, n, *, #)
   - Follow best practices for optimal results

10. **Mark**
   - Mark and jump operations (m, ')
   - Implement proper mark and jump operations (m, ')
   - Follow best practices for optimal results

---

## Text Manipulation

11. **Insert,**
   - Insert, append, and replace modes
   - Implement proper insert, append, and replace modes
   - Follow best practices for optimal results

12. **Delete,**
   - Delete, copy, and paste operations
   - Implement proper delete, copy, and paste operations
   - Follow best practices for optimal results

13. **Text**
   - Text objects (word, sentence, paragraph, block)
   - Implement proper text objects (word, sentence, paragraph, block)
   - Follow best practices for optimal results

14. **Change**
   - Change and substitute commands
   - Implement proper change and substitute commands
   - Follow best practices for optimal results

15. **Undo**
   - Undo and redo functionality
   - Implement proper undo and redo functionality
   - Follow best practices for optimal results

---

## Visual Mode Operations

16. **Character,**
   - Character, line, and block visual selection
   - Implement proper character, line, and block visual selection
   - Follow best practices for optimal results

17. **Visual**
   - Visual mode commands and operations
   - Implement proper visual mode commands and operations
   - Follow best practices for optimal results

18. **Text**
   - Text transformation in visual mode
   - Implement proper text transformation in visual mode
   - Follow best practices for optimal results

19. **Multi-line**
   - Multi-line editing techniques
   - Implement proper multi-line editing techniques
   - Follow best practices for optimal results

20. **Selection**
   - Selection and manipulation shortcuts
   - Implement proper selection and manipulation shortcuts
   - Follow best practices for optimal results

---

## Search & Replace

21. **Pattern**
   - Pattern searching with regular expressions
   - Implement proper pattern searching with regular expressions
   - Follow best practices for optimal results

22. **Global**
   - Global search and replace operations
   - Implement proper global search and replace operations
   - Follow best practices for optimal results

23. **Case-sensitive**
   - Case-sensitive and insensitive searching
   - Implement proper case-sensitive and insensitive searching
   - Follow best practices for optimal results

24. **Search**
   - Search scope and range specification
   - Implement proper search scope and range specification
   - Follow best practices for optimal results

25. **Advanced**
   - Advanced substitution patterns
   - Implement proper advanced substitution patterns
   - Follow best practices for optimal results

---

## File Operations

26. **File**
   - File opening, saving, and closing
   - Implement proper file opening, saving, and closing
   - Follow best practices for optimal results

27. **Buffer**
   - Buffer management and switching
   - Implement proper buffer management and switching
   - Follow best practices for optimal results

28. **Multiple**
   - Multiple file editing workflows
   - Implement proper multiple file editing workflows
   - Follow best practices for optimal results

29. **File**
   - File exploration with netrw
   - Implement proper file exploration with netrw
   - Follow best practices for optimal results

30. **Session**
   - Session management
   - Implement proper session management
   - Follow best practices for optimal results

---

## Configuration & Customization

31. **.vimrc**
   - .vimrc configuration file
   - Implement proper .vimrc configuration file
   - Follow best practices for optimal results

32. **Key**
   - Key mapping and remapping
   - Implement proper key mapping and remapping
   - Follow best practices for optimal results

33. **Custom**
   - Custom commands and functions
   - Implement proper custom commands and functions
   - Follow best practices for optimal results

34. **Plugin**
   - Plugin management systems
   - Implement proper plugin management systems
   - Follow best practices for optimal results

35. **Color**
   - Color schemes and themes
   - Implement proper color schemes and themes
   - Follow best practices for optimal results

---

## Plugin Ecosystem

36. **Essential**
   - Essential plugins (NERDTree, ctrlp, fugitive)
   - Implement proper essential plugins (nerdtree, ctrlp, fugitive)
   - Follow best practices for optimal results

37. **Plugin**
   - Plugin managers (Pathogen, Vundle, vim-plug)
   - Implement proper plugin managers (pathogen, vundle, vim-plug)
   - Follow best practices for optimal results

38. **Syntax**
   - Syntax highlighting and language support
   - Implement proper syntax highlighting and language support
   - Follow best practices for optimal results

39. **Code**
   - Code completion and IntelliSense
   - Implement proper code completion and intellisense
   - Follow best practices for optimal results

40. **Git**
   - Git integration plugins
   - Implement proper git integration plugins
   - Follow best practices for optimal results

---

## Advanced Features

41. **Macros**
   - Macros and automation
   - Implement proper macros and automation
   - Follow best practices for optimal results

42. **Register**
   - Register manipulation
   - Implement proper register manipulation
   - Follow best practices for optimal results

43. **Window**
   - Window splitting and management
   - Implement proper window splitting and management
   - Follow best practices for optimal results

44. **Folding**
   - Folding and outlining
   - Implement proper folding and outlining
   - Follow best practices for optimal results

45. **Quickfix**
   - Quickfix and location lists
   - Implement proper quickfix and location lists
   - Follow best practices for optimal results

---

## Programming Support

46. **Syntax**
   - Syntax highlighting configuration
   - Implement proper syntax highlighting configuration
   - Follow best practices for optimal results

47. **Code**
   - Code indentation and formatting
   - Implement proper code indentation and formatting
   - Follow best practices for optimal results

48. **Compiler**
   - Compiler integration
   - Implement proper compiler integration
   - Follow best practices for optimal results

49. **Error**
   - Error navigation and quickfix
   - Implement proper error navigation and quickfix
   - Follow best practices for optimal results

50. **Tag**
   - Tag navigation and completion
   - Implement proper tag navigation and completion
   - Follow best practices for optimal results

---

## Productivity Techniques

51. **Efficient**
   - Efficient editing workflows
   - Implement proper efficient editing workflows
   - Follow best practices for optimal results

52. **Repetition**
   - Repetition and automation strategies
   - Implement proper repetition and automation strategies
   - Follow best practices for optimal results

53. **Custom**
   - Custom shortcuts and mappings
   - Implement proper custom shortcuts and mappings
   - Follow best practices for optimal results

54. **Text**
   - Text processing and manipulation
   - Implement proper text processing and manipulation
   - Follow best practices for optimal results

55. **Time-saving**
   - Time-saving command combinations
   - Implement proper time-saving command combinations
   - Follow best practices for optimal results

---

## Neovim Features

56. **Asynchronous**
   - Asynchronous plugin support
   - Implement proper asynchronous plugin support
   - Follow best practices for optimal results

57. **Built-in**
   - Built-in terminal emulator
   - Implement proper built-in terminal emulator
   - Follow best practices for optimal results

58. **Language**
   - Language Server Protocol (LSP) integration
   - Implement proper language server protocol (lsp) integration
   - Follow best practices for optimal results

59. **Improved**
   - Improved plugin architecture
   - Implement proper improved plugin architecture
   - Follow best practices for optimal results

60. **Modern**
   - Modern configuration options
   - Implement proper modern configuration options
   - Follow best practices for optimal results

---

## Development Integration

61. **IDE-like**
   - IDE-like features with plugins
   - Implement proper ide-like features with plugins
   - Follow best practices for optimal results

62. **Debugger**
   - Debugger integration
   - Implement proper debugger integration
   - Follow best practices for optimal results

63. **Version**
   - Version control workflows
   - Implement proper version control workflows
   - Follow best practices for optimal results

64. **Project**
   - Project management
   - Implement proper project management
   - Follow best practices for optimal results

65. **Build**
   - Build system integration
   - Implement proper build system integration
   - Follow best practices for optimal results

---

## Troubleshooting

66. **Common**
   - Common configuration issues
   - Implement proper common configuration issues
   - Follow best practices for optimal results

67. **Plugin**
   - Plugin conflicts resolution
   - Implement proper plugin conflicts resolution
   - Follow best practices for optimal results

68. **Performance**
   - Performance optimization
   - Implement proper performance optimization
   - Follow best practices for optimal results

69. **Key**
   - Key mapping debugging
   - Implement proper key mapping debugging
   - Follow best practices for optimal results

70. **Error**
   - Error message interpretation
   - Implement proper error message interpretation
   - Follow best practices for optimal results

---

## Best Practices

71. **Efficient**
   - Efficient editing habits
   - Implement proper efficient editing habits
   - Follow best practices for optimal results

72. **Configuration**
   - Configuration organization
   - Implement proper configuration organization
   - Follow best practices for optimal results

73. **Plugin**
   - Plugin selection criteria
   - Implement proper plugin selection criteria
   - Follow best practices for optimal results

74. **Learning**
   - Learning progression strategies
   - Implement proper learning progression strategies
   - Follow best practices for optimal results

75. **Workflow**
   - Workflow optimization
   - Implement proper workflow optimization
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

Follow these comprehensive guidelines for successful vim editor implementation.`,
	categories: ["vim", "editor", "productivity", "development-tools"],
	tags: ["vim", "text-editor", "modal-editing", "productivity", "command-line"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
