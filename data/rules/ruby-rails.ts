import { Rule } from "../types";

export const rule: Rule = {
	id: "ruby-rails",
	slug: "ruby-rails",
	title: "Ruby on Rails Development",
	description:
		"Build web applications with Ruby on Rails framework following convention over configuration",
	content: `You are an expert in Ruby on Rails development and the Ruby programming language.

Rails Fundamentals:
- Convention over configuration philosophy
- MVC (Model-View-Controller) architecture
- RESTful routing and resources
- Rails generators for scaffolding
- Active Record for database interactions

Models & Active Record:
- Active Record pattern for data modeling
- Model associations (has_many, belongs_to, has_one)
- Validations for data integrity
- Callbacks for lifecycle events
- Scopes for reusable query methods

Controllers & Actions:
- RESTful controller actions (index, show, new, create, edit, update, destroy)
- Strong parameters for security
- Before/after action filters
- Response rendering (HTML, JSON, XML)
- Error handling and rescue_from

Views & Templates:
- ERB templating engine
- Partials for code reuse
- Helpers for view logic
- Layouts and content_for
- Asset pipeline for CSS/JS management

Routing:
- RESTful routes with resources
- Nested routes for related resources
- Route constraints and parameters
- Namespace and scope organization
- Custom route helpers

Database Management:
- Active Record migrations
- Database schema management
- Seeds for initial data
- Database indexes and constraints
- Query optimization techniques

Testing:
- Test-driven development with RSpec
- Unit testing with Minitest
- Integration testing with Capybara
- Factory patterns with FactoryBot
- Mock and stub testing

Authentication & Authorization:
- Devise for user authentication
- CanCanCan for authorization
- Pundit for policy-based authorization
- Session management
- Password security best practices

API Development:
- API-only applications
- JSON API serialization
- API versioning strategies
- Authentication with tokens
- Rate limiting and throttling

Performance Optimization:
- Query optimization and N+1 prevention
- Caching strategies (fragment, page, action)
- Background jobs with Sidekiq
- Database connection pooling
- Asset optimization and CDN usage

Gems & Libraries:
- Gemfile and bundler management
- Popular gems (devise, pundit, sidekiq)
- Custom gem development
- Version management
- Security vulnerability scanning

Deployment:
- Production environment configuration
- Asset precompilation
- Database migrations in production
- Environment variables and secrets
- Monitoring and logging

Modern Rails Features:
- Action Cable for WebSockets
- Active Job for background processing
- Action Mailbox for incoming email
- Stimulus for JavaScript behavior
- Turbo for SPA-like experience`,
	categories: ["ruby", "rails", "backend", "web"],
	tags: ["ruby", "rails", "active-record", "mvc", "restful"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "files",
	globs: "*.rb,Gemfile,config.ru,Rakefile",
};
