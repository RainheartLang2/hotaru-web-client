import {MenuItem, Tab, Tabs} from "@material-ui/core";
import * as React from "react";
import {NavigationMenuItemType} from "../../state/enum/NavigationMenuItemType";
import {Message} from "../../../core/components/Message";
import Menu from "@material-ui/core/Menu";
import EmployeeAppController from "../../controller/EmployeeAppController";

var styles = require("./styles.css");

export default class NavigationMenu extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            selectedItem: NavigationMenuItemType.None,
        }
    }

    render() {
        return (
            <Tabs
                variant="fullWidth"
                value={this.state.selectedItem}
                classes={{indicator: styles.indicator}}
            >
                <Tab
                    label={<Message messageKey={"navigationMenu.schedule.title"}/>}
                    value={NavigationMenuItemType.Schedule}
                    onClick={() => this.props.controller.openSchedulePage()}
                />
                <Tab
                    label={<Message messageKey={"navigationMenu.clients.title"}/>}
                    value={NavigationMenuItemType.ClientsList}
                    onClick={() => this.props.controller.openClientsPage()}
                />
                <Tab
                    label={<Message messageKey={"navigationMenu.calls.title"}/>}
                    value={NavigationMenuItemType.Calls}
                    onClick={() => this.props.controller.openCallsPage()}
                />
            </Tabs>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            navigationMenuItemType: "selectedItem",
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
    selectedItem: NavigationMenuItemType
}