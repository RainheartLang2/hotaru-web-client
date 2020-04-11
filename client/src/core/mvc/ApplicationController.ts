import ApplicationStore from "./ApplicationStore";
import HttpTransportError from "../errors/HttpTransportError";

export default abstract class ApplicationController<StoreType extends ApplicationStore = ApplicationStore> {
    private _applicationStore: StoreType
    private _errorHandler: ErrorHandler
    constructor(applicationStore: StoreType) {
        this._applicationStore = applicationStore
        this._errorHandler = new ErrorHandler(applicationStore)
    }

    protected get applicationStore(): StoreType {
        return this._applicationStore;
    }

    protected get errorHandler(): ErrorHandler {
        return this._errorHandler;
    }

    public abstract subscribe(propertyName: string, component: React.Component, propertyAlias?: string): void

    setFieldValue<V>(fieldName: string, value: V): void {
        this.applicationStore.setFieldValue<V>(fieldName, value)
    }

    toggleFieldValidation<V>(fieldName: string, validateActive: boolean): void {
        this.applicationStore.toggleFieldValidation<V>(fieldName, validateActive)
    }

    protected handleError(e: Error) {
        this._errorHandler.handle(e)
    }
}

export class ErrorHandler {
    private store: ApplicationStore

    constructor(store: ApplicationStore) {
        this.store = store
    }

    public handle(e: Error) {
        let errorMessageKey = "error.message.unknown"
        if (e instanceof HttpTransportError) {
            errorMessageKey = "error.message.http." + (HANDLED_CODES.includes(e.code) ? e.code : "common")
        }

        this.store.setGlobalApplicationError(errorMessageKey)
    }
}

const HANDLED_CODES = [404, 500]