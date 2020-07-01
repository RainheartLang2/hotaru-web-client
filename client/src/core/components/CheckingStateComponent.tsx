import * as React from "react";

export default abstract class CheckingStateComponent<Properties, State> extends React.Component<Properties, State> {

    shouldComponentUpdate(nextProps: Readonly<Properties>, nextState: Readonly<State>, nextContext: any): boolean {
        for (let key in this.state) {
            if (this.state[key] != nextState[key]) {
                return true
            }
        }
        return false
    }
}