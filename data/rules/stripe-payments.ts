import { Rule } from '../types';

export const rule: Rule = {
	id: 'stripe-payments',
	slug: 'stripe-payments',
	title: 'Stripe Payment Integration',
	description: 'Implement secure payment processing with Stripe API and payment flows',
	content: `You are an expert in Stripe payment integration for e-commerce and subscription-based applications.

Stripe Fundamentals:
- Payment processing concepts
- API keys and authentication
- Webhook event handling
- Test vs live environment setup
- SDK integration across platforms

Payment Flows:
- One-time payment processing
- Subscription billing setup
- Multi-party payments (Connect)
- Payment intents and confirmation
- 3D Secure authentication

Frontend Integration:
- Stripe Elements for secure forms
- Payment methods collection
- Card tokenization and security
- Apple Pay and Google Pay
- Mobile payment UI patterns

Backend Implementation:
- Payment intent creation
- Webhook endpoint handling
- Customer and payment method management
- Subscription lifecycle management
- Refund and dispute handling

Security Best Practices:
- PCI compliance requirements
- Secure token handling
- Webhook signature verification
- Environment variable management
- Error handling and logging

Subscription Management:
- Recurring billing setup
- Plan and pricing configuration
- Trial periods and promotions
- Usage-based billing
- Subscription modifications

Multi-party Payments:
- Stripe Connect platform setup
- Marketplace payment flows
- Split payments and fees
- Onboarding connected accounts
- Transfer and payout management

International Payments:
- Multi-currency support
- Local payment methods
- Tax calculation integration
- Regulatory compliance
- Exchange rate handling

Testing Strategies:
- Test card numbers usage
- Webhook testing with CLI
- Payment flow simulation
- Error scenario testing
- Integration testing

Analytics & Reporting:
- Revenue analytics dashboard
- Payment success rate monitoring
- Customer lifetime value tracking
- Churn analysis and reporting
- Financial reconciliation

Advanced Features:
- Payment links generation
- Checkout session creation
- Invoice and billing portal
- Payment method updates
- Automatic tax calculation

Error Handling:
- Payment failure scenarios
- Declined card handling
- Network error recovery
- User-friendly error messages
- Retry mechanisms

Mobile Integration:
- React Native Stripe SDK
- Flutter Stripe plugin
- Native iOS and Android SDKs
- Mobile wallet integration
- Biometric authentication

Compliance & Regulations:
- PCI DSS compliance
- GDPR data protection
- SCA (Strong Customer Authentication)
- Regional payment regulations
- Financial reporting requirements

Performance Optimization:
- Payment processing speed
- Webhook processing efficiency
- Database query optimization
- Caching strategies
- Load balancing considerations

Production Deployment:
- Environment configuration
- Monitoring and alerting
- Backup and recovery
- Scaling considerations
- Support and maintenance`,
	categories: ['stripe', 'payments', 'e-commerce', 'fintech'],
	tags: ['stripe', 'payments', 'e-commerce', 'subscriptions', 'checkout'],
	author: 'Community',
	createdAt: '2024-01-30T00:00:00Z',
	applicationMode: 'files',
	globs: '*.js,*.ts,*.py,*.php,*.rb,package.json'
};