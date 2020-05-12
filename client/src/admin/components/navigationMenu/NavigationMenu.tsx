import {MenuItem, Tab, Tabs} from "@material-ui/core";
import * as React from "react";
import {NavigationMenuItemType} from "../../state/enum/NavigationMenuItemType";
import AdminAppController from "../../controller/AdminAppController";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import {Message} from "../../../core/components/Message";
import Menu from "@material-ui/core/Menu";

var styles = require("./styles.css");

export default class NavigationMenu extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            [StateProperty.SelectedItem]: NavigationMenuItemType.None,
            settingsMenuAnchor: null,
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
                    value={NavigationMenuItemType.UserList}
                    onClick={() => this.props.controller.openUserListPage()}
                />
                <Tab
                    label={<Message messageKey={"navigationMenu.clinics.title"}/>}
                    value={NavigationMenuItemType.ClinicList}
                    onClick={() => this.props.controller.openClinicListPage()}
                />
                <Tab
                    label={<Message messageKey={"navigationMenu.schedule.title"}/>}
                    value={NavigationMenuItemType.Schedule}
                    onClick={() => this.props.controller.openSchedulePage()}
                />
                <Tab
                    label={<Message messageKey={"navigationMenu.settings.title"}/>}
                    value={NavigationMenuItemType.SettingsMenu}
                    onClick={(event) => this.setState({settingsMenuAnchor: event.currentTarget})}
                />
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
        this.props.controller.subscribe(AdminStateProperty.NavigationMenuItemType, this, StateProperty.SelectedItem)
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

enum StateProperty {
    SelectedItem = "selectedItem",
}

type Properties = {
    controller: AdminAppController
}

type State = {
    [StateProperty.SelectedItem]: NavigationMenuItemType
    settingsMenuAnchor: Element | null
}