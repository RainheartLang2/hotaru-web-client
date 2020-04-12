import FieldValidator from "../validators/FieldValidator";
import {Selector} from "./Selector";

export interface ApplicationStoreFriend {
    registerProperty(propertyName: string, defaultValue: any): void

    registerSelector(selectorName: string, selector: Selector): void

    registerField<T>(fieldName: string, defaultValue: T, validators?: FieldValidator<T>[]): void

    setPropertyValue<V>(propertyName: string, newValue: V): void

    getPropertyValue<T>(propertyName: string): T

    getFieldValue<T>(propertyName: string): T

    setFieldValue<V>(fieldName: string, newValue: V): void
}