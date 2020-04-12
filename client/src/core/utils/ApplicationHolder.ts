import {ApplicationType} from "../enum/ApplicationType";

export default class ApplicationHolder {
    private static _instance = new ApplicationHolder()
    private static initialized = false

    private _applicationType = ApplicationType.None
    private constructor() {}

    get applicationType(): ApplicationType {
        return this._applicationType;
    }

    public static get instance(): ApplicationHolder {
        if (!this.initialized) {
            throw new Error("Application holder is not initialized")
        }
        return this._instance
    }

    public static initialize(applicationType: ApplicationType): void {
        this._instance._applicationType = applicationType
        this.initialized = true
    }
}