
export default abstract class TypedApplicationStore<StateType, DerivativeType> {
    private state: StateType
    private derivatives: Derivatives<StateType, DerivativeType>

    private dependencies: Map<KeysJunction<StateType, DerivativeType>, KeysJunction<StateType, DerivativeType>[]>

    private subscriptionDataByPropertyKey: Map<keyof StateType, SubscriptionData[]>
    private propertyKeysBySubscriber: Map<React.Component, (keyof StateType)[]>

    constructor() {
        this.state = this.getDefaultState()
        this.derivatives = this.getDefaultDerivatives()
        this.dependencies = this.createDependencies()
        this.checkDerivatives(this.derivatives)

        this.subscriptionDataByPropertyKey = new Map()
        this.propertyKeysBySubscriber = new Map()

        for (let propertyKey in this.state) {
            this.subscriptionDataByPropertyKey.set(propertyKey, [])
        }
    }

    protected abstract getDefaultState(): StateType

    protected abstract getDefaultDerivatives(): Derivatives<StateType, DerivativeType>

    private putDataByPropertyKey<CProps, CState>(subscriber: React.Component<CProps, CState>, property: keyof StateType, alias: keyof CState): void {
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

    private putDataBySubscriber(subscriber: React.Component, property: keyof StateType): void {
        let subscriberProperties = this.propertyKeysBySubscriber.get(subscriber)
        if (!subscriberProperties) {
            subscriberProperties = []
            this.propertyKeysBySubscriber.set(subscriber, subscriberProperties)
        }
        subscriberProperties.push(property)
    }

    public subscribe<CProps, CState>(subscriber: React.Component<CProps, CState>, property: keyof StateType, alias: keyof CState): void {
        this.putDataByPropertyKey(subscriber, property, alias)
        this.putDataBySubscriber(subscriber, property)
    }

    private getPropertySubscriptionData(propertyKey: keyof StateType): SubscriptionData[] {
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

    public setState(newState: Partial<StateType>): void {
        for (let propertyKey in newState) {
            const propertySubscriptionData = this.getPropertySubscriptionData(propertyKey)
            propertySubscriptionData.forEach(subscriptionData => {
                subscriptionData.subscriber.setState({[subscriptionData.propertyAlias]: newState[propertyKey]})
            })
        }
    }

    private createDependencies(): Map<KeysJunction<StateType, DerivativeType>, KeysJunction<StateType, DerivativeType>[]> {
        const result = new Map<KeysJunction<StateType, DerivativeType>, KeysJunction<StateType, DerivativeType>[]>()

        for (let propertyKey in this.state) {
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
}

export type SubscriptionData = {
    subscriber: React.Component,
    propertyAlias: string,
}

export type DerivativeRecord<StateType, ArgsType extends Pick<StateType, any>, ResultType> = {
    dependsOn: (keyof StateType)[],
    get: (args: ArgsType) => ResultType,
    value: ResultType,
}

export type Derivatives<StateType, DerivativeStateType> = {
    [P in (keyof DerivativeStateType)]: DerivativeRecord<(StateType & DerivativeStateType), Pick<(StateType & DerivativeStateType), any>, DerivativeStateType[P]>
}


type KeysJunction<FirstType, SecondType> = keyof (FirstType & SecondType)