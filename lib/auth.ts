import { AuthConfig } from '@/types'

export function validateCredentials(credentials: AuthConfig): boolean {
  if (!credentials?.username || !credentials?.password) return false
  
  return (
    credentials.username === process.env.AUTH_USERNAME &&
    credentials.password === process.env.AUTH_PASSWORD
  )
}

export function validateAuthEnvironment(): void {
  if (!process.env.AUTH_USERNAME || !process.env.AUTH_PASSWORD) {
    throw new Error('Authentication environment variables are not properly configured')
  }
}

export function validateStreamEnvironment(): void {
  const requiredVars = ['CAMERAS_IP', 'CAMS_USERNAME', 'CAMS_PASSWORD']
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`)
    }
  }
} 