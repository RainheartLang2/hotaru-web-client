import {MenuItem, Tab, Tabs} from "@material-ui/core";
import * as React from "react";
import {NavigationMenuType} from "../../state/NavigationMenuType";
import AdminAppController from "../../controller/AdminAppController";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import {Message} from "../../../core/components/Message";
import Menu from "@material-ui/core/Menu";

var styles = require("./styles.css");

export default class NavigationMenu extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            [StateProperty.SelectedItem]: NavigationMenuType.None,
            settingsMenuAnchor: null,
        }
    }

    render() {
        console.log(this.state.settingsMenuAnchor)
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
                <Tab
                    label={<Message messageKey={"navigationMenu.settings.title"}/>}
                    value={NavigationMenuType.Settings}
                    onClick={(event) => {
                        console.log(event.currentTarget)
                        this.setState({settingsMenuAnchor: event.currentTarget})}
                    }
                >
                </Tab>
                <Menu
                    open={!!this.state.settingsMenuAnchor}
                    anchorEl={this.state.settingsMenuAnchor}
                    onClose={() => this.setState({settingsMenuAnchor: null})}
                    keepMounted
                >
                    <MenuItem onClick={() => {
                        this.setState({settingsMenuAnchor: null})
                        this.props.controller.openSettings()
                    }}>
                        <Message messageKey={"navigationMenu.settings.dialog.dictionaries"}/>
                    </MenuItem>
                </Menu>
            </Tabs>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(AdminStateProperty.NavigationMenuType, this, StateProperty.SelectedItem)
    }
}

enum StateProperty {
    SelectedItem = "selectedItem",
}

type Properties = {
    controller: AdminAppController
}

type State = {
    [StateProperty.SelectedItem]: NavigationMenuType
    settingsMenuAnchor: Element | null
}