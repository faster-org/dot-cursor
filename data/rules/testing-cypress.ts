import { Rule } from "../types";

export const rule: Rule = {
	id: "testing-cypress",
	slug: "testing-cypress",
	title: "Cypress E2E Testing",
	description: "End-to-end testing with Cypress for web applications and user journey validation",
	content: `You are an expert in Cypress end-to-end testing for web applications and user workflows.

Cypress Fundamentals:
- Test structure with describe() and it() blocks
- Cypress commands and chaining
- Browser automation and interaction
- Real browser testing environment
- Time-travel debugging capabilities

Element Interaction:
- Element selection with cy.get() and selectors
- User interactions (click, type, select)
- Form submission and validation
- File upload testing
- Drag and drop operations

Assertions & Verification:
- Built-in assertions with should()
- Custom assertion commands
- Element visibility and state checking
- Text content verification
- Attribute and property assertions

Navigation & Routing:
- Page navigation with cy.visit()
- URL verification and manipulation
- Browser back/forward testing
- Hash and query parameter handling
- Single-page application routing

Network Testing:
- API request interception with cy.intercept()
- Response mocking and stubbing
- Network delay simulation
- API response validation
- Authentication token handling

Data Management:
- Test data setup and teardown
- Database seeding and cleanup
- Environment-specific test data
- Dynamic data generation
- Test isolation strategies

Page Object Model:
- Organizing tests with page objects
- Reusable command creation
- Custom command implementation
- Test utility functions
- Maintainable test structure

Advanced Features:
- Screenshot and video recording
- Visual regression testing
- Cross-browser testing
- Mobile viewport testing
- Accessibility testing integration

CI/CD Integration:
- Headless test execution
- Parallel test running
- Test result reporting
- Failed test retry mechanisms
- Artifact collection and storage

Performance Testing:
- Page load time monitoring
- Network performance analysis
- Resource loading verification
- Performance budget enforcement
- Core Web Vitals testing

Configuration:
- Cypress configuration files
- Environment variable management
- Plugin system utilization
- Browser selection and settings
- Test file organization

Best Practices:
- Test stability and reliability
- Avoiding test flakiness
- Proper wait strategies
- Test data isolation
- Error handling and recovery

Real-world Testing:
- User journey testing
- Critical path validation
- Cross-browser compatibility
- Responsive design testing
- Integration with external services`,
	categories: ["testing", "cypress", "e2e", "automation"],
	tags: ["cypress", "e2e-testing", "automation", "web-testing", "ui-testing"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "files",
	globs: "*.cy.js,*.cy.ts,cypress.config.js,cypress.json",
};
