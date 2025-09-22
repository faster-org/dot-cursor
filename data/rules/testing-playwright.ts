import { Rule } from "../types";

export const rule: Rule = {
	id: "testing-playwright",
	slug: "testing-playwright",
	title: "Playwright Testing Framework",
	description: "Modern end-to-end testing with Playwright for cross-browser automation",
	content: `# Testing Playwright

This document provides comprehensive guidelines for testing playwright development and best practices.

---

## Playwright Fundamentals

1. **Multi-browser**
   - Multi-browser support (Chromium, Firefox, Safari)
   - Implement proper multi-browser support (chromium, firefox, safari)
   - Follow best practices for optimal results

2. **Page**
   - Page object model implementation
   - Implement proper page object model implementation
   - Follow best practices for optimal results

3. **Test**
   - Test isolation with browser contexts
   - Implement proper test isolation with browser contexts
   - Follow best practices for optimal results

4. **Parallel**
   - Parallel test execution
   - Implement proper parallel test execution
   - Follow best practices for optimal results

5. **Auto-waiting**
   - Auto-waiting for elements
   - Implement proper auto-waiting for elements
   - Follow best practices for optimal results

---

## Browser & Context Management

6. **Browser**
   - Browser launching and configuration
   - Implement proper browser launching and configuration
   - Follow best practices for optimal results

7. **Context**
   - Context creation for test isolation
   - Implement proper context creation for test isolation
   - Follow best practices for optimal results

8. **Cookie**
   - Cookie and session management
   - Implement proper cookie and session management
   - Follow best practices for optimal results

9. **Viewport**
   - Viewport and device emulation
   - Implement proper viewport and device emulation
   - Follow best practices for optimal results

10. **Geolocation**
   - Geolocation and permissions
   - Implement proper geolocation and permissions
   - Follow best practices for optimal results

---

## Element Interaction

11. **Locator**
   - Locator strategies (CSS, XPath, text)
   - Implement proper locator strategies (css, xpath, text)
   - Follow best practices for optimal results

12. **User**
   - User actions (click, fill, select)
   - Implement proper user actions (click, fill, select)
   - Follow best practices for optimal results

13. **Keyboard**
   - Keyboard and mouse interactions
   - Implement proper keyboard and mouse interactions
   - Follow best practices for optimal results

14. **File**
   - File upload and download testing
   - Implement proper file upload and download testing
   - Follow best practices for optimal results

15. **Drag**
   - Drag and drop operations
   - Implement proper drag and drop operations
   - Follow best practices for optimal results

---

## Assertions & Expectations

16. **Built-in**
   - Built-in expect assertions
   - Implement proper built-in expect assertions
   - Follow best practices for optimal results

17. **Element**
   - Element state verification
   - Implement proper element state verification
   - Follow best practices for optimal results

18. **Text**
   - Text and attribute assertions
   - Implement proper text and attribute assertions
   - Follow best practices for optimal results

19. **Screenshot**
   - Screenshot comparison
   - Implement proper screenshot comparison
   - Follow best practices for optimal results

20. **Custom**
   - Custom assertion matchers
   - Implement proper custom assertion matchers
   - Follow best practices for optimal results

---

## Network Interception

21. **Request**
   - Request and response interception
   - Implement proper request and response interception
   - Follow best practices for optimal results

22. **API**
   - API mocking and stubbing
   - Implement proper api mocking and stubbing
   - Follow best practices for optimal results

23. **Network**
   - Network condition simulation
   - Implement proper network condition simulation
   - Follow best practices for optimal results

24. **Response**
   - Response modification
   - Implement proper response modification
   - Follow best practices for optimal results

25. **HAR**
   - HAR file generation
   - Implement proper har file generation
   - Follow best practices for optimal results

---

## Advanced Features

26. **Visual**
   - Visual regression testing
   - Implement proper visual regression testing
   - Follow best practices for optimal results

27. **PDF**
   - PDF and image generation
   - Implement proper pdf and image generation
   - Follow best practices for optimal results

28. **Mobile**
   - Mobile device emulation
   - Implement proper mobile device emulation
   - Follow best practices for optimal results

29. **Accessibility**
   - Accessibility testing
   - Implement proper accessibility testing
   - Follow best practices for optimal results

30. **Performance**
   - Performance monitoring
   - Implement proper performance monitoring
   - Follow best practices for optimal results

---

## Test Organization

31. **Test**
   - Test suites and project configuration
   - Implement proper test suites and project configuration
   - Follow best practices for optimal results

32. **Shared**
   - Shared test fixtures
   - Implement proper shared test fixtures
   - Follow best practices for optimal results

33. **Test**
   - Test data management
   - Implement proper test data management
   - Follow best practices for optimal results

34. **Environment**
   - Environment configuration
   - Implement proper environment configuration
   - Follow best practices for optimal results

35. **Test**
   - Test grouping and tagging
   - Implement proper test grouping and tagging
   - Follow best practices for optimal results

---

## Authentication Testing

36. **Login**
   - Login flow automation
   - Implement proper login flow automation
   - Follow best practices for optimal results

37. **Session**
   - Session persistence
   - Implement proper session persistence
   - Follow best practices for optimal results

38. **Multi-factor**
   - Multi-factor authentication
   - Implement proper multi-factor authentication
   - Follow best practices for optimal results

39. **SSO**
   - SSO integration testing
   - Implement proper sso integration testing
   - Follow best practices for optimal results

40. **Token-based**
   - Token-based authentication
   - Implement proper token-based authentication
   - Follow best practices for optimal results

---

## Debugging & Troubleshooting

41. **Headed**
   - Headed mode for debugging
   - Implement proper headed mode for debugging
   - Follow best practices for optimal results

42. **Trace**
   - Trace viewer for test analysis
   - Implement proper trace viewer for test analysis
   - Follow best practices for optimal results

43. **Video**
   - Video recording and screenshots
   - Implement proper video recording and screenshots
   - Follow best practices for optimal results

44. **Slow**
   - Slow motion execution
   - Implement proper slow motion execution
   - Follow best practices for optimal results

45. **Step-by-step**
   - Step-by-step debugging
   - Implement proper step-by-step debugging
   - Follow best practices for optimal results

---

## CI/CD Integration

46. **GitHub**
   - GitHub Actions integration
   - Implement proper github actions integration
   - Follow best practices for optimal results

47. **Docker**
   - Docker container execution
   - Implement proper docker container execution
   - Follow best practices for optimal results

48. **Parallel**
   - Parallel test distribution
   - Implement proper parallel test distribution
   - Follow best practices for optimal results

49. **Test**
   - Test result reporting
   - Implement proper test result reporting
   - Follow best practices for optimal results

50. **Artifact**
   - Artifact management
   - Implement proper artifact management
   - Follow best practices for optimal results

---

## Performance Testing

51. **Core**
   - Core Web Vitals measurement
   - Implement proper core web vitals measurement
   - Follow best practices for optimal results

52. **Network**
   - Network throttling
   - Implement proper network throttling
   - Follow best practices for optimal results

53. **Resource**
   - Resource monitoring
   - Implement proper resource monitoring
   - Follow best practices for optimal results

54. **Performance**
   - Performance budgets
   - Implement proper performance budgets
   - Follow best practices for optimal results

55. **Lighthouse**
   - Lighthouse integration
   - Implement proper lighthouse integration
   - Follow best practices for optimal results

---

## Cross-Platform Testing

56. **Desktop**
   - Desktop browser testing
   - Implement proper desktop browser testing
   - Follow best practices for optimal results

57. **Mobile**
   - Mobile web testing
   - Implement proper mobile web testing
   - Follow best practices for optimal results

58. **Electron**
   - Electron app testing
   - Implement proper electron app testing
   - Follow best practices for optimal results

59. **Different**
   - Different operating systems
   - Implement proper different operating systems
   - Follow best practices for optimal results

60. **Browser**
   - Browser version testing
   - Implement proper browser version testing
   - Follow best practices for optimal results

---

## Best Practices

61. **Reliable**
   - Reliable element selection
   - Implement proper reliable element selection
   - Follow best practices for optimal results

62. **Test**
   - Test stability optimization
   - Implement proper test stability optimization
   - Follow best practices for optimal results

63. **Proper**
   - Proper error handling
   - Implement proper proper error handling
   - Follow best practices for optimal results

64. **Test**
   - Test maintainability
   - Implement proper test maintainability
   - Follow best practices for optimal results

65. **Code**
   - Code reusability patterns
   - Implement proper code reusability patterns
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

Follow these comprehensive guidelines for successful testing playwright implementation.`,
	categories: ["testing", "playwright", "e2e", "automation"],
	tags: ["playwright", "e2e-testing", "cross-browser", "automation", "web-testing"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
