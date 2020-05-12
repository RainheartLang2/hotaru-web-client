import {CacheVolatility} from "../CacheVolaitlity";

export namespace CacheUtils {
    export function getCacheLifetineSettings(): Map<CacheVolatility, number> {
        const result = new Map<CacheVolatility, number>()
        result.set(CacheVolatility.EXTRA_LOW, 4 * 1000 * 60 * 60)
        result.set(CacheVolatility.LOW, 1 * 1000 * 60 * 60)
        result.set(CacheVolatility.MODERATE_LOW, 30 * 1000 * 60)
        result.set(CacheVolatility.MEDIUM, 15 * 1000 * 60)
        result.set(CacheVolatility.MODERATE_HIGH, 5 * 1000 * 60)
        result.set(CacheVolatility.HIGH, 1 * 1000 * 60)
        result.set(CacheVolatility.EXTRA_HIGH, 1 * 1000)

        return result
    }
}