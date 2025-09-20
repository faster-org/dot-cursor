import { PrismaClient } from '@prisma/client'
import { slugify } from '../lib/utils'

const prisma = new PrismaClient()

const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

async function main() {
  console.log('🌱 Starting simple seed for scroll testing...')

  // Create 15 categories (enough to test scroll-to-load-more)
  const categoryData = [
    { name: 'React', description: 'Rules for React development and components' },
    { name: 'TypeScript', description: 'TypeScript specific rules and configurations' },
    { name: 'Node.js', description: 'Backend development with Node.js' },
    { name: 'Next.js', description: 'Next.js full-stack development' },
    { name: 'Vue.js', description: 'Vue.js framework and ecosystem' },
    { name: 'Angular', description: 'Angular framework development' },
    { name: 'Python', description: 'Python development and frameworks' },
    { name: 'JavaScript', description: 'Modern JavaScript and ES6+' },
    { name: 'CSS/SCSS', description: 'Styling with CSS, SASS, and frameworks' },
    { name: 'Testing', description: 'Testing frameworks and methodologies' },
    { name: 'DevOps', description: 'DevOps, CI/CD, and deployment rules' },
    { name: 'Database', description: 'Database design and optimization' },
    { name: 'Security', description: 'Security best practices and guidelines' },
    { name: 'Performance', description: 'Performance optimization techniques' },
    { name: 'Mobile', description: 'Mobile development for iOS and Android' },
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
      },
    })
    categories.push(category)
  }

  console.log(`✅ Created ${categories.length} categories`)

  // Generate 25 rules per category
  const ruleTemplates = [
    'Best Practices for {}',
    '{} Development Guidelines',
    'Advanced {} Techniques',
    '{} Performance Optimization',
    '{} Security Guidelines',
    '{} Testing Strategies',
    '{} Code Review Guide',
    '{} Project Setup',
    'Modern {} Development',
    '{} Debugging Tips',
    '{} Configuration Guide',
    '{} Style Guide',
    '{} Error Handling',
    '{} API Integration',
    '{} State Management',
    '{} Component Design',
    '{} Build Process',
    '{} Deployment Guide',
    '{} Monitoring Setup',
    '{} Documentation Standards',
    '{} Refactoring Guide',
    '{} Memory Management',
    '{} Data Validation',
    '{} Authentication Guide',
    '{} Caching Strategies',
  ]

  const baseContent = `You are an expert in {}. Follow these guidelines:

Core Principles:
- Write clean, maintainable code
- Follow industry best practices
- Implement proper error handling
- Use consistent naming conventions
- Document your code thoroughly

Best Practices:
- Use version control effectively
- Write comprehensive tests
- Implement proper architecture
- Monitor application health
- Plan for scalability

Performance:
- Optimize for speed and efficiency
- Monitor resource usage
- Implement caching strategies
- Use appropriate algorithms
- Profile performance regularly`

  let totalRules = 0

  for (const category of categories) {
    for (let i = 0; i < 25; i++) {
      const title = ruleTemplates[i].replace('{}', category.name)
      const slug = slugify(title)

      const existingRule = await prisma.rule.findUnique({
        where: { slug }
      })

      if (!existingRule) {
        await prisma.rule.create({
          data: {
            title,
            slug,
            description: `Professional ${category.name.toLowerCase()} guidelines and best practices.`,
            content: baseContent.replace(/{}/g, category.name),
            categoryId: category.id,
            isPublished: true,
            viewCount: randomBetween(50, 300),
            copyCount: randomBetween(10, 100),
            upvotes: randomBetween(5, 50),
            downvotes: randomBetween(0, 10),
          },
        })
        totalRules++
      }
    }
    console.log(`✅ Generated 25 rules for ${category.name}`)
  }

  console.log(`🎉 Seed completed!`)
  console.log(`📊 Total: ${categories.length} categories, ${totalRules} new rules`)
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })