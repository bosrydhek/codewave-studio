import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import fetch from 'node-fetch'
import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * Secure error handler to prevent leaking sensitive information
 */
function handleSecureError(error: any) {
  console.error('[MCP Error]', error)
  const message = error instanceof Error ? error.message : 'An unexpected error occurred'
  const sanitizedMessage = message.replace(/[A-Za-z0-9_-]{20,}/g, (match) =>
    match.includes('_') || match.includes('-') ? '***REDACTED***' : match,
  )
  return {
    content: [{ type: 'text' as const, text: `Error: ${sanitizedMessage}` }],
    isError: true,
  }
}

export function registerTools(server: McpServer) {
  // --- SUPABASE TOOLS ---
  server.tool(
    'supabase_get_project',
    {
      ref: z
        .string()
        .regex(/^[a-z0-9]{20}$/, 'Invalid Supabase project ref format')
        .describe('The 20-character Supabase project ref'),
    },
    async ({ ref }) => {
      try {
        const token = process.env.SUPABASE_PERSONAL_ACCESS_TOKEN
        if (!token) throw new Error('SUPABASE_PERSONAL_ACCESS_TOKEN not configured')

        const response = await fetch(`https://api.supabase.com/v1/projects/${ref}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok)
          throw new Error(`Supabase API: ${response.statusText} (${response.status})`)
        const data = await response.json()
        return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] }
      } catch (error) {
        return handleSecureError(error)
      }
    },
  )

  // --- FILE SYSTEM TOOLS ---
  server.tool(
    'fs_read_dir',
    { path: z.string().describe('Relative or absolute path to read') },
    async ({ path: dirPath }) => {
      try {
        const absolutePath = path.resolve(process.env.PROJECT_ROOT || '.', dirPath)
        const entries = await fs.readdir(absolutePath, { withFileTypes: true })
        const data = entries.map((e) => ({
          name: e.name,
          type: e.isDirectory() ? 'directory' : 'file',
        }))
        return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] }
      } catch (error) {
        return handleSecureError(error)
      }
    },
  )

  server.tool(
    'fs_read_file',
    { path: z.string().describe('Path to the file to read') },
    async ({ path: filePath }) => {
      try {
        const absolutePath = path.resolve(process.env.PROJECT_ROOT || '.', filePath)
        const content = await fs.readFile(absolutePath, 'utf-8')
        return { content: [{ type: 'text' as const, text: content }] }
      } catch (error) {
        return handleSecureError(error)
      }
    },
  )

  server.tool(
    'fs_write_file',
    {
      path: z.string().describe('Path to write to'),
      content: z.string().describe('Content to write'),
    },
    async ({ path: filePath, content }) => {
      try {
        const absolutePath = path.resolve(process.env.PROJECT_ROOT || '.', filePath)
        await fs.mkdir(path.dirname(absolutePath), { recursive: true })
        await fs.writeFile(absolutePath, content, 'utf-8')
        return { content: [{ type: 'text' as const, text: `Successfully wrote to ${filePath}` }] }
      } catch (error) {
        return handleSecureError(error)
      }
    },
  )

  // --- SHELL TOOLS ---
  server.tool(
    'shell_execute',
    { command: z.string().describe('The shell command to execute') },
    async ({ command }) => {
      try {
        // Basic security: avoid common destructive commands in this demo bridge
        const blocked = ['rm -rf /', 'mkfs', 'dd']
        if (blocked.some((b) => command.includes(b))) {
          throw new Error('Command blocked for security reasons.')
        }

        const { stdout, stderr } = await execAsync(command, {
          cwd: process.env.PROJECT_ROOT || '.',
        })

        return {
          content: [
            {
              type: 'text' as const,
              text: stdout || stderr || 'Command executed successfully (no output).',
            },
          ],
        }
      } catch (error: any) {
        return {
          content: [{ type: 'text' as const, text: error.message }],
          isError: true,
        }
      }
    },
  )

  // Note: Neon and Netlify tools have been removed as they are not used for Designwave.
}
