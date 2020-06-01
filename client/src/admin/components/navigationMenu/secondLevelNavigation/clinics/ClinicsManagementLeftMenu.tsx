import * as React from "react";
import EmployeeAppController from "../../../../controller/EmployeeAppController";
import LeftMenu, {LeftMenuEntry} from "../../../../../core/components/leftMenu/LeftMenu";
import {Message} from "../../../../../core/components/Message";
import {ClinicsManagementMenuItemType} from "../../../../state/enum/ClinicsManagementMenuItemType";

export default class ClinicsManagementLeftMenu extends React.Component<Properties> {
    private entries: LeftMenuEntry[]

    constructor(props: Properties) {
        super(props)
        this.entries = [
            {
                key: ClinicsManagementMenuItemType.ClinicList,
                label: <Message messageKey={"second.navigation.clinicsManagement.clinicsList.label"}/>,
                onClick: () => this.props.controller.openClinicListPage(),
            },
            {
                key: ClinicsManagementMenuItemType.WorkSchedule,
                label: <Message messageKey={"second.navigation.clinicsManagement.workSchedule.label"}/>,
                onClick: () => this.props.controller.openClinicsWorkschedule()
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