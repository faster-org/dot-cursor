import { Rule } from "../types";

export const rule: Rule = {
	id: "testing-jest",
	slug: "testing-jest",
	title: "Jest Testing Framework",
	description: "Comprehensive testing with Jest including unit tests, mocking, and code coverage",
	content: `# Testing Jest

This document provides comprehensive guidelines for testing jest development and best practices.

---

## Jest Fundamentals

1. **Test**
   - Test file organization and naming conventions
   - Implement proper test file organization and naming conventions
   - Follow best practices for optimal results

2. **describe()**
   - describe() blocks for test grouping
   - Implement proper describe() blocks for test grouping
   - Follow best practices for optimal results

3. **test()**
   - test() and it() functions for individual tests
   - Implement proper test() and it() functions for individual tests
   - Follow best practices for optimal results

4. **Setup**
   - Setup and teardown with beforeEach/afterEach
   - Implement proper setup and teardown with beforeeach/aftereach
   - Follow best practices for optimal results

5. **Global**
   - Global setup with beforeAll/afterAll
   - Implement proper global setup with beforeall/afterall
   - Follow best practices for optimal results

---

## Assertion & Matchers

6. **Basic**
   - Basic matchers (toBe, toEqual, toBeNull)
   - Implement proper basic matchers (tobe, toequal, tobenull)
   - Follow best practices for optimal results

7. **Truthiness**
   - Truthiness matchers (toBeTruthy, toBeFalsy)
   - Implement proper truthiness matchers (tobetruthy, tobefalsy)
   - Follow best practices for optimal results

8. **Number**
   - Number matchers (toBeGreaterThan, toBeCloseTo)
   - Implement proper number matchers (tobegreaterthan, tobecloseto)
   - Follow best practices for optimal results

9. **String**
   - String matchers (toMatch, toContain)
   - Implement proper string matchers (tomatch, tocontain)
   - Follow best practices for optimal results

10. **Array**
   - Array and object matchers (toContain, toHaveProperty)
   - Implement proper array and object matchers (tocontain, tohaveproperty)
   - Follow best practices for optimal results

---

## Asynchronous Testing

11. **Testing**
   - Testing promises with async/await
   - Implement proper testing promises with async/await
   - Follow best practices for optimal results

12. **Testing**
   - Testing callbacks with done parameter
   - Implement proper testing callbacks with done parameter
   - Follow best practices for optimal results

13. **Testing**
   - Testing rejected promises
   - Implement proper testing rejected promises
   - Follow best practices for optimal results

14. **Timeout**
   - Timeout configuration for long-running tests
   - Implement proper timeout configuration for long-running tests
   - Follow best practices for optimal results

15. **Testing**
   - Testing timers with fake timers
   - Implement proper testing timers with fake timers
   - Follow best practices for optimal results

---

## Mocking & Spies

16. **Function**
   - Function mocking with jest.fn()
   - Implement proper function mocking with jest.fn()
   - Follow best practices for optimal results

17. **Module**
   - Module mocking with jest.mock()
   - Implement proper module mocking with jest.mock()
   - Follow best practices for optimal results

18. **Partial**
   - Partial mocking with jest.requireActual()
   - Implement proper partial mocking with jest.requireactual()
   - Follow best practices for optimal results

19. **Mock**
   - Mock implementations and return values
   - Implement proper mock implementations and return values
   - Follow best practices for optimal results

20. **Spy**
   - Spy functions for behavior verification
   - Implement proper spy functions for behavior verification
   - Follow best practices for optimal results

---

## Testing React Components

21. **Component**
   - Component rendering with React Testing Library
   - Implement proper component rendering with react testing library
   - Follow best practices for optimal results

22. **Event**
   - Event simulation and user interactions
   - Implement proper event simulation and user interactions
   - Follow best practices for optimal results

23. **Querying**
   - Querying elements by role, text, and attributes
   - Implement proper querying elements by role, text, and attributes
   - Follow best practices for optimal results

24. **Testing**
   - Testing custom hooks
   - Implement proper testing custom hooks
   - Follow best practices for optimal results

25. **Snapshot**
   - Snapshot testing for component output
   - Implement proper snapshot testing for component output
   - Follow best practices for optimal results

---

## Mock Data & Fixtures

26. **Creating**
   - Creating test data factories
   - Implement proper creating test data factories
   - Follow best practices for optimal results

27. **Using**
   - Using fixtures for consistent test data
   - Implement proper using fixtures for consistent test data
   - Follow best practices for optimal results

28. **Database**
   - Database seeding for integration tests
   - Implement proper database seeding for integration tests
   - Follow best practices for optimal results

29. **API**
   - API response mocking
   - Implement proper api response mocking
   - Follow best practices for optimal results

30. **File**
   - File system mocking
   - Implement proper file system mocking
   - Follow best practices for optimal results

---

## Code Coverage

31. **Coverage**
   - Coverage reports configuration
   - Implement proper coverage reports configuration
   - Follow best practices for optimal results

32. **Coverage**
   - Coverage thresholds enforcement
   - Implement proper coverage thresholds enforcement
   - Follow best practices for optimal results

33. **Excluding**
   - Excluding files from coverage
   - Implement proper excluding files from coverage
   - Follow best practices for optimal results

34. **Branch**
   - Branch and line coverage analysis
   - Implement proper branch and line coverage analysis
   - Follow best practices for optimal results

35. **CI**
   - CI integration for coverage reporting
   - Implement proper ci integration for coverage reporting
   - Follow best practices for optimal results

---

## Advanced Testing Patterns

36. **Parameterized**
   - Parameterized tests with test.each()
   - Implement proper parameterized tests with test.each()
   - Follow best practices for optimal results

37. **Testing**
   - Testing error boundaries and error cases
   - Implement proper testing error boundaries and error cases
   - Follow best practices for optimal results

38. **Testing**
   - Testing with different environments
   - Implement proper testing with different environments
   - Follow best practices for optimal results

39. **Custom**
   - Custom matchers creation
   - Implement proper custom matchers creation
   - Follow best practices for optimal results

40. **Testing**
   - Testing utilities and helpers
   - Implement proper testing utilities and helpers
   - Follow best practices for optimal results

---

## Performance Testing

41. **Testing**
   - Testing component rendering performance
   - Implement proper testing component rendering performance
   - Follow best practices for optimal results

42. **Memory**
   - Memory leak detection
   - Implement proper memory leak detection
   - Follow best practices for optimal results

43. **Benchmark**
   - Benchmark testing
   - Implement proper benchmark testing
   - Follow best practices for optimal results

44. **Load**
   - Load testing with Jest
   - Implement proper load testing with jest
   - Follow best practices for optimal results

45. **Profiling**
   - Profiling test execution
   - Implement proper profiling test execution
   - Follow best practices for optimal results

---

## Configuration

46. **Jest**
   - Jest configuration in package.json
   - Implement proper jest configuration in package.json
   - Follow best practices for optimal results

47. **Custom**
   - Custom test environments
   - Implement proper custom test environments
   - Follow best practices for optimal results

48. **Module**
   - Module path mapping
   - Implement proper module path mapping
   - Follow best practices for optimal results

49. **Transform**
   - Transform configurations
   - Implement proper transform configurations
   - Follow best practices for optimal results

50. **Test**
   - Test file patterns and ignore patterns
   - Implement proper test file patterns and ignore patterns
   - Follow best practices for optimal results

---

## CI/CD Integration

51. **Running**
   - Running tests in CI pipelines
   - Implement proper running tests in ci pipelines
   - Follow best practices for optimal results

52. **Parallel**
   - Parallel test execution
   - Implement proper parallel test execution
   - Follow best practices for optimal results

53. **Test**
   - Test result reporting
   - Implement proper test result reporting
   - Follow best practices for optimal results

54. **Failed**
   - Failed test retry mechanisms
   - Implement proper failed test retry mechanisms
   - Follow best practices for optimal results

55. **Test**
   - Test artifact collection
   - Implement proper test artifact collection
   - Follow best practices for optimal results

---

## Best Practices

56. **Test**
   - Test isolation and independence
   - Implement proper test isolation and independence
   - Follow best practices for optimal results

57. **Descriptive**
   - Descriptive test names and structure
   - Implement proper descriptive test names and structure
   - Follow best practices for optimal results

58. **Testing**
   - Testing behavior over implementation
   - Implement proper testing behavior over implementation
   - Follow best practices for optimal results

59. **Avoiding**
   - Avoiding test interdependencies
   - Implement proper avoiding test interdependencies
   - Follow best practices for optimal results

60. **Maintaining**
   - Maintaining test performance
   - Implement proper maintaining test performance
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

Follow these comprehensive guidelines for successful testing jest implementation.`,
	categories: ["testing", "jest", "javascript", "unit-testing"],
	tags: ["jest", "testing", "mocking", "code-coverage", "tdd"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
