import ApplicationStore, {DefaultStateType} from "./ApplicationStore";

export default class StateChangeContext {
    private mode: StateChangeContextMode
    private stateChanges: Map<React.Component, any>

    constructor(mode = StateChangeContextMode.AUTO) {
        this.mode = mode
        this.stateChanges = new Map()
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

    private commitChanges(): void {
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

    public onBatchClose(): void {
        if (this.mode == StateChangeContextMode.BATCHED) {
            this.commitChanges()
        }
    }
}

export enum StateChangeContextMode {
    AUTO,
    BATCHED,
}
