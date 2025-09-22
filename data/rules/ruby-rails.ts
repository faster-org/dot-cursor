import { Rule } from "../types";

export const rule: Rule = {
	id: "ruby-rails",
	slug: "ruby-rails",
	title: "Ruby on Rails Development",
	description:
		"Build web applications with Ruby on Rails framework following convention over configuration",
	content: `# Ruby Rails

This document provides comprehensive guidelines for ruby rails development and best practices.

---

## Rails Fundamentals

1. **Convention**
   - Convention over configuration philosophy
   - Implement proper convention over configuration philosophy
   - Follow best practices for optimal results

2. **MVC**
   - MVC (Model-View-Controller) architecture
   - Implement proper mvc (model-view-controller) architecture
   - Follow best practices for optimal results

3. **RESTful**
   - RESTful routing and resources
   - Implement proper restful routing and resources
   - Follow best practices for optimal results

4. **Rails**
   - Rails generators for scaffolding
   - Implement proper rails generators for scaffolding
   - Follow best practices for optimal results

5. **Active**
   - Active Record for database interactions
   - Implement proper active record for database interactions
   - Follow best practices for optimal results

---

## Models & Active Record

6. **Active**
   - Active Record pattern for data modeling
   - Implement proper active record pattern for data modeling
   - Follow best practices for optimal results

7. **Model**
   - Model associations (has_many, belongs_to, has_one)
   - Implement proper model associations (has_many, belongs_to, has_one)
   - Follow best practices for optimal results

8. **Validations**
   - Validations for data integrity
   - Implement proper validations for data integrity
   - Follow best practices for optimal results

9. **Callbacks**
   - Callbacks for lifecycle events
   - Implement proper callbacks for lifecycle events
   - Follow best practices for optimal results

10. **Scopes**
   - Scopes for reusable query methods
   - Implement proper scopes for reusable query methods
   - Follow best practices for optimal results

---

## Controllers & Actions

11. **RESTful**
   - RESTful controller actions (index, show, new, create, edit, update, destroy)
   - Implement proper restful controller actions (index, show, new, create, edit, update, destroy)
   - Follow best practices for optimal results

12. **Strong**
   - Strong parameters for security
   - Implement proper strong parameters for security
   - Follow best practices for optimal results

13. **Before/after**
   - Before/after action filters
   - Implement proper before/after action filters
   - Follow best practices for optimal results

14. **Response**
   - Response rendering (HTML, JSON, XML)
   - Implement proper response rendering (html, json, xml)
   - Follow best practices for optimal results

15. **Error**
   - Error handling and rescue_from
   - Implement proper error handling and rescue_from
   - Follow best practices for optimal results

---

## Views & Templates

16. **ERB**
   - ERB templating engine
   - Implement proper erb templating engine
   - Follow best practices for optimal results

17. **Partials**
   - Partials for code reuse
   - Implement proper partials for code reuse
   - Follow best practices for optimal results

18. **Helpers**
   - Helpers for view logic
   - Implement proper helpers for view logic
   - Follow best practices for optimal results

19. **Layouts**
   - Layouts and content_for
   - Implement proper layouts and content_for
   - Follow best practices for optimal results

20. **Asset**
   - Asset pipeline for CSS/JS management
   - Implement proper asset pipeline for css/js management
   - Follow best practices for optimal results

---

## Routing

21. **RESTful**
   - RESTful routes with resources
   - Implement proper restful routes with resources
   - Follow best practices for optimal results

22. **Nested**
   - Nested routes for related resources
   - Implement proper nested routes for related resources
   - Follow best practices for optimal results

23. **Route**
   - Route constraints and parameters
   - Implement proper route constraints and parameters
   - Follow best practices for optimal results

24. **Namespace**
   - Namespace and scope organization
   - Implement proper namespace and scope organization
   - Follow best practices for optimal results

25. **Custom**
   - Custom route helpers
   - Implement proper custom route helpers
   - Follow best practices for optimal results

---

## Database Management

26. **Active**
   - Active Record migrations
   - Implement proper active record migrations
   - Follow best practices for optimal results

27. **Database**
   - Database schema management
   - Implement proper database schema management
   - Follow best practices for optimal results

28. **Seeds**
   - Seeds for initial data
   - Implement proper seeds for initial data
   - Follow best practices for optimal results

29. **Database**
   - Database indexes and constraints
   - Implement proper database indexes and constraints
   - Follow best practices for optimal results

30. **Query**
   - Query optimization techniques
   - Implement proper query optimization techniques
   - Follow best practices for optimal results

---

## Testing

31. **Test-driven**
   - Test-driven development with RSpec
   - Implement proper test-driven development with rspec
   - Follow best practices for optimal results

32. **Unit**
   - Unit testing with Minitest
   - Implement proper unit testing with minitest
   - Follow best practices for optimal results

33. **Integration**
   - Integration testing with Capybara
   - Implement proper integration testing with capybara
   - Follow best practices for optimal results

34. **Factory**
   - Factory patterns with FactoryBot
   - Implement proper factory patterns with factorybot
   - Follow best practices for optimal results

35. **Mock**
   - Mock and stub testing
   - Implement proper mock and stub testing
   - Follow best practices for optimal results

---

## Authentication & Authorization

36. **Devise**
   - Devise for user authentication
   - Implement proper devise for user authentication
   - Follow best practices for optimal results

37. **CanCanCan**
   - CanCanCan for authorization
   - Implement proper cancancan for authorization
   - Follow best practices for optimal results

38. **Pundit**
   - Pundit for policy-based authorization
   - Implement proper pundit for policy-based authorization
   - Follow best practices for optimal results

39. **Session**
   - Session management
   - Implement proper session management
   - Follow best practices for optimal results

40. **Password**
   - Password security best practices
   - Implement proper password security best practices
   - Follow best practices for optimal results

---

## API Development

41. **API-only**
   - API-only applications
   - Implement proper api-only applications
   - Follow best practices for optimal results

42. **JSON**
   - JSON API serialization
   - Implement proper json api serialization
   - Follow best practices for optimal results

43. **API**
   - API versioning strategies
   - Implement proper api versioning strategies
   - Follow best practices for optimal results

44. **Authentication**
   - Authentication with tokens
   - Implement proper authentication with tokens
   - Follow best practices for optimal results

45. **Rate**
   - Rate limiting and throttling
   - Implement proper rate limiting and throttling
   - Follow best practices for optimal results

---

## Performance Optimization

46. **Query**
   - Query optimization and N+1 prevention
   - Implement proper query optimization and n+1 prevention
   - Follow best practices for optimal results

47. **Caching**
   - Caching strategies (fragment, page, action)
   - Implement proper caching strategies (fragment, page, action)
   - Follow best practices for optimal results

48. **Background**
   - Background jobs with Sidekiq
   - Implement proper background jobs with sidekiq
   - Follow best practices for optimal results

49. **Database**
   - Database connection pooling
   - Implement proper database connection pooling
   - Follow best practices for optimal results

50. **Asset**
   - Asset optimization and CDN usage
   - Implement proper asset optimization and cdn usage
   - Follow best practices for optimal results

---

## Gems & Libraries

51. **Gemfile**
   - Gemfile and bundler management
   - Implement proper gemfile and bundler management
   - Follow best practices for optimal results

52. **Popular**
   - Popular gems (devise, pundit, sidekiq)
   - Implement proper popular gems (devise, pundit, sidekiq)
   - Follow best practices for optimal results

53. **Custom**
   - Custom gem development
   - Implement proper custom gem development
   - Follow best practices for optimal results

54. **Version**
   - Version management
   - Implement proper version management
   - Follow best practices for optimal results

55. **Security**
   - Security vulnerability scanning
   - Implement proper security vulnerability scanning
   - Follow best practices for optimal results

---

## Deployment

56. **Production**
   - Production environment configuration
   - Implement proper production environment configuration
   - Follow best practices for optimal results

57. **Asset**
   - Asset precompilation
   - Implement proper asset precompilation
   - Follow best practices for optimal results

58. **Database**
   - Database migrations in production
   - Implement proper database migrations in production
   - Follow best practices for optimal results

59. **Environment**
   - Environment variables and secrets
   - Implement proper environment variables and secrets
   - Follow best practices for optimal results

60. **Monitoring**
   - Monitoring and logging
   - Implement proper monitoring and logging
   - Follow best practices for optimal results

---

## Modern Rails Features

61. **Action**
   - Action Cable for WebSockets
   - Implement proper action cable for websockets
   - Follow best practices for optimal results

62. **Active**
   - Active Job for background processing
   - Implement proper active job for background processing
   - Follow best practices for optimal results

63. **Action**
   - Action Mailbox for incoming email
   - Implement proper action mailbox for incoming email
   - Follow best practices for optimal results

64. **Stimulus**
   - Stimulus for JavaScript behavior
   - Implement proper stimulus for javascript behavior
   - Follow best practices for optimal results

65. **Turbo**
   - Turbo for SPA-like experience
   - Implement proper turbo for spa-like experience
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

Follow these comprehensive guidelines for successful ruby rails implementation.`,
	categories: ["ruby", "rails", "backend", "web"],
	tags: ["ruby", "rails", "active-record", "mvc", "restful"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
