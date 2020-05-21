import * as React from "react";
import {ReactNode} from "react";
import {Message} from "../../../../../../core/components/Message";
import LabeledSwitch from "../../../../../../core/components/labeledSwitch/LabeledSwitch";
import EmployeeAppController from "../../../../../controller/EmployeeAppController";
import EmployeeApplicationStore, {
    EmployeeAppSelectors,
    EmployeeAppState
} from "../../../../../state/EmployeeApplicationStore";
import TypedConnectedTextField from "../../../../../../core/components/conntectedTextField/TypedConnectedTextField";

var styles = require("../../styles.css")

export default class ClinicRightColumn extends React.Component<Properties> {
    private getActiveSwitch(): ReactNode {
        return (
            <div className={styles.row}>
                <LabeledSwitch
                    active={this.props.active}
                    onChange={(event, checked) => this.props.controller.clinicActions.toggleClinicActivity(checked)}
                    activeLabelKey={"dialog.clinic.active.label"}
                    notActiveLabelKey={"dialog.clinic.notActive.label"}
                />
            </div>
        )
    }

    render() {
        return (<>
            {this.props.showActiveSwitch
                ? this.getActiveSwitch()
                : ""}
            <div className={styles.row}>
                <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                    controller={this.props.controller}
                    fieldKey={{editedClinicPhone:"editedClinicPhoneField"}}
                    label={(<Message messageKey={"dialog.clinic.phone.label"}/>)}
                    required={true}
                    size="small"
                    fullWidth={true}
                />
            </div>
            <div className={styles.row}>
                <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                    controller={this.props.controller}
                    fieldKey={{editedClinicEmail: "editedClinicEmailField"}}
                    label={(<Message messageKey={"dialog.clinic.email.label"}/>)}
                    required={true}
                    size="small"
                    fullWidth={true}
                />
            </div>
        </>)
    }
}

export type Properties = {
    controller: EmployeeAppController,
    active: boolean,
    showActiveSwitch: boolean,
}