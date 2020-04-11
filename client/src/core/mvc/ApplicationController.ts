import ApplicationStore from "./ApplicationStore";
import CustomError from "../errors/CustomError";
import HttpTransportError from "../errors/HttpTransportError";
import {instanceOf} from "prop-types";

export default abstract class ApplicationController<StateType extends ApplicationStore = ApplicationStore> {

    public abstract subscribe(propertyName: string, component: React.Component, propertyAlias?: string): void

    setFieldValue<V>(fieldName: string, value: V): void {
        this.getApplicationState().setFieldValue<V>(fieldName, value)
    }

    toggleFieldValidation<V>(fieldName: string, validateActive: boolean): void {
        this.getApplicationState().toggleFieldValidation<V>(fieldName, validateActive)
    }

    protected handleError(e: Error) {
        let errorMessageKey = "error.message.unknown"
        if (e instanceof HttpTransportError) {
            errorMessageKey = "error.message.http." + (HANDLED_CODES.includes(e.code) ? e.code : "common")
        }

        this.getApplicationState()
            .setGlobalApplicationError(errorMessageKey)
    }

    protected abstract getApplicationState(): StateType
}

const HANDLED_CODES = [404, 500]