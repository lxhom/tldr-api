import {error} from "@sveltejs/kit";

let ratelimitStore: Map<string, { start: Date; count: number }> = new Map()

let windowMs = 1000 * 60 * 5
let count = 100

export const ratelimit = (ip: string) => {
    let limit = ratelimitStore.get(ip)
    if (!limit) {
        limit = {start: new Date(), count: 0}
        ratelimitStore.set(ip, limit)
    }
    if (limit.start.getTime() + windowMs < Date.now()) {
        limit.start = new Date()
        limit.count = 0
    } else {
        limit.count++
    }
    if (limit.count >= count) {
        throw error(429, "Too many requests")
    }
}
