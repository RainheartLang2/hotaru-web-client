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
            settingsMenuAnchor: null,
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
                <Tab
                    label={<Message messageKey={"navigationMenu.clients.title"}/>}
                    value={NavigationMenuItemType.ClientsList}
                    onClick={() => this.props.controller.openClientsPage()}
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
        this.props.controller.subscribe(this, {
            secondLevelNavigationMenuType: "selectedItem",
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
    settingsMenuAnchor: Element | null
}