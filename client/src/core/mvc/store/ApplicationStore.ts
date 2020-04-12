import * as React from "react";
import FieldValidator from "../validators/FieldValidator";
import {ApplicationStoreFriend} from "./ApplicationStoreFriend";
import {Field} from "./Field";
import {Selector} from "./Selector";

export default abstract class ApplicationStore {
    private properties: Map<string, any> = new Map()
    private selectors: Map<string, Selector> = new Map()
    private dependencies: Map<string, string[]> = new Map()
    private subscribers: Map<string, SubscriberData[]> = new Map()

    protected friend: ApplicationStoreFriend

    constructor() {
        this.friend = this.createFriend()
        this.registerProperty(GlobalStateProperty.ApplicationError, null)
    }

    protected registerProperty(propertyName: string, defaultValue: any): void {
        this.checkPropertyNotRegistered(propertyName)
        this.properties.set(propertyName, defaultValue)
        this.subscribers.set(propertyName, [])
        this.dependencies.set(propertyName, [])
    }

    protected registerSelector(selectorName: string, selector: Selector): void {
        this.registerProperty(selectorName, selector.get(this.properties))

        selector.dependsOn.forEach(propertyName => {
            if (propertyName === selectorName) {
                throw new Error("selector " + selectorName + " depends on itself")
            }
            const propertyDependencies = this.dependencies.get(propertyName)
            if (propertyDependencies) {
                propertyDependencies.push(selectorName)
            } else {
                throw new Error("no dependencies records for property " + propertyName)
            }
        })
        this.selectors.set(selectorName, selector)
    }

    protected registerField<ValueType>(fieldName: string,
                                       defaultValue: ValueType,
                                       validators: FieldValidator<ValueType>[] = []
    ): void {
        const basePropertyName = this.getFieldBasePropertyName(fieldName)
        this.registerProperty(basePropertyName, defaultValue)
        this.registerSelector(fieldName, {
            dependsOn: [basePropertyName],
            get: (map: Map<string, any>) => {
                const value = map.get(basePropertyName) as ValueType
                const validationResult = this.validateField(value, validators)
                return {
                    value,
                    errors: validationResult.errors,
                    validators,
                    validationActive: this.getCurrentValidationActive(fieldName),
                }
            }
        })
    }

    public setGlobalApplicationError(messageToShow: string) {
        this.setPropertyValue(GlobalStateProperty.ApplicationError, messageToShow)
    }

    public wipeGlobalApplicationError() {
        this.setPropertyValue(GlobalStateProperty.ApplicationError, null)
    }

    private getCurrentValidationActive<ValueType>(fieldName: string): boolean {
        let validationActive = false
        const currentValue = this.properties.get(fieldName) as Field<ValueType>
        if (currentValue) {
            validationActive = currentValue.validationActive
        }
        return validationActive
    }

    public toggleFieldValidation<ValueType>(fieldName: string, validationActive: boolean) {
        const currentFieldValue = this.properties.get(fieldName) as Field<ValueType>
        if (!currentFieldValue) {
            throw new Error("Not possible to toggle field validation, if there is no field value in properties map")
        }

        this.properties.set(fieldName, {
            value: currentFieldValue.value,
            errors: currentFieldValue.errors,
            validators: currentFieldValue.validators,
            validationActive,
        })
    }

    private validateField<ValueType>(value: ValueType,
                                     validators: FieldValidator<ValueType>[]
    ): ValidationResult {
        const errors: string[] = []
        validators.forEach(validator => {
            if (!validator.isValid(value)) {
                if (validator.isAbortingValidator()) {
                    throw new AbortError()
                }
                errors.push(validator.getErrorMessage())
            }
        })
        return {errors, abort: false}
    }

    private checkPropertyNotRegistered(propertyName: string) {
        if (this.properties.get(propertyName)
            || this.selectors.get(propertyName)) {
            throw new Error("property " + propertyName + " already registered")
        }
    }

    public subscribe(propertyName: string,
                     subscriber: React.Component,
                     propertyAlias: string = propertyName): void {
        const subscribersData = this.subscribers.get(propertyName)
        if (subscribersData !== undefined) {
            subscribersData.push({subscriber, propertyAlias})
            subscriber.setState({[propertyAlias]: this.getPropertyValue(propertyName)})
        } else {
            this.unregisteredPropertySituationHandle(propertyName)
        }
    }

    public setFieldValue<V>(fieldName: string, newValue: V): void {
        this.setPropertyValue<V>(this.getFieldBasePropertyName(fieldName), newValue)
    }

    protected setPropertyValue<V>(propertyName: string, newValue: V): void {
        try {
            this.setPropertyValueInternally(propertyName, newValue)
        } catch (e) {
            if (e instanceof AbortError) {
                const currentValue = this.properties.get(propertyName) as V
                this.setPropertyValueInternally(propertyName, currentValue)
            }
        }
    }

    private setPropertyValueInternally<V>(propertyName: string, newValue: V): void {
        if (this.properties.get(propertyName) === undefined) {
            this.unregisteredPropertySituationHandle(propertyName)
        }
        this.properties.set(propertyName, newValue)
        this.postPropertyChange(propertyName, newValue)
        const propertySelectors = this.dependencies.get(propertyName)
        if (propertySelectors) {
            propertySelectors.forEach(selectorName => {
                const selector = this.selectors.get(selectorName)
                if (selector) {
                    this.setPropertyValueInternally(selectorName, selector.get(this.properties))
                } else {
                    throw new Error("unknown selector " + selectorName)
                }
            })
        }
    }

    protected getPropertyValue<T>(propertyName: string): T {
        const propertyValue = this.properties.get(propertyName)
        if (propertyValue === undefined) {
            this.unregisteredPropertySituationHandle(propertyName)
        }
        return this.properties.get(propertyName) as T
    }

    protected getFieldValue<T>(fieldName: string): T {
        return this.getPropertyValue<Field<T>>(fieldName).value
    }

    protected postPropertyChange<V>(propertyName: string, newValue: V): void {
        const propertySubscriberDataList = this.subscribers.get(propertyName)
        if (propertySubscriberDataList) {
            propertySubscriberDataList.forEach(subscriberData => {
                const subscriber = subscriberData.subscriber
                const alias = subscriberData.propertyAlias
                subscriber.setState({[alias]: newValue})
            })
        } else {
            this.unregisteredPropertySituationHandle(propertyName)
        }
    }

    private unregisteredPropertySituationHandle(property: string): void {
        throw new Error("unregistered property " + property)
    }

    private getFieldBasePropertyName(fieldName: string): string {
        return fieldName + FIELD_BASE_POSTFIX
    }

    private createFriend(): ApplicationStoreFriend {
        const store = this
        return new class implements ApplicationStoreFriend {
            getFieldValue<T>(property: string): T {
                return store.getFieldValue<T>(property);
            }

            getPropertyValue<T>(property: string): T {
                return store.getPropertyValue<T>(property);
            }

            registerField<T>(fieldName: string, defaultValue: T, validators?: FieldValidator<T>[]): void {
                store.registerField(fieldName, defaultValue, validators)
            }

            registerProperty(property: string, defaultValue: any): void {
                store.registerProperty(property, defaultValue)
            }

            registerSelector(selectorName: string, selector: Selector): void {
                store.registerSelector(selectorName, selector)
            }

            setPropertyValue<V>(propertyName: string, newValue: V): void {
                store.setPropertyValue<V>(propertyName, newValue)
            }

            setFieldValue<V>(fieldName: string, newValue: V): void {
                store.setFieldValue(fieldName, newValue)
            }
        }
    }
}

type SubscriberData = {
    subscriber: React.Component,
    propertyAlias: string,
}

type ValidationResult = {
    errors: string[],
    abort: boolean,
}

class AbortError extends Error {}

export enum GlobalStateProperty {
    ApplicationError = "applicationError",
}
export const FIELD_BASE_POSTFIX = ".fieldBase"