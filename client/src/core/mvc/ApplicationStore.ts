import * as React from "react";

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
        this.checkPropertyNotRegistered(selectorName)

        selector.dependsOn.forEach(property => {
            const propertyDependencies = this.dependencies.get(property)
            if (propertyDependencies) {
                propertyDependencies.push(selectorName)
            } else {
                throw new Error("no dependencies records for property " + property)
            }
        })

        this.properties.set(selectorName, selector.get(this.properties))
        this.subscribers.set(selectorName, [])
        this.dependencies.set(selectorName, [])
        this.selectors.set(selectorName, selector)
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

    protected setPropertyValue<V>(propertyName: string, newValue: V): void {
        if (this.properties.get(propertyName) === null) {
            this.unregisteredPropertySituationHandle(propertyName)
        }
        console.log(propertyName)
        console.log(newValue)
        this.properties.set(propertyName, newValue)
        this.postPropertyChange(propertyName, newValue)
        const propertySelectors = this.dependencies.get(propertyName)
        if (propertySelectors) {
            propertySelectors.forEach(selectorName => {
                const selector = this.selectors.get(selectorName)
                if (selector) {
                    this.setPropertyValue(selectorName, selector.get(this.properties))
                } else {
                    throw new Error("unknown selector " + selectorName)
                }
            })
        }
    }

    protected getPropertyValue(property: string): any {
        const propertyValue = this.properties.get(property)
        if (propertyValue === null) {
            this.unregisteredPropertySituationHandle(property)
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
            this.unregisteredPropertySituationHandle(property)
        }
    }

    private unregisteredPropertySituationHandle(property: string): void {
        throw new Error("unregistered property " + property)
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