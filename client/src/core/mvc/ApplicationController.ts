import ApplicationStore from "./ApplicationStore";
import HttpTransportError from "../errors/HttpTransportError";
export default abstract class ApplicationController<StoreType extends ApplicationStore = ApplicationStore> {

    private _applicationStore: StoreType

    constructor(applicationStore: StoreType) {
        this._applicationStore = applicationStore
    }

    protected get applicationStore(): StoreType {
        return this._applicationStore;
    }

    public abstract subscribe(propertyName: string, component: React.Component, propertyAlias?: string): void

    setFieldValue<V>(fieldName: string, value: V): void {
        this.applicationStore.setFieldValue<V>(fieldName, value)
    }

    toggleFieldValidation<V>(fieldName: string, validateActive: boolean): void {
        this.applicationStore.toggleFieldValidation<V>(fieldName, validateActive)
    }

    public handleError(e: Error) {
        let errorMessageKey = "error.message.unknown"
        if (e instanceof HttpTransportError) {
            errorMessageKey = "error.message.http." + (HANDLED_CODES.includes(e.code) ? e.code : "common")
        }

        this.applicationStore
            .setGlobalApplicationError(errorMessageKey)
    }
}

const HANDLED_CODES = [404, 500]