import TypedApplicationStore from "../store/TypedApplicationStore";

export default class TypedApplicationController<StateType = any,
                                                DerivationType = any,
                                                StoreType extends TypedApplicationStore<StateType, DerivationType> = any> {

    protected store: StoreType

    constructor(store: StoreType) {
        this.store = store
    }

    public subscribe<CProps, CState>(subscriber: React.Component<CProps, CState>,
                                     property: keyof (StateType & DerivationType),
                                     alias: keyof CState): void {
        this.store.subscribe(subscriber, property, alias)
    }

    public get state(): Readonly<StateType & DerivationType> {
        return this.store.state
    }

    public unsubscribe(subscriber: React.Component): void {
        this.store.unsubscribe(subscriber)
    }

    public setState(newState: Partial<StateType>): void {
        this.store.setState(newState)
    }

    public toggleFieldValidation(fieldKey: keyof DerivationType, value: boolean) {
        this.store.toggleFieldValidation(fieldKey, value)
    }
}