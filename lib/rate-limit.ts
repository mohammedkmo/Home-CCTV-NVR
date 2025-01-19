export class RateLimit {
  private static instance: RateLimit
  private cache: Map<string, { count: number; timestamp: number }>

  private constructor() {
    this.cache = new Map()
  }

  public static getInstance(): RateLimit {
    if (!RateLimit.instance) {
      RateLimit.instance = new RateLimit()
    }
    return RateLimit.instance
  }

  public async check(ip: string, limit: number = 100, window: number = 60000): Promise<boolean> {
    const now = Date.now()
    const record = this.cache.get(ip)

    if (!record) {
      this.cache.set(ip, { count: 1, timestamp: now })
      return true
    }

    if (now - record.timestamp > window) {
      this.cache.set(ip, { count: 1, timestamp: now })
      return true
    }

    if (record.count >= limit) {
      return false
    }

    record.count++
    return true
  }

  public reset(ip: string): void {
    this.cache.delete(ip)
  }
} 