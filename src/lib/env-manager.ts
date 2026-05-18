import { z } from 'zod'

export const EnvVariableSchema = z.object({
  key: z.string(),
  value: z.string(),
  isPublic: z.boolean().default(false),
  provider: z.enum(['vercel', 'netlify', 'google_cloud', 'general']).default('general'),
})

export type EnvVariable = z.infer<typeof EnvVariableSchema>

export class EnvManager {
  private variables: EnvVariable[] = []

  addVariable(variable: EnvVariable) {
    this.variables.push(variable)
  }

  generateFile(provider: EnvVariable['provider'] = 'general'): string {
    return this.variables
      .filter((v) => v.provider === provider || v.provider === 'general')
      .map((v) => `${v.isPublic ? 'NEXT_PUBLIC_' : ''}${v.key}=${v.value}`)
      .join('\n')
  }

  getPublicVariables(): EnvVariable[] {
    return this.variables.filter((v) => v.isPublic)
  }

  getSecretVariables(): EnvVariable[] {
    return this.variables.filter((v) => !v.isPublic)
  }
}

export const globalEnvManager = new EnvManager()
