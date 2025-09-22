import { Rule } from "../types";

export const rule: Rule = {
	id: "accessibility-wcag",
	slug: "accessibility-wcag",
	title: "Web Accessibility & WCAG Compliance",
	description:
		"Build inclusive web applications following WCAG guidelines and accessibility best practices",
	content: `# Accessibility Wcag

This document provides comprehensive guidelines for accessibility wcag development and best practices.

---

## WCAG Fundamentals

1. **WCAG**
   - WCAG 2.1 guidelines and principles
   - Implement proper wcag 2.1 guidelines and principles
   - Follow best practices for optimal results

2. **Level**
   - Level A, AA, and AAA conformance
   - Implement proper level a, aa, and aaa conformance
   - Follow best practices for optimal results

3. **Perceivable,**
   - Perceivable, Operable, Understandable, Robust (POUR)
   - Implement proper perceivable, operable, understandable, robust (pour)
   - Follow best practices for optimal results

4. **Success**
   - Success criteria and techniques
   - Implement proper success criteria and techniques
   - Follow best practices for optimal results

5. **Accessibility**
   - Accessibility testing methodology
   - Implement proper accessibility testing methodology
   - Follow best practices for optimal results

---

## Semantic HTML

6. **Proper**
   - Proper heading hierarchy (h1-h6)
   - Implement proper proper heading hierarchy (h1-h6)
   - Follow best practices for optimal results

7. **Semantic**
   - Semantic element usage (nav, main, article)
   - Implement proper semantic element usage (nav, main, article)
   - Follow best practices for optimal results

8. **Form**
   - Form label and input associations
   - Implement proper form label and input associations
   - Follow best practices for optimal results

9. **List**
   - List structure for content organization
   - Implement proper list structure for content organization
   - Follow best practices for optimal results

10. **Button**
   - Button vs link usage guidelines
   - Implement proper button vs link usage guidelines
   - Follow best practices for optimal results

---

## ARIA Implementation

11. **ARIA**
   - ARIA roles, properties, and states
   - Implement proper aria roles, properties, and states
   - Follow best practices for optimal results

12. **Live**
   - Live regions for dynamic content
   - Implement proper live regions for dynamic content
   - Follow best practices for optimal results

13. **Landmark**
   - Landmark roles for navigation
   - Implement proper landmark roles for navigation
   - Follow best practices for optimal results

14. **Describedby**
   - Describedby and labelledby relationships
   - Implement proper describedby and labelledby relationships
   - Follow best practices for optimal results

15. **Hidden**
   - Hidden content and screen readers
   - Implement proper hidden content and screen readers
   - Follow best practices for optimal results

---

## Keyboard Navigation

16. **Tab**
   - Tab order and focus management
   - Implement proper tab order and focus management
   - Follow best practices for optimal results

17. **Custom**
   - Custom interactive element handling
   - Implement proper custom interactive element handling
   - Follow best practices for optimal results

18. **Skip**
   - Skip links for navigation
   - Implement proper skip links for navigation
   - Follow best practices for optimal results

19. **Modal**
   - Modal and dropdown keyboard support
   - Implement proper modal and dropdown keyboard support
   - Follow best practices for optimal results

20. **Focus**
   - Focus traps and restoration
   - Implement proper focus traps and restoration
   - Follow best practices for optimal results

---

## Screen Reader Support

21. **Screen**
   - Screen reader testing procedures
   - Implement proper screen reader testing procedures
   - Follow best practices for optimal results

22. **Alternative**
   - Alternative text for images
   - Implement proper alternative text for images
   - Follow best practices for optimal results

23. **Table**
   - Table header associations
   - Implement proper table header associations
   - Follow best practices for optimal results

24. **Form**
   - Form error announcement
   - Implement proper form error announcement
   - Follow best practices for optimal results

25. **Content**
   - Content reading order optimization
   - Implement proper content reading order optimization
   - Follow best practices for optimal results

---

## Visual Design

26. **Color**
   - Color contrast requirements (4.5:1, 3:1)
   - Implement proper color contrast requirements (4.5:1, 3:1)
   - Follow best practices for optimal results

27. **Color-blind**
   - Color-blind friendly design
   - Implement proper color-blind friendly design
   - Follow best practices for optimal results

28. **Font**
   - Font size and readability
   - Implement proper font size and readability
   - Follow best practices for optimal results

29. **Focus**
   - Focus indicator visibility
   - Implement proper focus indicator visibility
   - Follow best practices for optimal results

30. **Text**
   - Text spacing and line height
   - Implement proper text spacing and line height
   - Follow best practices for optimal results

---

## Interactive Elements

31. **Button**
   - Button and link accessibility
   - Implement proper button and link accessibility
   - Follow best practices for optimal results

32. **Form**
   - Form input accessibility
   - Implement proper form input accessibility
   - Follow best practices for optimal results

33. **Custom**
   - Custom component accessibility
   - Implement proper custom component accessibility
   - Follow best practices for optimal results

34. **Drag**
   - Drag and drop alternatives
   - Implement proper drag and drop alternatives
   - Follow best practices for optimal results

35. **Touch**
   - Touch target size requirements
   - Implement proper touch target size requirements
   - Follow best practices for optimal results

---

## Dynamic Content

36. **Live**
   - Live regions for updates
   - Implement proper live regions for updates
   - Follow best practices for optimal results

37. **Loading**
   - Loading state announcements
   - Implement proper loading state announcements
   - Follow best practices for optimal results

38. **Error**
   - Error message handling
   - Implement proper error message handling
   - Follow best practices for optimal results

39. **Progressive**
   - Progressive enhancement
   - Implement proper progressive enhancement
   - Follow best practices for optimal results

40. **Graceful**
   - Graceful degradation
   - Implement proper graceful degradation
   - Follow best practices for optimal results

---

## Testing Strategies

41. **Automated**
   - Automated testing tools (axe, WAVE)
   - Implement proper automated testing tools (axe, wave)
   - Follow best practices for optimal results

42. **Manual**
   - Manual testing procedures
   - Implement proper manual testing procedures
   - Follow best practices for optimal results

43. **Screen**
   - Screen reader testing
   - Implement proper screen reader testing
   - Follow best practices for optimal results

44. **Keyboard-only**
   - Keyboard-only navigation testing
   - Implement proper keyboard-only navigation testing
   - Follow best practices for optimal results

45. **Color**
   - Color contrast analysis
   - Implement proper color contrast analysis
   - Follow best practices for optimal results

---

## Mobile Accessibility

46. **Touch**
   - Touch gesture alternatives
   - Implement proper touch gesture alternatives
   - Follow best practices for optimal results

47. **Voice**
   - Voice control support
   - Implement proper voice control support
   - Follow best practices for optimal results

48. **Text**
   - Text scaling and zooming
   - Implement proper text scaling and zooming
   - Follow best practices for optimal results

49. **Orientation**
   - Orientation change handling
   - Implement proper orientation change handling
   - Follow best practices for optimal results

50. **Mobile**
   - Mobile screen reader support
   - Implement proper mobile screen reader support
   - Follow best practices for optimal results

---

## Development Tools

51. **Browser**
   - Browser accessibility DevTools
   - Implement proper browser accessibility devtools
   - Follow best practices for optimal results

52. **Lighthouse**
   - Lighthouse accessibility audit
   - Implement proper lighthouse accessibility audit
   - Follow best practices for optimal results

53. **axe-core**
   - axe-core integration
   - Implement proper axe-core integration
   - Follow best practices for optimal results

54. **ESLint**
   - ESLint accessibility rules
   - Implement proper eslint accessibility rules
   - Follow best practices for optimal results

55. **Accessibility**
   - Accessibility testing frameworks
   - Implement proper accessibility testing frameworks
   - Follow best practices for optimal results

---

## Framework-Specific

56. **React**
   - React accessibility patterns
   - Implement proper react accessibility patterns
   - Follow best practices for optimal results

57. **Vue.js**
   - Vue.js accessibility features
   - Implement proper vue.js accessibility features
   - Follow best practices for optimal results

58. **Angular**
   - Angular accessibility tools
   - Implement proper angular accessibility tools
   - Follow best practices for optimal results

59. **Accessibility**
   - Accessibility in component libraries
   - Implement proper accessibility in component libraries
   - Follow best practices for optimal results

60. **ARIA**
   - ARIA in JavaScript frameworks
   - Implement proper aria in javascript frameworks
   - Follow best practices for optimal results

---

## Legal Compliance

61. **ADA**
   - ADA (Americans with Disabilities Act)
   - Implement proper ada (americans with disabilities act)
   - Follow best practices for optimal results

62. **Section**
   - Section 508 requirements
   - Implement proper section 508 requirements
   - Follow best practices for optimal results

63. **EN**
   - EN 301 549 European standard
   - Implement proper en 301 549 european standard
   - Follow best practices for optimal results

64. **AODA**
   - AODA (Accessibility for Ontarians)
   - Implement proper aoda (accessibility for ontarians)
   - Follow best practices for optimal results

65. **International**
   - International accessibility laws
   - Implement proper international accessibility laws
   - Follow best practices for optimal results

---

## Performance Considerations

66. **Accessibility**
   - Accessibility and performance balance
   - Implement proper accessibility and performance balance
   - Follow best practices for optimal results

67. **Progressive**
   - Progressive enhancement
   - Implement proper progressive enhancement
   - Follow best practices for optimal results

68. **Bandwidth**
   - Bandwidth considerations
   - Implement proper bandwidth considerations
   - Follow best practices for optimal results

69. **Device**
   - Device capability accommodation
   - Implement proper device capability accommodation
   - Follow best practices for optimal results

70. **Graceful**
   - Graceful fallbacks
   - Implement proper graceful fallbacks
   - Follow best practices for optimal results

---

## Content Strategy

71. **Plain**
   - Plain language writing
   - Implement proper plain language writing
   - Follow best practices for optimal results

72. **Content**
   - Content structure organization
   - Implement proper content structure organization
   - Follow best practices for optimal results

73. **Alternative**
   - Alternative format provision
   - Implement proper alternative format provision
   - Follow best practices for optimal results

74. **Multimedia**
   - Multimedia accessibility
   - Implement proper multimedia accessibility
   - Follow best practices for optimal results

75. **Document**
   - Document accessibility
   - Implement proper document accessibility
   - Follow best practices for optimal results

---

## User Testing

76. **Usability**
   - Usability testing with disabled users
   - Implement proper usability testing with disabled users
   - Follow best practices for optimal results

77. **Assistive**
   - Assistive technology testing
   - Implement proper assistive technology testing
   - Follow best practices for optimal results

78. **Cognitive**
   - Cognitive accessibility testing
   - Implement proper cognitive accessibility testing
   - Follow best practices for optimal results

79. **Motor**
   - Motor impairment considerations
   - Implement proper motor impairment considerations
   - Follow best practices for optimal results

80. **Accessibility**
   - Accessibility feedback collection
   - Implement proper accessibility feedback collection
   - Follow best practices for optimal results

---

## Maintenance & Updates

81. **Accessibility**
   - Accessibility in development workflow
   - Implement proper accessibility in development workflow
   - Follow best practices for optimal results

82. **Regression**
   - Regression testing procedures
   - Implement proper regression testing procedures
   - Follow best practices for optimal results

83. **Team**
   - Team training and awareness
   - Implement proper team training and awareness
   - Follow best practices for optimal results

84. **Accessibility**
   - Accessibility checklist creation
   - Implement proper accessibility checklist creation
   - Follow best practices for optimal results

85. **Continuous**
   - Continuous improvement processes
   - Implement proper continuous improvement processes
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

Follow these comprehensive guidelines for successful accessibility wcag implementation.`,
	categories: ["accessibility", "wcag", "inclusive-design", "web-standards"],
	tags: ["accessibility", "wcag", "aria", "inclusive-design", "a11y"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
