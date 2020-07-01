import {CommonUtils} from "../../utils/CommonUtils";
import FieldValidator from "../validators/FieldValidator";
import {Field} from "./Field";
import ApplicationStoreFriend from "./ApplicationStoreFriend";
import StateChangeContext, {StateChangeContextMode} from "./StateChangeContext";

export default abstract class ApplicationStore<StateType extends DefaultStateType, SelectorsType> {
    private originalState!: StateType
    private selectors!: SelectorsInfo<StateType, SelectorsType>
    private readableState!: StateType & SelectorsType

    private dependencies!: Map<KeysJunction<StateType, SelectorsType>, (keyof SelectorsType)[]>

    private subscriptionDataByPropertyKey!: Map<keyof (StateType & SelectorsType), SubscriptionData[]>
    private propertyKeysBySubscriber!: Map<React.Component, (keyof (StateType & SelectorsType))[]>

    protected initialize(): void {
        this.originalState = this.getDefaultState()
        this.selectors = this.getSelectors()
        this.dependencies = this.createDependencies()
        this.checkSelectors(this.selectors)
        this.readableState = this.createReadableState()
        this.initializeSelectors()

        this.subscriptionDataByPropertyKey = new Map()
        this.propertyKeysBySubscriber = new Map()

        for (let propertyKey in this.originalState) {
            this.subscriptionDataByPropertyKey.set(propertyKey, [])
        }
        for (let selectorKey in this.selectors) {
            this.subscriptionDataByPropertyKey.set(selectorKey, [])
        }
    }

    protected abstract getDefaultState(): StateType

    protected abstract getSelectors(): SelectorsInfo<StateType, SelectorsType>

    private initializeSelectors(): void {
        const context = new StateChangeContext(StateChangeContextMode.AUTO)
        //TODO: optimize
        for (let selectorKey in this.selectors) {
            this.refreshSelector(selectorKey, context, false)
        }
        context.onSetState()
    }

    protected createDefaultStateTypeEntry(): DefaultStateType {
        return {
            isDialogSubmitButtonLoading: false,
            globalErrorTextKey: null,
        }
    }

    public get state(): Readonly<StateType & SelectorsType> {
        return this.readableState
    }

    protected createField(originalProperty: keyof(StateType & SelectorsType),
                                    defaultValue: string = "",
                                    validators: FieldValidator[] = [],
                                    validationActive: boolean = true,
    ): Selector<(StateType & SelectorsType), Pick<(StateType & SelectorsType), any>, Field> {

        return {
            dependsOn: [originalProperty],
            get: (args: Pick<StateType & SelectorsType, any>, prevValue?: Field) => {
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
                validationActive,
            },
        }
    }

    protected createFormHasErrorsSelector(fieldsKeys: (keyof SelectorsType)[],
    ): Selector<(StateType & SelectorsType), Pick<(StateType & SelectorsType), any>, boolean> {
        return {
            dependsOn: fieldsKeys,
            get: (state: Pick<StateType & SelectorsType, any>) => {
                let result = false
                fieldsKeys.forEach(key => {
                    const field = this.readableState[key] as unknown as Field
                    if (field.errors.length > 0) {
                        result = true
                        return
                    }
                })
                return result
            },
            value: false,
        }
    }

    public toggleFieldValidation(fieldKey: keyof SelectorsType,
                                 value: boolean,
                                 context = new StateChangeContext(StateChangeContextMode.AUTO)

    ): void {
        const field = this.readableState[fieldKey] as unknown as Field
        field.validationActive = value
        this.refreshSelector(fieldKey, context)
        context.onSetState()
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

    private putDataByPropertyKey<CProps, CState>(subscriber: React.Component<CProps, CState>, property: keyof (StateType & SelectorsType), alias: keyof CState): void {
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

    private putDataBySubscriber(subscriber: React.Component, properties: (keyof (StateType & SelectorsType))[]): void {
        let subscriberProperties = this.propertyKeysBySubscriber.get(subscriber)
        if (!subscriberProperties) {
            subscriberProperties = []
        }
        subscriberProperties = subscriberProperties.concat(properties)
        this.propertyKeysBySubscriber.set(subscriber, subscriberProperties)
    }

    public subscribe<CProps, CState>(subscriber: React.Component<CProps, CState>,
                                     aliasInfo: Partial<PropertyAliasInfo<StateType & SelectorsType, CState>>) {
        const keysArray: (keyof (StateType & SelectorsType))[] = []
        for (let propertyKey in aliasInfo) {
            const key = propertyKey as keyof(StateType & SelectorsType)
            const alias = aliasInfo[key] as keyof CState
            this.putDataByPropertyKey(subscriber, key, alias)
            keysArray.push(key)
        }
        this.putDataBySubscriber(subscriber, keysArray)
        const state = CommonUtils.createLooseObject(keysArray
                                                    .filter(key => this.readableState[key] != undefined)
                                                    .map(key => [aliasInfo[key], this.readableState[key]]))
        subscriber.setState(state)
    }

    private getPropertySubscriptionData(propertyKey: keyof (StateType & SelectorsType)): SubscriptionData[] {
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

    private postChanges<ValueType>(key: keyof (StateType & SelectorsType),
                                   newValue: ValueType,
                                   context: StateChangeContext,
    ) {
        const propertySubscriptionData = this.getPropertySubscriptionData(key)
        propertySubscriptionData.forEach(subscriptionData => {
            context.setState(subscriptionData.subscriber, {[subscriptionData.propertyAlias]: newValue})
        })
    }

    private refreshDependencies(key: keyof (StateType & SelectorsType),
                                context: StateChangeContext,
                                postChanges: boolean = true): void {
        const propertyDependencies = this.dependencies.get(key)
        if (!propertyDependencies) {
            throw new Error("no dependencies for key " + key)
        }
        propertyDependencies.forEach(dependency => {
            try {
                this.refreshSelector(dependency, context, postChanges)
            } catch (e) {
            }
        })
    }

    public setState(newState: Partial<StateType>,
                    context = new StateChangeContext(StateChangeContextMode.AUTO)
    ): void {
        for (let propertyKey in newState) {
            // @ts-ignore
            this.originalState[propertyKey] = newState[propertyKey]
            // @ts-ignore
            this.readableState[propertyKey] = newState[propertyKey]
            this.postChanges(propertyKey, newState[propertyKey], context)
            this.refreshDependencies(propertyKey, context)
        }
        context.onSetState()
    }

    private refreshSelector(selectorKey: keyof SelectorsType,
                            context: StateChangeContext,
                            postChanges: boolean = true): void {
        const record = this.selectors[selectorKey]
        record.value = record.get(CommonUtils.pick(this.readableState, record.dependsOn), record.value)
        // @ts-ignore
        this.readableState[selectorKey] = record.value
        if (postChanges) {
            this.postChanges(selectorKey, record.value, context)
        }

        this.refreshDependencies(selectorKey, context, postChanges)
    }

    private createDependencies(): Map<KeysJunction<StateType, SelectorsType>, (keyof SelectorsType)[]> {
        const result = new Map<KeysJunction<StateType, SelectorsType>, (keyof SelectorsType)[]>()

        for (let propertyKey in this.originalState) {
            result.set(propertyKey, [])
        }

        for (let selectorKey in this.selectors) {
            result.set(selectorKey, [])
        }

        for (let selectorKey in this.selectors) {
            this.selectors[selectorKey].dependsOn.forEach(key => {
                let keyDependencies = result.get(key)
                if (keyDependencies == null) {
                    throw new Error("no dependencies array for " + key)
                }
                keyDependencies.push(selectorKey)
            })
        }
        return result
    }

    private checkSelectors(selectorsInfo: SelectorsInfo<StateType, SelectorsType>): void {
        //TODO: implement
    }

    private createReadableState(): StateType & SelectorsType {
        return CommonUtils.mergeTypes(this.originalState, getSelectorsValues(this.selectors))
    }

    public batched(executableBody: Function) {
        //TODO: add batching
        executableBody()
    }

    protected createFriend(): ApplicationStoreFriend<StateType, SelectorsType> {
        const store = this
        return new class implements ApplicationStoreFriend<StateType, SelectorsType> {
            public createField(originalProperty: keyof(StateType & SelectorsType),
                                        defaultValue: string = "",
                                        validators: FieldValidator[] = [],
                                        validationActive: boolean = true,
            ): Selector<(StateType & SelectorsType), Pick<(StateType & SelectorsType), any>, Field> {
                return store.createField(originalProperty, defaultValue, validators, validationActive)
            }

            public createFormHasErrorsSelector(fieldsKeys: (keyof SelectorsType)[],
            ): Selector<(StateType & SelectorsType), Pick<(StateType & SelectorsType), any>, boolean> {
                return store.createFormHasErrorsSelector(fieldsKeys)
            }

            public get state(): Readonly<StateType & SelectorsType> {
                return store.readableState
            }
        }
    }
}

function getSelectorsValues<StateType, SelectorsType>(selectors: SelectorsInfo<StateType, SelectorsType>): SelectorsType {
    const result: { [k in string]: any } = {}
    for (let key in selectors) {
        result[key] = selectors[key].value
    }

    return result as SelectorsType
}

export type SubscriptionData = {
    subscriber: React.Component,
    propertyAlias: string,
}

export type Selector<StateType, ArgsType extends Pick<StateType, any>, ResultType> = {
    dependsOn: (keyof StateType)[],
    get: (args: ArgsType, prevValue?: ResultType) => ResultType,
    value: ResultType,
}

export type SelectorsInfo<StateType, SelectorsType> = {
    [P in (keyof SelectorsType)]: Selector<(StateType & SelectorsType), Pick<(StateType & SelectorsType), any>, SelectorsType[P]>
}

type ValidationResult = {
    errors: string[],
    abort: boolean,
}

type KeysJunction<FirstType, SecondType> = keyof (FirstType & SecondType)

class AbortError extends Error {}

export type DefaultStateType = {
    isDialogSubmitButtonLoading: boolean
    globalErrorTextKey: string | null
}

export type PropertyAliasInfo<State, ComponentState> = {
    [P in (keyof State)]: keyof ComponentState
}

export type BatchedCallback = (context: StateChangeContext) => void