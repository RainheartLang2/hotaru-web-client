import * as React from "react";
import {AdminStateProperty} from "../../../../../state/AdminApplicationState";
import {Message} from "../../../../../../core/components/Message";
import ConnectedTextField from "../../../../../../core/components/conntectedTextField/ConnectedTextField";
import CredentialsSection from "../credentialsSection/CredentialsSection";
import AdminAppController from "../../../../../controller/AdminAppController";
import EmployeeAppController from "../../../../../controller/EmployeeAppController";
import TypedConnectedTextField from "../../../../../../core/components/conntectedTextField/TypedConnectedTextField";
import EmployeeApplicationStore, {EmployeeSelectors, EmployeeState} from "../../../../../state/EmployeeApplicationStore";

export default class LeftColumn extends React.Component<Properties> {
    render() {
        return (
            <>
                <div className={this.props.rowStyle}>
                    <TypedConnectedTextField<EmployeeState, EmployeeSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedEmployeeLastName: "editedEmployeeLastNameField"}}
                        label={(<Message messageKey={"dialog.employee.field.lastName.label"}/>)}
                        required={true}
                        size="small"
                        fullWidth={true}
                    />
                </div>
                <div className={this.props.rowStyle}>
                    <TypedConnectedTextField<EmployeeState, EmployeeSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedEmployeeFirstName: "editedEmployeeFirstNameField"}}
                        label={(<Message messageKey={"dialog.employee.field.firstName.label"}/>)}
                        required={true}
                        size="small"
                        fullWidth={true}
                    />
                </div>
                <div className={this.props.rowStyle}>
                    <TypedConnectedTextField<EmployeeState, EmployeeSelectors, EmployeeApplicationStore>
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