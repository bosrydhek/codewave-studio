import { generateCode, AISettings } from './ai'

export async function getAutomatedSuggestions(
  projectState: {
    files: string[]
    activeFile?: string
    activeFileContent?: string
  },
  settings: AISettings,
): Promise<string[]> {
  const prompt = `
    You are a project advisor for a web developer.
    Analyze the current project state and suggest the next 3 actionable improvements or tasks.
    
    Project Files: ${projectState.files.join(', ')}
    Active File: ${projectState.activeFile || 'None'}
    ${projectState.activeFileContent ? `Active File Content Preview:\n${projectState.activeFileContent.slice(0, 500)}...` : ''}
    
    Return a JSON array of 3 short, punchy string suggestions (max 40 characters each). Use British English spelling (e.g.,ised, colour) and British grammatical standards. Use GBP (£) as the default currency if relevant.
    Example: ["Style the login button", "Add validation to form", "Setup database schema"]
    Return ONLY the JSON array.
  `

  try {
    const response = await generateCode(prompt, settings)
    // Parse the response. AI might return markdown block or raw JSON.
    const jsonStr = response.match(/\[.*\]/s)?.[0] || '[]'
    const suggestions = JSON.parse(jsonStr)
    return Array.isArray(suggestions) ? suggestions.slice(0, 3) : []
  } catch (err) {
    console.error('[SuggestionsEngine] Error:', err)
    return ['Update project structure', 'Check for errors', 'Refine UI design']
  }
}
