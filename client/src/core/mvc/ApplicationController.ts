import ApplicationStore from "./ApplicationStore";

export default abstract class ApplicationController<StateType extends ApplicationStore = ApplicationStore> {

    public abstract subscribe(propertyName: string, component: React.Component, propertyAlias?: string): void

    setFieldValue<V>(fieldName: string, value: V): void {
        this.getApplicationState().setFieldValue<V>(fieldName, value)
    }

    toggleFieldValidation<V>(fieldName: string, validateActive: boolean): void {
        this.getApplicationState().toggleFieldValidation<V>(fieldName, validateActive)
    }

    protected abstract getApplicationState(): StateType
}