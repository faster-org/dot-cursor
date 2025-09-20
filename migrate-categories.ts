import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateCategoryData() {
  console.log('🔄 Migrating existing category relationships...')

  // Get all rules with their current category
  const rules = await prisma.rule.findMany({
    where: {
      categoryId: {
        not: null
      }
    },
    select: {
      id: true,
      categoryId: true
    }
  })

  console.log(`Found ${rules.length} rules with categories to migrate`)

  // Create RuleCategory entries for existing relationships
  for (const rule of rules) {
    if (rule.categoryId) {
      try {
        await prisma.ruleCategory.create({
          data: {
            ruleId: rule.id,
            categoryId: rule.categoryId
          }
        })
        console.log(`✅ Migrated rule ${rule.id}`)
      } catch (error) {
        console.log(`⚠️ Rule ${rule.id} already migrated or error:`, error)
      }
    }
  }

  console.log('✨ Migration completed!')
}

migrateCategoryData()
  .catch((e) => {
    console.error('Migration error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })