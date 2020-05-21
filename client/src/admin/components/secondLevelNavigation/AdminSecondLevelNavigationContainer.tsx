import * as React from "react";
import AdminAppController from "../../controller/AdminAppController";
import {SecondLevelNavigationMenuType} from "../../state/enum/SecondLevelNavigationMenuType";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import DictionariesNavigationMenu from "./dictionaries/DictionariesNavigationMenu";
import EmployeeAppController from "../../controller/EmployeeAppController";

export class AdminSecondLevelNavigationContainer extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)

        this.state = {
            currentMenu: SecondLevelNavigationMenuType.None
        }
    }

    render() {
        return (
            <div>
                {this.state.currentMenu == SecondLevelNavigationMenuType.Dictionaries
                && (<DictionariesNavigationMenu controller={this.props.controller}/>)}
            </div>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            secondLevelNavigationMenuType: "currentMenu",
        })
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {
    currentMenu: SecondLevelNavigationMenuType
}
