import {DEFAULT_LOCALE, LocaleType} from "../enum/LocaleType";

//TODO: implement subscription to state
export default class LocaleHolder {
    private static _instance = new LocaleHolder()
    private static initialized = false

    private _localeType = DEFAULT_LOCALE
    private constructor() {}

    get localeType(): LocaleType {
        return this._localeType;
    }

    public static get instance(): LocaleHolder {
        if (!this.initialized) {
            throw new Error("Locale holder is not initialized")
        }
        return this._instance
    }

    public static initialize(localeType: LocaleType): void {
        this._instance._localeType = localeType
        this.initialized = true
    }
}