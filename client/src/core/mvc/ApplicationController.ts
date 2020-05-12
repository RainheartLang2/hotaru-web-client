import ApplicationStore from "./store/ApplicationStore";
import {PageType} from "../../admin/state/enum/PageType";

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

    public unsubscribe(subscriber: React.Component) {
        this.applicationStore.unsubscribe(subscriber)
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

    public executeLoadable(loadingFunction: (f: Function) => void, loadingProperty: string) {
        this.setPropertyValue(loadingProperty, true)
        this.onErrorFireEvent((callback: Function) => {
                loadingFunction(() => {
                    this.setPropertyValue(loadingProperty, false)
                    callback()
                })
            },
            () => this.setPropertyValue(loadingProperty, false)
        )
    }

    public abstract handleUnauthorizedUserSituation(): void

    public abstract getDialogSubmitButtonPropertyName(): string

    public setDialogButtonLoading(value: boolean): void {
        this.setPropertyValue(this.getDialogSubmitButtonPropertyName(), value)
    }

    public batched(executableBody: Function) {
        this.applicationStore.batched(executableBody)
    }
}