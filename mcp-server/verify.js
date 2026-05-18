import { spawn } from 'child_process'

const child = spawn('node', ['build/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
})

let output = ''
child.stdout.on('data', (data) => {
  output += data.toString()
  console.log('Stdout:', data.toString())
})

child.stderr.on('data', (data) => {
  console.error('Stderr:', data.toString())
})

// JSON-RPC for listing tools
const listToolsRequest =
  JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {},
  }) + '\n'

child.stdin.write(listToolsRequest)

setTimeout(() => {
  const hasCoreTools = output.includes('supabase_get_project') && output.includes('fs_read_dir')
  const hasRemovedTools =
    output.includes('neon_list_branches') || output.includes('designwave_think')

  if (hasCoreTools && !hasRemovedTools) {
    console.log('SUCCESS: MCP server verified. Core tools present, outdated tools removed.')
  } else {
    console.error('FAILURE: MCP server verification failed.')
    console.log('Actual output:', output)
  }
  child.kill()
  process.exit(hasCoreTools && !hasRemovedTools ? 0 : 1)
}, 2000)
