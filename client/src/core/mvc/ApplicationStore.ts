import * as React from "react";
import FieldValidator from "./validators/FieldValidator";

export default abstract class ApplicationStore {
    private properties: Map<string, any> = new Map()
    private selectors: Map<string, Selector> = new Map()
    private dependencies: Map<string, string[]> = new Map()
    private subscribers: Map<string, SubscriberData[]> = new Map()

    protected registerProperty(property: string, defaultValue: any): void {
        this.checkPropertyNotRegistered(property)
        this.properties.set(property, defaultValue)
        this.subscribers.set(property, [])
        this.dependencies.set(property, [])
    }

    protected registerSelector(selectorName: string, selector: Selector): void {
        this.registerProperty(selectorName, selector.get(this.properties))

        selector.dependsOn.forEach(property => {
            if (property === selectorName) {
                throw new Error("selector " + selectorName + " depends on itself")
            }
            const propertyDependencies = this.dependencies.get(property)
            if (propertyDependencies) {
                propertyDependencies.push(selectorName)
            } else {
                throw new Error("no dependencies records for property " + property)
            }
        })
        this.selectors.set(selectorName, selector)
    }

    private getCurrentValidationActive<T>(fieldName: string): boolean {
        let validationActive = false
        const currentValue = this.properties.get(fieldName) as FieldType<T>
        if (currentValue) {
            validationActive = currentValue.validationActive
        }
        return validationActive
    }

    public toggleFieldValidation<T>(fieldName: string, validationActive: boolean) {
        const currentValue = this.properties.get(fieldName) as FieldType<T>
        if (!currentValue) {
            throw new Error("Not possible to toggle field validation, if there is no field value in properties map")
        }

        this.properties.set(fieldName, {
            value: currentValue.value,
            errors: currentValue.errors,
            validators: currentValue.validators,
            validationActive,
        })
    }

    private validateField<T>(value: T, validators: FieldValidator<T>[]): ValidationResult {
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

    protected registerField<T>(fieldName: string, defaultValue: T, validators: FieldValidator<T>[] = []): void {
        const basePropertyName = this.getFieldBasePropertyName(fieldName)
        this.registerProperty(basePropertyName, defaultValue)
        this.registerSelector(fieldName, {
            dependsOn: [basePropertyName],
            get: (map: Map<string, any>) => {
                const value = map.get(basePropertyName) as T
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

    private checkPropertyNotRegistered(propertyName: string) {
        if (this.properties.get(propertyName)
            || this.selectors.get(propertyName)) {
            throw new Error("property " + propertyName + " already registered")
        }
    }

    public subscribe(property: string,
                     subscriber: React.Component,
                     propertyAlias: string = property): void {
        const subscribersData = this.subscribers.get(property)
        if (subscribersData) {
            subscribersData.push({subscriber, propertyAlias})
            subscriber.setState({[propertyAlias]: this.getPropertyValue(property)})
        } else {
            this.unregisteredPropertySituationHandle(property)
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
        if (this.properties.get(propertyName) === null) {
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

    protected getPropertyValue<T>(property: string): T {
        const propertyValue = this.properties.get(property)
        if (propertyValue === null) {
            this.unregisteredPropertySituationHandle(property)
        }
        return this.properties.get(property) as T
    }

    protected getFieldValue<T>(property: string): T {
        return this.getPropertyValue<FieldType<T>>(property).value
    }

    protected postPropertyChange<V>(property: string, newValue: V): void {
        const propertySubscriberDataList = this.subscribers.get(property)
        if (propertySubscriberDataList) {
            propertySubscriberDataList.forEach(subscriberData => {
                const subscriber = subscriberData.subscriber
                const alias = subscriberData.propertyAlias
                subscriber.setState({[alias]: newValue})
            })
        } else {
            this.unregisteredPropertySituationHandle(property)
        }
    }

    private unregisteredPropertySituationHandle(property: string): void {
        throw new Error("unregistered property " + property)
    }

    private getFieldBasePropertyName(fieldName: string): string {
        return fieldName + FIELD_BASE_POSTFIX
    }
}

type SubscriberData = {
    subscriber: React.Component,
    propertyAlias: string,
}

type Selector = {
    dependsOn: string[]
    get: (map: Map<string, any>) => any
}

export type FieldType<T> = {
    value: T,
    errors: string[],
    validators: FieldValidator[],
    validationActive: boolean,
}

type ValidationResult = {
    errors: string[],
    abort: boolean,
}

class AbortError extends Error {}

export const FIELD_BASE_POSTFIX = ".fieldBase"