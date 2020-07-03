import CacheKey from "./CacheKey";
import {CacheVolatility} from "../CacheVolaitlity";

export default class CacheSettings {
    private keysData: Map<CacheKey, number>
    private lifeTime: Map<CacheVolatility, number>

    constructor(lifeTime: Map<CacheVolatility, number>, keys: CacheKey[]) {
        this.keysData = new Map()
        keys.forEach(key => this.keysData.set(key, 0))
        this.lifeTime = lifeTime
    }

    public isNeedUpdate(key: CacheKey): boolean {
        let lastUpdateStamp = this.keysData.get(key)
        if (lastUpdateStamp == null) {
            throw new Error("Settings does not contain info about key " + key.name)
        }
        return (lastUpdateStamp + this.getLifeTime(key)) < Date.now()
    }

    private getLifeTime(key: CacheKey): number {
        const result = this.lifeTime.get(key.volatility)
        if (result == null) {
            throw new Error("No volatility info for " + key.volatility)
        }
        return result
    }

    public update(key: CacheKey): void {
        if (this.keysData.get(key) == null) {
            throw new Error("Settings contain info about key " + key.name)
        }
        this.keysData.set(key, Date.now())
    }

    public reset(key: CacheKey): void {
        if (this.keysData.get(key) == null) {
            throw new Error("Settings contain info about key " + key.name)
        }
        this.keysData.set(key, 0)
    }
}