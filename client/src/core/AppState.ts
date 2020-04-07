import * as React from "react";

export default abstract class AppState {
    private properties: Map<string, any> = new Map<string, any>()
    private subscribers: Map<string, SubscriberData[]> = new Map<string, SubscriberData[]>()

    protected registerProperty(property: string, defaultValue: any) {
        this.properties.set(property, defaultValue)
        this.subscribers.set(property, [])
    }

    public subscribe(property: string,
                     subscriber: React.Component,
                     propertyAlias: string = property): void {
        const subscribersData = this.subscribers.get(property)
        if (subscribersData) {
            subscribersData.push({subscriber, propertyAlias})
            subscriber.setState({[propertyAlias]: this.getPropertyValue(property)})
        } else {
            this.unregisteredPropertSituationHandle(property)
        }
    }

    protected setPropertyValue<V>(property: string, newValue: V): void {
        if (this.properties.get(property) === null) {
            this.unregisteredPropertSituationHandle(property)
        }
        this.properties.set(property, newValue)
        this.postPropertyChange(property, newValue)
    }

    protected getPropertyValue(property: string): any {
        const propertyValue = this.properties.get(property)
        if (propertyValue === null) {
            this.unregisteredPropertSituationHandle(property)
        }
        return this.properties.get(property)
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
            this.unregisteredPropertSituationHandle(property)
        }
    }

    private unregisteredPropertSituationHandle(property: string): void {
        throw new Error("unregistered property " + property)
    }
}

export interface StateProperty {
    getPropertyName(): string
    getDefaultValue(): any
}

type SubscriberData = {
    subscriber: React.Component,
    propertyAlias: string,
}