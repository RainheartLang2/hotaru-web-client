import CacheKey from "./CacheKey";
import CacheSettings from "./CacheSettings";
import StateChangeContext from "./mvc/store/StateChangeContext";
import {DefaultStateType} from "./mvc/store/ApplicationStore";

export default class ExecutableCache<StateType extends DefaultStateType, SelectorsType> {
    private keys: CacheKey[]
    private settings: CacheSettings
    private executableBody: (callback: Function, context?: StateChangeContext<StateType, SelectorsType>) => void

    constructor(settings: CacheSettings,
                keys: CacheKey[],
                executableBody: (callback: Function, context?: StateChangeContext<StateType, SelectorsType>) => void) {
        this.keys = keys;
        this.settings = settings;
        this.executableBody = executableBody;
    }

    public execute(callback: Function, context?: StateChangeContext<StateType, SelectorsType>) {
        console.log("execute")
        let needToRefresh = false
        this.keys.forEach(key => {
            if (this.settings.isNeedUpdate(key)) {
                needToRefresh = true
            }
        })

        if (needToRefresh) {
            this.keys.forEach(key => this.settings.update(key))
            this.executableBody(callback, context)
        } else {
            callback()
        }
    }
}