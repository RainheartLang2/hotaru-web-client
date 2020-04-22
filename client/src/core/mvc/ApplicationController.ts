import ApplicationStore from "./store/ApplicationStore";
import HttpTransportError from "../errors/HttpTransportError";
import BusinessLogicError from "../errors/BusinessLogicError";
import {instanceOf} from "prop-types";

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

    public subscribe(property: string, subscriber: React.Component, propertyAlias: string = property) {
        this.applicationStore.subscribe(property, subscriber, propertyAlias)
    }
    setFieldValue<ValueType>(fieldName: string, value: ValueType): void {
        this.applicationStore.setFieldValue<ValueType>(fieldName, value)
    }

    toggleFieldValidation<ValueType>(fieldName: string, validationActive: boolean): void {
        this.applicationStore.toggleFieldValidation<ValueType>(fieldName, validationActive)
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

    public handle(e: Error, setError: (errorMessage: string) => void = () => {}) {
        if (e instanceof BusinessLogicError) {
            setError(e.message)
            return
        }
        let errorMessageKey = "error.message.unknown"
        if (e instanceof HttpTransportError) {
            errorMessageKey = "error.message.http." + (HANDLED_HTTP_CODES.includes(e.code) ? e.code : "common")
        }

        this.store.setGlobalApplicationError(errorMessageKey)
    }
}

const HANDLED_HTTP_CODES = [404, 500]