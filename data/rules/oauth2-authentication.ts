import { Rule } from "../types";

export const rule: Rule = {
	id: "oauth2-authentication",
	slug: "oauth2-authentication",
	title: "OAuth 2.0 Authentication & Authorization",
	description: "Implement secure OAuth 2.0 authentication flows for web and mobile applications",
	content: `You are an expert in OAuth 2.0 authentication and authorization protocols for secure API access.

OAuth 2.0 Fundamentals:
- Authorization vs authentication concepts
- OAuth 2.0 roles and participants
- Grant types and flow selection
- Access tokens and refresh tokens
- Scope-based authorization

Authorization Code Flow:
- Server-side web application flow
- Authorization request and response
- Token exchange process
- PKCE (Proof Key for Code Exchange)
- State parameter for CSRF protection

Client Credentials Flow:
- Machine-to-machine authentication
- Service-to-service communication
- Client authentication methods
- Scope management for services
- Token lifecycle management

Implicit Flow:
- Single-page application authentication
- Fragment-based token delivery
- Security considerations and deprecation
- Migration to authorization code + PKCE
- Token handling in JavaScript

Resource Owner Password Flow:
- Direct credential authentication
- Use cases and security implications
- Migration strategies
- Legacy system integration
- Security recommendations

Token Management:
- JWT vs reference tokens
- Token validation and verification
- Refresh token rotation
- Token revocation implementation
- Token introspection endpoints

Security Best Practices:
- HTTPS enforcement
- State parameter validation
- Redirect URI validation
- Token storage security
- XSS and CSRF protection

OpenID Connect Integration:
- Identity layer on OAuth 2.0
- ID tokens and user information
- Discovery and metadata endpoints
- Claims and scopes
- Session management

Provider Implementation:
- Authorization server development
- Client registration and management
- Custom grant type implementation
- Rate limiting and throttling
- Audit logging and monitoring

Client Integration:
- OAuth client library usage
- Token acquisition and refresh
- API request authentication
- Error handling and recovery
- User experience optimization

Mobile Implementation:
- Native mobile app flows
- Deep linking and custom schemes
- App-to-app authentication
- Biometric integration
- Secure token storage

Single Sign-On (SSO):
- Federation with identity providers
- SAML to OAuth integration
- Corporate identity integration
- Multi-tenant considerations
- Session lifecycle management

API Security:
- Bearer token authentication
- Scope-based access control
- Rate limiting per client
- API versioning considerations
- Security monitoring

Testing Strategies:
- OAuth flow testing
- Token validation testing
- Security testing methodologies
- Integration testing
- Performance testing

Production Deployment:
- Scaling authorization servers
- High availability setup
- Monitoring and alerting
- Backup and recovery
- Performance optimization

Compliance & Standards:
- OAuth 2.1 specification updates
- Security BCP recommendations
- Industry compliance requirements
- Privacy considerations
- Audit and reporting`,
	categories: ["oauth2", "authentication", "security", "api"],
	tags: ["oauth2", "authentication", "authorization", "security", "api-security"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "files",
	globs: "*.js,*.ts,*.py,*.java,*.cs,*.go,*.php",
};
