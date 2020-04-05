import * as React from "react";

export default abstract class AppState<Property extends StateProperty> {
    private properties: Map<Property, any> = new Map<Property, any>()
    private subscribers: Map<Property, React.Component[]> = new Map<Property, React.Component[]>()

    constructor(properties: Property[]) {
        properties.forEach(property => {
            this.properties.set(property, property.getDefaultValue())
            this.subscribers.set(property, [])
        })
    }

    public subscribe(property: Property, subscriber: React.Component): void {
        const value = this.subscribers.get(property)
        if (value) {
            value.push(subscriber)
            subscriber.setState({[property.getPropertyName()]: this.getPropertyValue(property)})
        } else {
            this.unregisteredPropertSituationHandle(property)
        }
    }

    protected setPropertyValue<V>(property: Property, newValue: V): void {
        if (!this.properties.get(property)) {
            this.unregisteredPropertSituationHandle(property)
        }
        this.properties.set(property, newValue)
        this.postPropertyChange(property, newValue)
    }

    protected getPropertyValue(property: Property): any {
        const propertyData = this.properties.get(property)
        if (!propertyData) {
            this.unregisteredPropertSituationHandle(property)
        }
        return this.properties.get(property)
    }

    protected postPropertyChange<V>(property: Property, newValue: V): void {
        const propertySubscribers = this.subscribers.get(property)
        if (propertySubscribers) {
            propertySubscribers.forEach(subscriber =>
                subscriber.setState({[property.getPropertyName()]: newValue}))
        } else {
            this.unregisteredPropertSituationHandle(property)
        }
    }

    private unregisteredPropertSituationHandle(property: Property): void {
        throw new Error("unregistered property " + property.getPropertyName())
    }
}

export interface StateProperty {
    getPropertyName(): string
    getDefaultValue(): any
}