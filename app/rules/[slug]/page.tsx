import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Eye, Copy } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { RuleActions } from './rule-actions'

async function getRule(slug: string) {
  const rule = await prisma.rule.findFirst({
    where: {
      OR: [
        { id: slug },
        { slug: slug }
      ],
      isPublished: true
    },
    include: {
      categories: {
        include: {
          category: true
        }
      },
      tags: {
        include: {
          tag: true
        }
      }
    }
  })

  if (!rule) {
    return null
  }

  // Increment view count
  await prisma.rule.update({
    where: { id: rule.id },
    data: {
      viewCount: { increment: 1 }
    }
  })

  return rule
}

export default async function RulePage({ params }: { params: { slug: string } }) {
  const rule = await getRule(params.slug)

  if (!rule) {
    notFound()
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/browse">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{rule.title}</h1>
        <p className="text-lg text-muted-foreground mb-4">{rule.description}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {rule.categories && rule.categories.length > 0 && (
            <div className="flex gap-2">
              {rule.categories.map((ruleCategory: any) => (
                <Link key={ruleCategory.category.id} href={`/browse?category=${ruleCategory.category.slug}`}>
                  <Badge variant="secondary" className="text-sm">
                    {ruleCategory.category.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(rule.createdAt)}</span>
          </div>

          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{rule.viewCount} views</span>
          </div>

          <div className="flex items-center gap-1">
            <Copy className="h-3 w-3" />
            <span>{rule.copyCount} copies</span>
          </div>
        </div>

        {rule.tags && rule.tags.length > 0 && (
          <div className="flex gap-2 mt-4">
            {rule.tags.map((ruleTag: any) => (
              <Badge key={ruleTag.tag.id} variant="outline">
                {ruleTag.tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Rule Content</CardTitle>
            <RuleActions
              ruleId={rule.id}
              content={rule.content}
              initialUpvotes={rule.upvotes}
              initialDownvotes={rule.downvotes}
            />
          </div>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code className="text-sm font-mono">{rule.content}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}