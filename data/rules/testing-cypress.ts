import { Rule } from "../types";

export const rule: Rule = {
	id: "testing-cypress",
	slug: "testing-cypress",
	title: "Cypress E2E Testing",
	description: "End-to-end testing with Cypress for web applications and user journey validation",
	content: `# Testing Cypress

This document provides comprehensive guidelines for testing cypress development and best practices.

---

## Cypress Fundamentals

1. **Test**
   - Test structure with describe() and it() blocks
   - Implement proper test structure with describe() and it() blocks
   - Follow best practices for optimal results

2. **Cypress**
   - Cypress commands and chaining
   - Implement proper cypress commands and chaining
   - Follow best practices for optimal results

3. **Browser**
   - Browser automation and interaction
   - Implement proper browser automation and interaction
   - Follow best practices for optimal results

4. **Real**
   - Real browser testing environment
   - Implement proper real browser testing environment
   - Follow best practices for optimal results

5. **Time-travel**
   - Time-travel debugging capabilities
   - Implement proper time-travel debugging capabilities
   - Follow best practices for optimal results

---

## Element Interaction

6. **Element**
   - Element selection with cy.get() and selectors
   - Implement proper element selection with cy.get() and selectors
   - Follow best practices for optimal results

7. **User**
   - User interactions (click, type, select)
   - Implement proper user interactions (click, type, select)
   - Follow best practices for optimal results

8. **Form**
   - Form submission and validation
   - Implement proper form submission and validation
   - Follow best practices for optimal results

9. **File**
   - File upload testing
   - Implement proper file upload testing
   - Follow best practices for optimal results

10. **Drag**
   - Drag and drop operations
   - Implement proper drag and drop operations
   - Follow best practices for optimal results

---

## Assertions & Verification

11. **Built-in**
   - Built-in assertions with should()
   - Implement proper built-in assertions with should()
   - Follow best practices for optimal results

12. **Custom**
   - Custom assertion commands
   - Implement proper custom assertion commands
   - Follow best practices for optimal results

13. **Element**
   - Element visibility and state checking
   - Implement proper element visibility and state checking
   - Follow best practices for optimal results

14. **Text**
   - Text content verification
   - Implement proper text content verification
   - Follow best practices for optimal results

15. **Attribute**
   - Attribute and property assertions
   - Implement proper attribute and property assertions
   - Follow best practices for optimal results

---

## Navigation & Routing

16. **Page**
   - Page navigation with cy.visit()
   - Implement proper page navigation with cy.visit()
   - Follow best practices for optimal results

17. **URL**
   - URL verification and manipulation
   - Implement proper url verification and manipulation
   - Follow best practices for optimal results

18. **Browser**
   - Browser back/forward testing
   - Implement proper browser back/forward testing
   - Follow best practices for optimal results

19. **Hash**
   - Hash and query parameter handling
   - Implement proper hash and query parameter handling
   - Follow best practices for optimal results

20. **Single-page**
   - Single-page application routing
   - Implement proper single-page application routing
   - Follow best practices for optimal results

---

## Network Testing

21. **API**
   - API request interception with cy.intercept()
   - Implement proper api request interception with cy.intercept()
   - Follow best practices for optimal results

22. **Response**
   - Response mocking and stubbing
   - Implement proper response mocking and stubbing
   - Follow best practices for optimal results

23. **Network**
   - Network delay simulation
   - Implement proper network delay simulation
   - Follow best practices for optimal results

24. **API**
   - API response validation
   - Implement proper api response validation
   - Follow best practices for optimal results

25. **Authentication**
   - Authentication token handling
   - Implement proper authentication token handling
   - Follow best practices for optimal results

---

## Data Management

26. **Test**
   - Test data setup and teardown
   - Implement proper test data setup and teardown
   - Follow best practices for optimal results

27. **Database**
   - Database seeding and cleanup
   - Implement proper database seeding and cleanup
   - Follow best practices for optimal results

28. **Environment-specific**
   - Environment-specific test data
   - Implement proper environment-specific test data
   - Follow best practices for optimal results

29. **Dynamic**
   - Dynamic data generation
   - Implement proper dynamic data generation
   - Follow best practices for optimal results

30. **Test**
   - Test isolation strategies
   - Implement proper test isolation strategies
   - Follow best practices for optimal results

---

## Page Object Model

31. **Organizing**
   - Organizing tests with page objects
   - Implement proper organizing tests with page objects
   - Follow best practices for optimal results

32. **Reusable**
   - Reusable command creation
   - Implement proper reusable command creation
   - Follow best practices for optimal results

33. **Custom**
   - Custom command implementation
   - Implement proper custom command implementation
   - Follow best practices for optimal results

34. **Test**
   - Test utility functions
   - Implement proper test utility functions
   - Follow best practices for optimal results

35. **Maintainable**
   - Maintainable test structure
   - Implement proper maintainable test structure
   - Follow best practices for optimal results

---

## Advanced Features

36. **Screenshot**
   - Screenshot and video recording
   - Implement proper screenshot and video recording
   - Follow best practices for optimal results

37. **Visual**
   - Visual regression testing
   - Implement proper visual regression testing
   - Follow best practices for optimal results

38. **Cross-browser**
   - Cross-browser testing
   - Implement proper cross-browser testing
   - Follow best practices for optimal results

39. **Mobile**
   - Mobile viewport testing
   - Implement proper mobile viewport testing
   - Follow best practices for optimal results

40. **Accessibility**
   - Accessibility testing integration
   - Implement proper accessibility testing integration
   - Follow best practices for optimal results

---

## CI/CD Integration

41. **Headless**
   - Headless test execution
   - Implement proper headless test execution
   - Follow best practices for optimal results

42. **Parallel**
   - Parallel test running
   - Implement proper parallel test running
   - Follow best practices for optimal results

43. **Test**
   - Test result reporting
   - Implement proper test result reporting
   - Follow best practices for optimal results

44. **Failed**
   - Failed test retry mechanisms
   - Implement proper failed test retry mechanisms
   - Follow best practices for optimal results

45. **Artifact**
   - Artifact collection and storage
   - Implement proper artifact collection and storage
   - Follow best practices for optimal results

---

## Performance Testing

46. **Page**
   - Page load time monitoring
   - Implement proper page load time monitoring
   - Follow best practices for optimal results

47. **Network**
   - Network performance analysis
   - Implement proper network performance analysis
   - Follow best practices for optimal results

48. **Resource**
   - Resource loading verification
   - Implement proper resource loading verification
   - Follow best practices for optimal results

49. **Performance**
   - Performance budget enforcement
   - Implement proper performance budget enforcement
   - Follow best practices for optimal results

50. **Core**
   - Core Web Vitals testing
   - Implement proper core web vitals testing
   - Follow best practices for optimal results

---

## Configuration

51. **Cypress**
   - Cypress configuration files
   - Implement proper cypress configuration files
   - Follow best practices for optimal results

52. **Environment**
   - Environment variable management
   - Implement proper environment variable management
   - Follow best practices for optimal results

53. **Plugin**
   - Plugin system utilization
   - Implement proper plugin system utilization
   - Follow best practices for optimal results

54. **Browser**
   - Browser selection and settings
   - Implement proper browser selection and settings
   - Follow best practices for optimal results

55. **Test**
   - Test file organization
   - Implement proper test file organization
   - Follow best practices for optimal results

---

## Best Practices

56. **Test**
   - Test stability and reliability
   - Implement proper test stability and reliability
   - Follow best practices for optimal results

57. **Avoiding**
   - Avoiding test flakiness
   - Implement proper avoiding test flakiness
   - Follow best practices for optimal results

58. **Proper**
   - Proper wait strategies
   - Implement proper proper wait strategies
   - Follow best practices for optimal results

59. **Test**
   - Test data isolation
   - Implement proper test data isolation
   - Follow best practices for optimal results

60. **Error**
   - Error handling and recovery
   - Implement proper error handling and recovery
   - Follow best practices for optimal results

---

## Real-world Testing

61. **User**
   - User journey testing
   - Implement proper user journey testing
   - Follow best practices for optimal results

62. **Critical**
   - Critical path validation
   - Implement proper critical path validation
   - Follow best practices for optimal results

63. **Cross-browser**
   - Cross-browser compatibility
   - Implement proper cross-browser compatibility
   - Follow best practices for optimal results

64. **Responsive**
   - Responsive design testing
   - Implement proper responsive design testing
   - Follow best practices for optimal results

65. **Integration**
   - Integration with external services
   - Implement proper integration with external services
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

Follow these comprehensive guidelines for successful testing cypress implementation.`,
	categories: ["testing", "cypress", "e2e", "automation"],
	tags: ["cypress", "e2e-testing", "automation", "web-testing", "ui-testing"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
