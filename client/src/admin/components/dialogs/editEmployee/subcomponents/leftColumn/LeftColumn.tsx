import * as React from "react";
import {AdminStateProperty} from "../../../../../state/AdminApplicationState";
import {Message} from "../../../../../../core/components/Message";
import ConnectedTextField from "../../../../../../core/components/conntectedTextField/ConnectedTextField";
import CredentialsSection from "../credentialsSection/CredentialsSection";
import AdminAppController from "../../../../../controller/AdminAppController";

export default class LeftColumn extends React.Component<Properties> {
    render() {
        return (
            <>
                <div className={this.props.rowStyle}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={AdminStateProperty.EditedEmployeeLastName}
                        label={(<Message messageKey={"dialog.employee.field.lastName.label"}/>)}
                        required={true}
                        size="small"
                        fullWidth={true}
                    />
                </div>
                <div className={this.props.rowStyle}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={AdminStateProperty.EditedEmployeeFirstName}
                        label={(<Message messageKey={"dialog.employee.field.firstName.label"}/>)}
                        required={true}
                        size="small"
                        fullWidth={true}
                    />
                </div>
                <div className={this.props.rowStyle}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={AdminStateProperty.EditedEmployeeMiddleName}
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
    controller: AdminAppController,
    rowStyle: string,
}