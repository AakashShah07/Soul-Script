import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";



export async function rateLimit(identifier: string) {

    const rateLimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 requests per minute
  analytics: true, 
  prefix: "@upstash/ratelimit"
    });

    return await rateLimit.limit(identifier);

    
}
