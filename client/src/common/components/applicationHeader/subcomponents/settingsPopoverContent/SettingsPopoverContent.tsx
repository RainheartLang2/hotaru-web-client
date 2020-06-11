import EmployeeAppController from "../../../../../admin/controller/EmployeeAppController";
import * as React from "react";
import {MenuItem} from "@material-ui/core";
import {Message} from "../../../../../core/components/Message";

export default class SettingsPopoverContent extends React.Component<Properties> {
    render() {
        return (
            <>
                <MenuItem onClick={() => {
                    this.props.onAnyMenuItemClick()
                    this.props.controller.openGlobalSettings()
                }}>
                    <Message messageKey={"navigationMenu.settings.dialog.global"}/>
                </MenuItem>
                <MenuItem onClick={() => {
                    this.props.onAnyMenuItemClick()
                    this.props.controller.openLocalePage()
                }}>
                    <Message messageKey={"navigationMenu.settings.dialog.locale"}/>
                </MenuItem>
                <MenuItem onClick={() => {
                    this.props.onAnyMenuItemClick()
                    this.props.controller.openClinicsManagement()
                }}>
                    <Message messageKey={"navigationMenu.settings.dialog.clinics"}/>
                </MenuItem>
                <MenuItem onClick={() => {
                    this.props.onAnyMenuItemClick()
                    this.props.controller.openAccessPage()
                }}>
                    <Message messageKey={"navigationMenu.settings.dialog.access"}/>
                </MenuItem>
                <MenuItem onClick={() => {
                    this.props.onAnyMenuItemClick()
                    this.props.controller.openUserListPage()
                }}>
                    <Message messageKey={"navigationMenu.settings.dialog.employee"}/>
                </MenuItem>
                <MenuItem onClick={() => {
                    this.props.onAnyMenuItemClick()
                    this.props.controller.openDictionaries()
                }}>
                    <Message messageKey={"navigationMenu.settings.dialog.dictionaries"}/>
                </MenuItem>
            </>
        )
    }
}

type Properties = {
    controller: EmployeeAppController
    onAnyMenuItemClick: Function
}
