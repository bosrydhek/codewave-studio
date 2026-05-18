import { z } from 'zod'

export const ChangelogEntrySchema = z.object({
  id: z.string(),
  action: z.string(),
  status: z.enum(['success', 'failure', 'pending']),
  timestamp: z.number(),
  metadata: z.record(z.any()).optional(),
  description: z.string(),
  gitCommitHash: z.string().optional(),
})

export type ChangelogEntry = z.infer<typeof ChangelogEntrySchema>

export class ChangelogManager {
  private entries: ChangelogEntry[] = []

  logAction(entry: Omit<ChangelogEntry, 'id' | 'timestamp'>): ChangelogEntry {
    const newEntry: ChangelogEntry = {
      ...entry,
      id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: Date.now(),
    }
    this.entries.push(newEntry)
    console.log(`[Changelog] ${newEntry.action}: ${newEntry.status}`)
    return newEntry
  }

  getEntries(): ChangelogEntry[] {
    return this.entries
  }

  exportMarkdown(): string {
    return (
      `# Designwave Project Changelog\n\n` +
      this.entries
        .map(
          (e) =>
            `### [${new Date(e.timestamp).toISOString()}] ${e.action}\n- **Status**: ${e.status}\n- **Description**: ${e.description}\n${e.gitCommitHash ? `- **Commit**: ${e.gitCommitHash}\n` : ''}`,
        )
        .join('\n')
    )
  }
}

export const globalChangelog = new ChangelogManager()
