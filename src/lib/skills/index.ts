/**
 * Skills Library for Designwave
 * Handles fetching, versioning, and updating Agent Skills.
 */

const RAW_GITHUB_URL = 'https://raw.githubusercontent.com'
const GITHUB_API_URL = 'https://api.github.com'

/**
 * Fetches the SKILL.md content and latest commit info from a GitHub repo.
 * @param {string} repo - Format "owner/repo"
 * @returns {Promise<{content: string, hash: string, name: string, description: string}>}
 */
export async function fetchSkillFromGithub(repo: string) {
  try {
    // 1. Fetch latest commit info to use as a version/hash
    const apiResponse = await fetch(`${GITHUB_API_URL}/repos/${repo}/commits/main`)
    if (!apiResponse.ok) throw new Error(`Repo not found or API limit reached: ${repo}`)
    const apiData: any = await apiResponse.json()
    const latestHash = apiData.sha

    // 2. Fetch SKILL.md content
    const rawResponse = await fetch(`${RAW_GITHUB_URL}/${repo}/main/SKILL.md`)
    if (!rawResponse.ok) {
      // Try capitalized version or alternative paths if needed, but standard is root SKILL.md
      throw new Error(`SKILL.md not found in ${repo}`)
    }
    const content = await rawResponse.text()

    // 3. Extract metadata from YAML (Simplified for now)
    const nameMatch = content.match(/name:\s*(.+)/i)
    const descMatch = content.match(/description:\s*(.+)/i)

    return {
      id: repo,
      name: nameMatch ? nameMatch[1].trim() : repo.split('/')[1],
      description: descMatch ? descMatch[1].trim() : 'An Antigravity-compatible Agent Skill.',
      repo: repo,
      content: content,
      commitHash: latestHash,
      lastUpdated: new Date().toISOString(),
      isEnabled: true,
    }
  } catch (error) {
    console.error('Error fetching skill:', error)
    throw error
  }
}

/**
 * Checks for updates for a list of skills.
 * @param {Array<any>} skills
 * @returns {Promise<Array<any>>} - List of skills that have updates
 */
export async function checkForUpdates(skills: any[]) {
  const updatePromises = skills.map(async (skill) => {
    try {
      const apiResponse = await fetch(`${GITHUB_API_URL}/repos/${skill.repo}/commits/main`)
      if (!apiResponse.ok) return null
      const apiData = await apiResponse.json()
      if (apiData.sha !== skill.commitHash) {
        return { ...skill, newHash: apiData.sha }
      }
    } catch {
      return null
    }
    return null
  })

  const results = await Promise.all(updatePromises)
  return results.filter((s) => s !== null)
}
