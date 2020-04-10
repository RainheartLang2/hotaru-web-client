import {DEFAULT_LOCALE, LocaleType} from "../enum/LocaleType";

//TODO: implement subscription to state
export default class LocaleHolder {
    private static INSTANCE = new LocaleHolder()
    private static INITIALIZED = false

    private _localeType = DEFAULT_LOCALE
    private constructor() {}

    get localeType(): LocaleType {
        return this._localeType;
    }

    public static getInstance(): LocaleHolder {
        if (!this.INITIALIZED) {
            throw new Error("Locale holder is not initialized")
        }
        return this.INSTANCE
    }

    public static initialize(localeType: LocaleType): void {
        this.INSTANCE._localeType = localeType
        this.INITIALIZED = true
    }
}