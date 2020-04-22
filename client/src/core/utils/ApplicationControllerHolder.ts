import {ApplicationType} from "../enum/ApplicationType";
import ApplicationController from "../mvc/ApplicationController";

export default class ApplicationControllerHolder {
    private static _instance: ApplicationControllerHolder | null = null
    private static initialized = false

    private _controller: ApplicationController
    private constructor(controller: ApplicationController) {
        this._controller = controller
    }

    get controller(): ApplicationController {
        return this._controller;
    }

    public static get instance(): ApplicationControllerHolder {
        if (!this.initialized || !this._instance) {
            throw new Error("Application holder is not initialized")
        }
        return this._instance
    }

    public static initialize(controller: ApplicationController): void {
        this._instance = new ApplicationControllerHolder(controller)
        this.initialized = true
    }
}
