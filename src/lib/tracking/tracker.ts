import { z } from 'zod'

export const IssueSeveritySchema = z.enum(['low', 'medium', 'high', 'critical'])
export const IssueCategorySchema = z.enum([
  'generation',
  'build',
  'deploy',
  'runtime',
  'design',
  'ux',
  'security',
  'accessibility',
  'seo',
  'performance',
])

export const IssueSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  severity: IssueSeveritySchema,
  category: IssueCategorySchema,
  location: z.string().optional(), // file or component
  stackTrace: z.string().optional(),
  status: z.enum(['open', 'in_progress', 'resolved', 'ignored']).default('open'),
  timestamp: z.number(),
  fixSuggestion: z.string().optional(),
})

export type Issue = z.infer<typeof IssueSchema>

export class IssueTracker {
  private issues: Issue[] = []

  logIssue(issue: Omit<Issue, 'id' | 'timestamp' | 'status'>): Issue {
    const newIssue: Issue = {
      ...issue,
      id: `ISSUE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: Date.now(),
      status: 'open',
    }
    this.issues.push(newIssue)
    console.log(`[Tracker] Logged ${newIssue.severity} issue: ${newIssue.title}`)
    return newIssue
  }

  getIssues(status?: Issue['status']): Issue[] {
    if (status) return this.issues.filter((i) => i.status === status)
    return this.issues
  }

  resolveIssue(id: string): boolean {
    const issue = this.issues.find((i) => i.id === id)
    if (issue) {
      issue.status = 'resolved'
      return true
    }
    return false
  }

  exportMarkdown(): string {
    return (
      `# Designwave Issue Report\n\n` +
      this.issues
        .map(
          (i) =>
            `## [${i.severity.toUpperCase()}] ${i.id}: ${i.title}\n- **Category**: ${i.category}\n- **Status**: ${i.status}\n- **Description**: ${i.description}\n`,
        )
        .join('\n')
    )
  }
}

export const globalTracker = new IssueTracker()
