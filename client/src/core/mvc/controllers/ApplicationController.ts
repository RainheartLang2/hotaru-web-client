import ApplicationStore, {DefaultStateType, PropertyAliasInfo} from "../store/ApplicationStore";
import {CommonUtils} from "../../utils/CommonUtils";
import StateChangeContext, {StateChangeContextMode} from "../store/StateChangeContext";

export default abstract class ApplicationController<StateType extends DefaultStateType = any,
                                                SelectorsType = any,
                                                StoreType extends ApplicationStore<StateType, SelectorsType> = any> {

    protected store: StoreType
    private context?: StateChangeContext<StateType, SelectorsType>
    private onErrorEvent: Function = () => {}

    constructor(store: StoreType) {
        this.store = store
    }

    public subscribe<CProps, CState>(subscriber: React.Component<CProps, CState>,
                                     aliasInfo: Partial<PropertyAliasInfo<StateType & SelectorsType, CState>>): void {
        this.store.subscribe(subscriber, aliasInfo)
    }

    public get state(): Readonly<StateType & SelectorsType> {
        return this.store.state
    }

    public unsubscribe(subscriber: React.Component): void {
        this.store.unsubscribe(subscriber)
    }

    public setState(newState: Partial<StateType>): void {
        this.store.setState(newState, this.context)
    }

    public toggleFieldValidation(fieldKey: keyof SelectorsType, value: boolean) {
        this.store.toggleFieldValidation(fieldKey, value, this.context)
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

    public batched(executableBody: (closeBatch: Function) => void) {
        // this.context = new StateChangeContext(StateChangeContextMode.BATCHED)
        // executableBody(() => {
        //     console.log("closeBatch")
        //     if (!this.context) {
        //         throw new Error("context is undefined inside of batch")
        //     }
        //     this.context.onBatchClose()
        //     this.context = undefined
        // })
        executableBody(() => {})
    }

    public setError(messageKey: string): void {

    }
}