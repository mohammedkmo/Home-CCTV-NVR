export const envSchema = {
  // Auth
  AUTH_USERNAME: 'string',
  AUTH_PASSWORD: 'string',
  NEXTAUTH_SECRET: 'string',
  NEXTAUTH_URL: 'string',
  
  // Cameras
  CAMERAS_IP: 'string',
  CAMS_USERNAME: 'string',
  CAMS_PASSWORD: 'string',
} as const

export function validateEnv() {
  for (const [key, type] of Object.entries(envSchema)) {
    const value = process.env[key]
    
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`)
    }
    
    if (typeof value !== type) {
      throw new Error(`Invalid type for environment variable ${key}. Expected ${type}, got ${typeof value}`)
    }
  }
} 