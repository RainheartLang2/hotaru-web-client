import * as React from "react";
import LeftMenu, {LeftMenuEntry} from "../../../../../core/components/leftMenu/LeftMenu";
import {Message} from "../../../../../core/components/Message";
import EmployeeAppController from "../../../../controller/EmployeeAppController";
import {EmployeeManagementMenuItemType} from "../../../../state/enum/EmployeeManagementMenuItemType";

export default class EmployeesManagementLeftMenu extends React.Component<Properties> {
    private entries: LeftMenuEntry[]

    constructor(props: Properties) {
        super(props)
        this.entries = [
            {
                key: EmployeeManagementMenuItemType.EmployeeList,
                label: <Message messageKey={"second.navigation.employeesManagement.employeesList.label"}/>,
                onClick: () => this.props.controller.openUserListPage(),
            },
            {
                key: EmployeeManagementMenuItemType.WorkSchedule,
                label: <Message messageKey={"second.navigation.employeesManagement.workSchedule.label"}/>,
                onClick: () => this.props.controller.openEmployeeWorkSchedule()
            }
        ]
    }

    render() {
        return (
            <LeftMenu entries={this.entries} selectedEntryKey={this.props.selectedEntryKey}/>
        )
    }
}

type Properties = {
    controller: EmployeeAppController
    selectedEntryKey: number | null
}