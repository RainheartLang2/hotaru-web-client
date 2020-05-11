import ApplicationStore from "./store/ApplicationStore";

export default abstract class ApplicationController<StoreType extends ApplicationStore = ApplicationStore> {
    private _applicationStore: StoreType
    private onErrorEvent: Function = () => {}

    constructor(applicationStore: StoreType) {
        this._applicationStore = applicationStore
    }

    protected get applicationStore(): StoreType {
        return this._applicationStore;
    }

    public subscribe(property: string, subscriber: React.Component, propertyAlias: string = property) {
        this.applicationStore.subscribe(property, subscriber, propertyAlias)
    }

    setPropertyValue<ValueType>(propertyName: string, value: ValueType): void {
        this.applicationStore.setPropertyValue<ValueType>(propertyName, value)
    }

    setFieldValue<ValueType>(fieldName: string, value: ValueType): void {
        this.applicationStore.setFieldValue<ValueType>(fieldName, value)
    }

    toggleFieldValidation<ValueType>(fieldName: string, validationActive: boolean): void {
        this.applicationStore.toggleFieldValidation<ValueType>(fieldName, validationActive)
    }

    public setGlobalApplicationError(errorMessageKey: string) {
        this.onErrorEvent()
        this.applicationStore.setGlobalApplicationError(errorMessageKey)
    }

    protected onErrorFireEvent(body: (f: Function) => void,
                               event: Function) {
        this.onErrorEvent = event
        body(() => {
            this.onErrorEvent = () => {}
        })
    }
}