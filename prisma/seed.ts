import { PrismaClient } from '@prisma/client'
import { slugify } from '../lib/utils'

const prisma = new PrismaClient()

// Helper function to generate random numbers
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

async function main() {
  console.log('🌱 Starting comprehensive seed...')

  // Create extensive categories
  const categoryData = [
    { name: 'React', description: 'Rules for React development and components', icon: 'Code' },
    { name: 'TypeScript', description: 'TypeScript specific rules and configurations', icon: 'FileCode' },
    { name: 'Node.js', description: 'Backend development with Node.js', icon: 'Server' },
    { name: 'Frontend', description: 'Frontend development best practices', icon: 'Monitor' },
    { name: 'Testing', description: 'Testing frameworks and methodologies', icon: 'TestTube' },
    { name: 'DevOps', description: 'DevOps, CI/CD, and deployment rules', icon: 'Cloud' },
    { name: 'Database', description: 'Database design and optimization', icon: 'Database' },
    { name: 'Security', description: 'Security best practices and guidelines', icon: 'Shield' },
    { name: 'Performance', description: 'Performance optimization techniques', icon: 'Zap' },
    { name: 'Mobile', description: 'Mobile development for iOS and Android', icon: 'Smartphone' },
    { name: 'Python', description: 'Python development and frameworks', icon: 'FileText' },
    { name: 'JavaScript', description: 'Modern JavaScript and ES6+', icon: 'Code2' },
    { name: 'CSS/SCSS', description: 'Styling with CSS, SASS, and frameworks', icon: 'Palette' },
    { name: 'Vue.js', description: 'Vue.js framework and ecosystem', icon: 'Code' },
    { name: 'Angular', description: 'Angular framework development', icon: 'Code' },
    { name: 'Next.js', description: 'Next.js full-stack development', icon: 'FileText' },
    { name: 'GraphQL', description: 'GraphQL API development', icon: 'Share2' },
    { name: 'REST API', description: 'RESTful API design and development', icon: 'Link' },
    { name: 'Docker', description: 'Containerization with Docker', icon: 'Package' },
    { name: 'AWS', description: 'Amazon Web Services cloud development', icon: 'Cloud' },
    { name: 'Machine Learning', description: 'ML and AI development rules', icon: 'Brain' },
    { name: 'Data Science', description: 'Data analysis and visualization', icon: 'BarChart' },
    { name: 'Game Development', description: 'Game development with various engines', icon: 'Gamepad2' },
    { name: 'Blockchain', description: 'Blockchain and cryptocurrency development', icon: 'Link2' },
    { name: 'Microservices', description: 'Microservices architecture patterns', icon: 'Grid3x3' },
    { name: 'Rust', description: 'Systems programming with Rust', icon: 'Code' },
    { name: 'Go', description: 'Go language development', icon: 'FileCode' },
    { name: 'Java', description: 'Java enterprise development', icon: 'Coffee' },
    { name: 'C#/.NET', description: '.NET and C# development', icon: 'Code' },
    { name: 'Swift', description: 'iOS development with Swift', icon: 'Smartphone' },
    { name: 'Kotlin', description: 'Android development with Kotlin', icon: 'Smartphone' },
    { name: 'Accessibility', description: 'Web accessibility guidelines', icon: 'Eye' },
    { name: 'SEO', description: 'Search engine optimization', icon: 'Search' },
    { name: 'UX/UI', description: 'User experience and interface design', icon: 'Palette' },
    { name: 'Git/Version Control', description: 'Version control best practices', icon: 'GitBranch' },
  ]

  const categories = []
  for (const catData of categoryData) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(catData.name) },
      update: {},
      create: {
        name: catData.name,
        slug: slugify(catData.name),
        description: catData.description,
        icon: catData.icon,
      },
    })
    categories.push(category)
  }

  console.log(`✅ Created ${categories.length} categories`)

  // Generate comprehensive rule templates
  const ruleTemplates = [
    'Best Practices for {}',
    '{} Development Guidelines',
    'Advanced {} Techniques',
    '{} Code Quality Standards',
    '{} Performance Optimization',
    '{} Security Guidelines',
    '{} Testing Strategies',
    '{} Architecture Patterns',
    '{} Style Guide',
    '{} Project Setup',
    'Modern {} Development',
    '{} Debugging Techniques',
    '{} Error Handling',
    '{} Configuration Guide',
    '{} Deployment Strategies',
    'Enterprise {} Development',
    '{} Clean Code Principles',
    '{} Design Patterns',
    '{} Performance Monitoring',
    '{} Code Review Guidelines',
    '{} Documentation Standards',
    '{} Refactoring Techniques',
    '{} Memory Management',
    '{} API Integration',
    '{} State Management',
    '{} Component Design',
    '{} Data Validation',
    '{} Authentication Methods',
    '{} Caching Strategies',
    '{} Error Recovery',
  ]

  const contentTemplates = [
    `You are an expert in {}. Follow these comprehensive guidelines:

Core Principles:
- Write clean, maintainable code
- Follow industry best practices
- Implement proper error handling
- Use consistent naming conventions
- Document your code thoroughly

Architecture:
- Follow SOLID principles
- Implement separation of concerns
- Use appropriate design patterns
- Consider scalability from the start
- Plan for testing and debugging

Performance:
- Optimize for speed and efficiency
- Monitor resource usage
- Implement caching where appropriate
- Use lazy loading techniques
- Profile and benchmark regularly

Security:
- Validate all inputs
- Implement proper authentication
- Use secure communication protocols
- Follow the principle of least privilege
- Keep dependencies updated

Best Practices:
- Use version control effectively
- Write comprehensive tests
- Implement CI/CD pipelines
- Monitor application health
- Plan for disaster recovery`,

    `Advanced {} development guide for professional developers:

Development Workflow:
- Set up proper development environment
- Use linting and formatting tools
- Implement pre-commit hooks
- Follow git flow branching strategy
- Use issue tracking effectively

Code Quality:
- Maintain high test coverage
- Use static analysis tools
- Implement code reviews
- Follow coding standards
- Refactor regularly

Deployment:
- Use containerization
- Implement blue-green deployments
- Set up monitoring and alerting
- Use infrastructure as code
- Plan for rollback scenarios

Monitoring:
- Implement comprehensive logging
- Set up performance metrics
- Use error tracking tools
- Monitor user experience
- Track business metrics

Maintenance:
- Keep dependencies updated
- Monitor security vulnerabilities
- Plan for capacity scaling
- Implement backup strategies
- Document operational procedures`,

    `{} expert guidelines for building robust applications:

Foundation:
- Choose appropriate frameworks
- Set up project structure
- Configure development tools
- Establish coding conventions
- Plan the architecture

Implementation:
- Write modular code
- Implement proper abstractions
- Use dependency injection
- Handle edge cases
- Optimize critical paths

Testing:
- Write unit tests
- Implement integration tests
- Use end-to-end testing
- Test error scenarios
- Mock external dependencies

Deployment:
- Automate build processes
- Use environment-specific configs
- Implement health checks
- Set up log aggregation
- Monitor application metrics

Optimization:
- Profile performance bottlenecks
- Optimize database queries
- Implement efficient algorithms
- Use appropriate data structures
- Cache frequently accessed data`,
  ]

  console.log('🚀 Generating comprehensive rules...')
  let totalRulesCreated = 0

  // Generate 25-35 rules per category to ensure good scroll testing
  for (const category of categories) {
    const rulesPerCategory = randomBetween(25, 35)

    for (let i = 0; i < rulesPerCategory; i++) {
      const template = ruleTemplates[randomBetween(0, ruleTemplates.length - 1)]
      const title = template.replace('{}', category.name)
      const slug = slugify(title)

      // Check if rule already exists
      const existingRule = await prisma.rule.findUnique({
        where: { slug }
      })

      if (!existingRule) {
        const contentTemplate = contentTemplates[randomBetween(0, contentTemplates.length - 1)]
        const content = contentTemplate.replace(/{}/g, category.name)

        await prisma.rule.create({
          data: {
            title,
            slug,
            description: `Comprehensive ${category.name.toLowerCase()} guidelines covering best practices, patterns, and professional development standards.`,
            content,
            categoryId: category.id,
            isPublished: true,
            viewCount: randomBetween(50, 500),
            copyCount: randomBetween(10, 150),
            upvotes: randomBetween(5, 80),
            downvotes: randomBetween(0, 15),
          },
        })
        totalRulesCreated++
      }
    }
    console.log(`✅ Generated rules for ${category.name} (${rulesPerCategory} rules)`)
  }

  console.log(`🎉 Seed completed successfully!`)
  console.log(`📊 Summary:`)
  console.log(`   - Categories: ${categories.length}`)
  console.log(`   - New Rules: ${totalRulesCreated}`)
  console.log(`   - Total estimated rules: ${categories.length * 30} (avg 30 per category)`)
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })