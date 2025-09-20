import { PrismaClient } from '@prisma/client'
import { slugify } from '../lib/utils'

const prisma = new PrismaClient()

const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

async function seedMultiCategoryRules() {
  console.log('🌱 Seeding rules with multiple categories...')

  // Get all existing categories
  const categories = await prisma.category.findMany()
  console.log(`Found ${categories.length} categories`)

  if (categories.length < 2) {
    console.log('Need at least 2 categories to create multi-category rules')
    return
  }

  const multiCategoryRules = [
    {
      title: 'Full-Stack React TypeScript App Setup',
      description: 'Complete setup guide for a React TypeScript application with best practices',
      content: `You are an expert in React, TypeScript, Node.js, and full-stack development.

Project Setup:
- Create a new React app with TypeScript template
- Set up Express.js backend with TypeScript
- Configure proper project structure for full-stack development
- Use Vite for fast development builds

Frontend (React + TypeScript):
- Use functional components with proper TypeScript interfaces
- Implement React hooks for state management
- Set up React Router for navigation
- Configure Tailwind CSS for styling

Backend (Node.js + TypeScript):
- Set up Express.js with TypeScript
- Implement proper middleware for security
- Configure CORS for frontend communication
- Set up proper error handling

Development Workflow:
- Use concurrent development servers
- Set up hot reloading for both frontend and backend
- Configure linting and formatting
- Implement proper build processes`,
      categoryNames: ['React', 'TypeScript', 'Node.js']
    },
    {
      title: 'Mobile-First CSS Framework Setup',
      description: 'Responsive design system setup with modern CSS frameworks',
      content: `You are an expert in CSS, responsive design, and mobile development.

Framework Setup:
- Configure Tailwind CSS for mobile-first design
- Set up CSS Grid and Flexbox layouts
- Implement proper breakpoint system
- Configure design tokens and variables

Mobile Optimization:
- Design for touch interfaces
- Implement proper viewport settings
- Optimize for different screen densities
- Configure performance optimizations

Cross-Platform Considerations:
- Test on iOS and Android browsers
- Handle platform-specific styling
- Implement progressive enhancement
- Configure proper font loading`,
      categoryNames: ['CSS/SCSS', 'Frontend', 'Mobile']
    },
    {
      title: 'DevOps CI/CD Pipeline with Testing',
      description: 'Complete CI/CD setup with automated testing and deployment',
      content: `You are an expert in DevOps, CI/CD, testing, and deployment strategies.

Pipeline Setup:
- Configure GitHub Actions or GitLab CI
- Set up automated testing stages
- Implement proper branching strategies
- Configure environment-specific deployments

Testing Integration:
- Run unit tests on every commit
- Configure integration testing
- Set up end-to-end testing
- Implement code coverage reporting

Deployment Strategy:
- Configure staging and production environments
- Implement blue-green deployments
- Set up monitoring and alerting
- Configure rollback strategies

Security:
- Implement security scanning
- Configure secret management
- Set up dependency vulnerability checks
- Implement proper access controls`,
      categoryNames: ['DevOps', 'Testing', 'Security']
    },
    {
      title: 'Python Data Science with Performance Optimization',
      description: 'Data science workflow with Python performance optimization techniques',
      content: `You are an expert in Python, data science, and performance optimization.

Data Science Setup:
- Configure Jupyter notebooks for analysis
- Set up pandas and numpy for data manipulation
- Implement matplotlib and seaborn for visualization
- Configure scikit-learn for machine learning

Performance Optimization:
- Use vectorized operations with numpy
- Implement efficient data structures
- Configure multiprocessing for parallel computation
- Use caching for expensive operations

Memory Management:
- Profile memory usage with memory_profiler
- Implement proper data chunking
- Use generators for large datasets
- Configure garbage collection optimization

Best Practices:
- Write efficient pandas operations
- Use proper indexing strategies
- Implement data validation
- Configure reproducible experiments`,
      categoryNames: ['Python', 'Performance', 'Data Science']
    },
    {
      title: 'Secure JavaScript API Development',
      description: 'Building secure APIs with JavaScript/Node.js and security best practices',
      content: `You are an expert in JavaScript, Node.js, API development, and security.

API Development:
- Set up Express.js with proper middleware
- Implement RESTful API patterns
- Configure proper routing and validation
- Set up error handling and logging

Security Implementation:
- Implement JWT authentication
- Configure rate limiting and CORS
- Set up input validation and sanitization
- Implement proper session management

Performance & Security:
- Configure caching strategies
- Implement API versioning
- Set up monitoring and analytics
- Configure security headers

Best Practices:
- Use environment variables for configuration
- Implement proper error responses
- Set up comprehensive testing
- Configure deployment security`,
      categoryNames: ['JavaScript', 'Node.js', 'Security']
    }
  ]

  for (const ruleData of multiCategoryRules) {
    const slug = slugify(ruleData.title)

    // Check if rule already exists
    const existingRule = await prisma.rule.findUnique({
      where: { slug }
    })

    if (!existingRule) {
      // Create the rule
      const rule = await prisma.rule.create({
        data: {
          title: ruleData.title,
          slug,
          description: ruleData.description,
          content: ruleData.content,
          isPublished: true,
          viewCount: randomBetween(100, 500),
          copyCount: randomBetween(25, 150),
          upvotes: randomBetween(15, 80),
          downvotes: randomBetween(0, 10),
        },
      })

      // Connect to multiple categories
      for (const categoryName of ruleData.categoryNames) {
        const category = categories.find(c => c.name === categoryName)
        if (category) {
          await prisma.ruleCategory.create({
            data: {
              ruleId: rule.id,
              categoryId: category.id
            }
          })
          console.log(`✅ Connected "${rule.title}" to "${category.name}"`)
        }
      }

      console.log(`📝 Created multi-category rule: ${rule.title}`)
    } else {
      console.log(`⚠️ Rule already exists: ${ruleData.title}`)
    }
  }

  console.log('🎉 Multi-category rules seeded successfully!')
}

seedMultiCategoryRules()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })