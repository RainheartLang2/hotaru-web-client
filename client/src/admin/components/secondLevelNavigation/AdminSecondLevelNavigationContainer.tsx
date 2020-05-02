import * as React from "react";
import AdminAppController from "../../controller/AdminAppController";
import {SecondLevelNavigationMenuType} from "../../state/enum/SecondLevelNavigationMenuType";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import DictionariesNavigationMenu from "./dictionaries/DictionariesNavigationMenu";

export class AdminSecondLevelNavigationContainer extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)

        this.state = {
            [StateProperty.CurrentMenu]: SecondLevelNavigationMenuType.None
        }
    }

    render() {
        const currentMenu = this.state[StateProperty.CurrentMenu]
        return (
            <div>
                {currentMenu == SecondLevelNavigationMenuType.Dictionaries
                && (<DictionariesNavigationMenu controller={this.props.controller}/>)}
            </div>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(AdminStateProperty.SecondLevelNavigationMenuType, this, StateProperty.CurrentMenu)
    }
}

enum StateProperty {
    CurrentMenu = "currentMenu"
}

type Properties = {
    controller: AdminAppController
}

type State = {
    [StateProperty.CurrentMenu]: SecondLevelNavigationMenuType
}
