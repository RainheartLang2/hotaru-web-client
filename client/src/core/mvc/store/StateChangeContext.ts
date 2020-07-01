import ApplicationStore, {DefaultStateType} from "./ApplicationStore";
import ApplicationStoreFriend from "./ApplicationStoreFriend";
import {CollectionUtils} from "../../utils/CollectionUtils";

export default class StateChangeContext<StateType extends DefaultStateType = DefaultStateType, SelectorsType = any> {
    private mode: StateChangeContextMode
    private store: ApplicationStoreFriend<StateType, SelectorsType>
    private stateChanges: Map<React.Component, any>
    private changedSelectors: (keyof SelectorsType)[]

    constructor(store: ApplicationStoreFriend<StateType, SelectorsType>, mode = StateChangeContextMode.AUTO) {
        this.store = store
        this.mode = mode
        this.changedSelectors = []
        this.stateChanges = new Map()
    }

    public getMode(): StateChangeContextMode {
        return this.mode
    }

    public setState(component: React.Component, state: any): void {
        let componentData = this.stateChanges.get(component)
        if (!componentData) {
            componentData = {}
        }
        for (let key in state) {
            componentData[key] = state[key]
        }
        this.stateChanges.set(component, componentData)
    }

    public addChangedSelectors(selectors: (keyof SelectorsType)[]) {
        this.changedSelectors = this.changedSelectors.concat(selectors)
    }

    private commitChanges(): void {
        this.store.recalculateSelectors(CollectionUtils.getDistinct(this.changedSelectors), this)
        this.stateChanges.forEach((state: any, component: React.Component) => {
            component.setState(state)
            this.stateChanges.delete(component)
        })
    }

    public onSetState(): void {
        if (this.mode == StateChangeContextMode.AUTO) {
            this.commitChanges()
        }
    }

    public closeBatch(): void {
        if (this.mode == StateChangeContextMode.BATCHED) {
            this.commitChanges()
        }
    }
}

export enum StateChangeContextMode {
    AUTO,
    BATCHED,
}
