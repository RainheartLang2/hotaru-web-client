import FieldValidator from "./validators/FieldValidator";
import {Selector} from "./ApplicationStore";

export interface ApplicationStoreFriend {
    registerProperty(property: string, defaultValue: any): void

    registerSelector(selectorName: string, selector: Selector): void

    registerField<T>(fieldName: string, defaultValue: T, validators?: FieldValidator<T>[]): void

    setPropertyValue<V>(propertyName: string, newValue: V): void

    getPropertyValue<T>(property: string): T

    getFieldValue<T>(property: string): T

    setFieldValue<V>(fieldName: string, newValue: V): void
}