import {ApplicationType} from "../enum/ApplicationType";

export default class ApplicationHolder {
    private static _instance = new ApplicationHolder()

    private _applicationType = ApplicationType.None
    private constructor() {}

    get applicationType(): ApplicationType {
        return this._applicationType;
    }

    public static get instance(): ApplicationHolder {
        if (this._instance.applicationType == ApplicationType.None) {
            throw new Error("Application holder is not initialized")
        }
        return this._instance
    }

    public static initialize(applicationType: ApplicationType): void {
        this._instance._applicationType = applicationType
    }
}