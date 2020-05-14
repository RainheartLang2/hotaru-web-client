import {CommonUtils} from "../../utils/CommonUtils";
import FieldValidator from "../validators/FieldValidator";
import {Field} from "./Field";

export default abstract class TypedApplicationStore<StateType, DerivativeType> {
    private originalState: StateType
    private derivatives: Derivatives<StateType, DerivativeType>
    private readableState: StateType & DerivativeType

    private dependencies: Map<KeysJunction<StateType, DerivativeType>, (keyof DerivativeType)[]>

    private subscriptionDataByPropertyKey: Map<keyof (StateType & DerivativeType), SubscriptionData[]>
    private propertyKeysBySubscriber: Map<React.Component, (keyof (StateType & DerivativeType))[]>

    constructor() {
        this.originalState = this.getDefaultState()
        this.derivatives = this.getDefaultDerivatives()
        this.dependencies = this.createDependencies()
        this.checkDerivatives(this.derivatives)
        this.readableState = this.createReadableState()

        this.subscriptionDataByPropertyKey = new Map()
        this.propertyKeysBySubscriber = new Map()

        for (let propertyKey in this.originalState) {
            this.subscriptionDataByPropertyKey.set(propertyKey, [])
        }
        for (let derivativeKey in this.derivatives) {
            this.subscriptionDataByPropertyKey.set(derivativeKey, [])
        }
    }

    protected abstract getDefaultState(): StateType

    protected abstract getDefaultDerivatives(): Derivatives<StateType, DerivativeType>

    public get state(): Readonly<StateType & DerivativeType> {
        return this.readableState
    }

    protected createField(originalProperty: keyof(StateType & DerivativeType),
                                    defaultValue: string = "",
                                    validators: FieldValidator[] = [],
    ): DerivativeRecord<(StateType & DerivativeType), Pick<(StateType & DerivativeType), any>, Field> {
        return {
            dependsOn: [originalProperty],
            get: (args: Pick<StateType & DerivativeType, any>, prevValue?: Field) => {
                const originalValue = args[originalProperty]
                const validationResult = this.validateField(originalValue, validators)
                return {
                    value: originalValue,
                    errors: validationResult.errors,
                    validators,
                    validationActive: prevValue ? prevValue.validationActive : false,
                }
            },
            value: {
                value: defaultValue,
                errors: [],
                validators,
                validationActive: true,
            },
        }
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

    private getCurrentValidationActive(fieldKey: keyof DerivativeType): boolean {
        let validationActive = false
        const currentValue = (this.readableState[fieldKey]) as unknown as Field<string>
        if (currentValue) {
            validationActive = currentValue.validationActive
        }
        return validationActive
    }

    private putDataByPropertyKey<CProps, CState>(subscriber: React.Component<CProps, CState>, property: keyof (StateType & DerivativeType), alias: keyof CState): void {
        let propertySubscriptionData = this.subscriptionDataByPropertyKey.get(property)
        if (!propertySubscriptionData) {
            propertySubscriptionData = []
            this.subscriptionDataByPropertyKey.set(property, propertySubscriptionData)
        }
        propertySubscriptionData.push({
            subscriber,
            propertyAlias: alias.toString(),
        })
    }

    private putDataBySubscriber(subscriber: React.Component, property: keyof (StateType & DerivativeType)): void {
        let subscriberProperties = this.propertyKeysBySubscriber.get(subscriber)
        if (!subscriberProperties) {
            subscriberProperties = []
            this.propertyKeysBySubscriber.set(subscriber, subscriberProperties)
        }
        subscriberProperties.push(property)
    }

    public subscribe<CProps, CState>(subscriber: React.Component<CProps, CState>, property: keyof (StateType & DerivativeType), alias: keyof CState): void {
        this.putDataByPropertyKey(subscriber, property, alias)
        this.putDataBySubscriber(subscriber, property)
    }

    private getPropertySubscriptionData(propertyKey: keyof (StateType & DerivativeType)): SubscriptionData[] {
        const propertySubscriptionData = this.subscriptionDataByPropertyKey.get(propertyKey)
        if (!propertySubscriptionData) {
            throw new Error("no data for property key " + propertyKey)
        }
        return propertySubscriptionData
    }

    public unsubscribe(subscriber: React.Component): void {
        const subscriberProperties = (this.propertyKeysBySubscriber.get(subscriber))
        if (!subscriberProperties) {
            throw new Error("component was not subscribed")
        }

        subscriberProperties.forEach(propertyKey => {
            const propertySubscriptionData = this.getPropertySubscriptionData(propertyKey)
            this.subscriptionDataByPropertyKey.set(propertyKey, propertySubscriptionData.filter(data => data.subscriber != subscriber))
        })
        this.propertyKeysBySubscriber.delete(subscriber)
    }

    private postChanges<ValueType>(key: keyof (StateType & DerivativeType), newValue: ValueType) {
        const propertySubscriptionData = this.getPropertySubscriptionData(key)
        propertySubscriptionData.forEach(subscriptionData => {
            subscriptionData.subscriber.setState({[subscriptionData.propertyAlias]: newValue})
        })
    }

    private refreshDependencies(key: keyof (StateType & DerivativeType)): void {
        const propertyDependencies = this.dependencies.get(key)
        if (!propertyDependencies) {
            throw new Error("no dependencies for key " + key)
        }
        propertyDependencies.forEach(dependency => {
            this.refreshDerivative(dependency)
        })
    }

    public setState(newState: Partial<StateType>): void {
        for (let propertyKey in newState) {
            // @ts-ignore
            this.originalState[propertyKey] = newState[propertyKey]
            // @ts-ignore
            this.readableState[propertyKey] = newState[propertyKey]
            this.postChanges(propertyKey, newState[propertyKey])

            this.refreshDependencies(propertyKey)
        }
    }

    private refreshDerivative(derivativeKey: keyof DerivativeType): void {
        const record = this.derivatives[derivativeKey]
        record.value = record.get(CommonUtils.pick(this.readableState, record.dependsOn), record.value)
        // @ts-ignore
        this.readableState[derivativeKey] = record.value
        this.postChanges(derivativeKey, record.value)

        this.refreshDependencies(derivativeKey)
    }

    private createDependencies(): Map<KeysJunction<StateType, DerivativeType>, (keyof DerivativeType)[]> {
        const result = new Map<KeysJunction<StateType, DerivativeType>, (keyof DerivativeType)[]>()

        for (let propertyKey in this.originalState) {
            result.set(propertyKey, [])
        }

        for (let derivativeKey in this.derivatives) {
            result.set(derivativeKey, [])
        }

        for (let derivativeKey in this.derivatives) {
            this.derivatives[derivativeKey].dependsOn.forEach(key => {
                let keyDependencies = result.get(key)
                if (keyDependencies == null) {
                    throw new Error("no dependencies array for " + key)
                }
                keyDependencies.push(derivativeKey)
            })
        }
        return result
    }

    private checkDerivatives(derivatives: Derivatives<StateType, DerivativeType>): void {
        //TODO: implement
    }

    private createReadableState(): StateType & DerivativeType {
        return CommonUtils.mergeTypes(this.originalState, derivativesToDerivativeState(this.derivatives))
    }
}

function derivativesToDerivativeState<StateType, DerivativeStateType>(derivatives: Derivatives<StateType, DerivativeStateType>): DerivativeStateType {
    const result: { [k in string]: any } = {}
    for (let key in derivatives) {
        result[key] = derivatives[key].value
    }

    return result as DerivativeStateType
}

export type SubscriptionData = {
    subscriber: React.Component,
    propertyAlias: string,
}

export type DerivativeRecord<StateType, ArgsType extends Pick<StateType, any>, ResultType> = {
    dependsOn: (keyof StateType)[],
    get: (args: ArgsType, prevValue?: ResultType) => ResultType,
    value: ResultType,
}

export type Derivatives<StateType, DerivativeStateType> = {
    [P in (keyof DerivativeStateType)]: DerivativeRecord<(StateType & DerivativeStateType), Pick<(StateType & DerivativeStateType), any>, DerivativeStateType[P]>
}

type ValidationResult = {
    errors: string[],
    abort: boolean,
}

type KeysJunction<FirstType, SecondType> = keyof (FirstType & SecondType)

export type SingleProperty<A> = A[keyof A]

class AbortError extends Error {}