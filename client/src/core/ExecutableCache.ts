import CacheKey from "./CacheKey";
import CacheSettings from "./CacheSettings";

export default class ExecutableCache {
    private keys: CacheKey[]
    private settings: CacheSettings
    private executableBody: (callback: Function) => void

    constructor(settings: CacheSettings, keys: CacheKey[], executableBody: (callback: Function) => void) {
        this.keys = keys;
        this.settings = settings;
        this.executableBody = executableBody;
    }

    public execute(callback: Function) {
        let needToRefresh = false
        this.keys.forEach(key => {
            if (this.settings.isNeedUpdate(key)) {
                needToRefresh = true
            }
        })

        if (needToRefresh) {
            this.keys.forEach(key => this.settings.update(key))
            this.executableBody(callback)
        } else {
            callback()
        }
    }
}