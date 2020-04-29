import {Tab, Tabs} from "@material-ui/core";
import * as React from "react";
import {NavigationMenuType} from "../../state/NavigationMenuType";
import AdminAppController from "../../controller/AdminAppController";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import {Message} from "../../../core/components/Message";

var styles = require("./styles.css");

export default class NavigationMenu extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            [StateProperty.SelectedItem]: NavigationMenuType.None,
        }
    }

    render() {
        return (
            <Tabs
                variant="fullWidth"
                value={this.state[StateProperty.SelectedItem]}
                classes={{indicator: styles.indicator}}
            >
                <Tab
                    label={<Message messageKey={"navigationMenu.employees.title"}/>}
                    value={NavigationMenuType.UserList}
                    onClick={() => this.props.controller.openUserListPage()}
                />
                <Tab
                    label={<Message messageKey={"navigationMenu.clinics.title"}/>}
                    value={NavigationMenuType.ClinicList}
                    onClick={() => this.props.controller.openClinicListPage()}
                />
                <Tab
                    label={<Message messageKey={"navigationMenu.schedule.title"}/>}
                    value={NavigationMenuType.Schedule}
                    onClick={() => this.props.controller.openSchedulePage()}
                />
            </Tabs>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(AdminStateProperty.NavigationMenuType, this, StateProperty.SelectedItem)
    }
}

enum StateProperty {
    SelectedItem = "selectedItem"
}

type Properties = {
    controller: AdminAppController
}

type State = {
    [StateProperty.SelectedItem]: NavigationMenuType
}