import TypedApplicationStore, {DefaultStateType} from "../store/TypedApplicationStore";
import {CommonUtils} from "../../utils/CommonUtils";

export default abstract class TypedApplicationController<StateType extends DefaultStateType = any,
                                                DerivationType = any,
                                                StoreType extends TypedApplicationStore<StateType, DerivationType> = any> {

    protected store: StoreType
    private onErrorEvent: Function = () => {}

    constructor(store: StoreType) {
        this.store = store
    }

    public subscribe<CProps, CState>(subscriber: React.Component<CProps, CState>,
                                     property: keyof (StateType & DerivationType),
                                     alias: keyof CState): void {
        this.store.subscribe(subscriber, property, alias)
    }

    public subscribeBatch<CProps, CState>(subscriber: React.Component<CProps, CState>,
                                            info: [keyof (StateType & DerivationType), keyof CState][]): void {
        info.forEach(infoEntry => this.subscribe(subscriber, infoEntry[0], infoEntry[1]))
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

    public setGlobalApplicationError(errorMessageKey: string) {
        this.onErrorEvent()
        // @ts-ignore
        this.setState({globalErrorTextKey: errorMessageKey})
    }

    protected onErrorFireEvent(body: (f: Function) => void,
                               event: Function) {
        this.onErrorEvent = event
        body(() => {
            this.onErrorEvent = () => {}
        })
    }

    public executeLoadable(loadingFunction: (f: Function) => void, loadingProperty: keyof StateType) {
        const setLoading = (value: boolean) => this.store.setState(CommonUtils.createLooseObject<StateType>([[loadingProperty, value]]))
        setLoading(true)
        this.onErrorFireEvent((callback: Function) => {
                loadingFunction(() => {
                    setLoading(false)
                    callback()
                })
            },
            () => setLoading(false)
        )
    }

    public abstract handleUnauthorizedUserSituation(): void

    public abstract getDialogSubmitButtonPropertyName(): keyof StateType

    public setDialogButtonLoading(value: boolean): void {
        const submitButtonProperty = this.getDialogSubmitButtonPropertyName()
        this.store.setState(CommonUtils.createLooseObject<StateType>([[submitButtonProperty, value]]))
    }

    public batched(executableBody: Function) {
        this.store.batched(executableBody)
    }

    public setError(messageKey: string): void {

    }
}