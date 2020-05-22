import * as React from "react";
import {Message} from "../../../../../../core/components/Message";
import CredentialsSection from "../credentialsSection/CredentialsSection";
import EmployeeAppController from "../../../../../controller/EmployeeAppController";
import TypedConnectedTextField from "../../../../../../core/components/conntectedTextField/TypedConnectedTextField";
import EmployeeApplicationStore, {EmployeeAppSelectors, EmployeeAppState} from "../../../../../state/EmployeeApplicationStore";

export default class LeftColumn extends React.Component<Properties> {
    render() {
        return (
            <>
                <div className={this.props.rowStyle}>
                    <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedEmployeeLastName: "editedEmployeeLastNameField"}}
                        label={(<Message messageKey={"dialog.employee.field.lastName.label"}/>)}
                        required={true}
                        size="small"
                        fullWidth={true}
                    />
                </div>
                <div className={this.props.rowStyle}>
                    <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedEmployeeFirstName: "editedEmployeeFirstNameField"}}
                        label={(<Message messageKey={"dialog.employee.field.firstName.label"}/>)}
                        required={true}
                        size="small"
                        fullWidth={true}
                    />
                </div>
                <div className={this.props.rowStyle}>
                    <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedEmployeeMiddleName: "editedEmployeeMiddleNameField"}}
                        label={(<Message messageKey={"dialog.employee.field.middleName.label"}/>)}
                        size="small"
                        fullWidth={true}
                    />
                </div>
                <CredentialsSection controller={this.props.controller}/>
            </>
        )
    }
}

export type Properties = {
    controller: EmployeeAppController,
    rowStyle: string,
}