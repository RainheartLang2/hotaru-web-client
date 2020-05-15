import TypedApplicationController from "../mvc/controllers/TypedApplicationController";

export default class TypedApplicationControllerHolder {
    private static _instance: TypedApplicationControllerHolder | null = null
    private static initialized = false

    private _controller: TypedApplicationController
    private constructor(controller: TypedApplicationController) {
        this._controller = controller
    }

    get controller(): TypedApplicationController {
        return this._controller;
    }

    public static get instance(): TypedApplicationControllerHolder {
        if (!this.initialized || !this._instance) {
            throw new Error("Application holder is not initialized")
        }
        return this._instance
    }

    public static initialize(controller: TypedApplicationController): void {
        this._instance = new TypedApplicationControllerHolder(controller)
        this.initialized = true
    }
}
