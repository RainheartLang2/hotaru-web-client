import {ApplicationType} from "../enum/ApplicationType";

export default class ApplicationHolder {
    private static INSTANCE = new ApplicationHolder()
    private static INITIALIZED = false

    private _applicationType = ApplicationType.NONE
    private constructor() {}

    get applicationType(): ApplicationType {
        return this._applicationType;
    }

    public static getInstance(): ApplicationHolder {
        if (!this.INITIALIZED) {
            throw new Error("Application holder is not initialized")
        }
        return this.INSTANCE
    }

    public static initialize(applicationType: ApplicationType): void {
        this.INSTANCE._applicationType = applicationType
        this.INITIALIZED = true
    }



}