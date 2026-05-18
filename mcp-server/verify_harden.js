import { spawn } from 'child_process'

const child = spawn('node', ['build/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
})

let _output = ''
child.stdout.on('data', (data) => {
  _output += data.toString()
})

child.stderr.on('data', (_data) => {
  // console.error("Stderr:", _data.toString());
})

async function sendRequest(method, params) {
  return new Promise((resolve) => {
    const id = Math.floor(Math.random() * 1000)
    const request = JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n'

    const listener = (data) => {
      try {
        const str = data.toString()
        // Split by newline in case multiple responses come in
        const lines = str.split('\n')
        for (const line of lines) {
          if (!line.trim()) continue
          const response = JSON.parse(line)
          if (response.id === id) {
            child.stdout.removeListener('data', listener)
            resolve(response)
          }
        }
      } catch (_e) {
        // Ignore parsing errors for individual lines
      }
    }

    child.stdout.on('data', listener)
    child.stdin.write(request)
  })
}

async function runTests() {
  console.log('Starting Debug QA Sweep...')

  // 1. Tool List
  const tools = await sendRequest('tools/list', {})
  console.log('Tools registered:', tools.result?.tools?.map((t) => t.name).join(', '))

  // 2. Neon Regex Test
  const neonTest = await sendRequest('tools/call', {
    name: 'neon_list_branches',
    arguments: { projectId: 'INVALID_!@#' },
  })
  console.log('Neon Response:', JSON.stringify(neonTest, null, 2))

  // 3. Supabase Regex Test
  const supabaseTest = await sendRequest('tools/call', {
    name: 'supabase_get_project',
    arguments: { ref: 'not-20-chars' },
  })
  console.log('Supabase Response:', JSON.stringify(supabaseTest, null, 2))

  child.stdin.end()
  child.kill()
  process.exit(0)
}

runTests()
