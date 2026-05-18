import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { registerTools } from './tools.js'
import dotenv from 'dotenv'

dotenv.config()

const server = new McpServer({
  name: 'designwave-mcp',
  version: '1.0.0',
})

// Register all tools
registerTools(server)

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Designwave MCP server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
