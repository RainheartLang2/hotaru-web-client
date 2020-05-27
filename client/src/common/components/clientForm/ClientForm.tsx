import EmployeeAppController from "../../../admin/controller/EmployeeAppController";
import {EmployeeAppSelectors, EmployeeAppState} from "../../../admin/state/EmployeeApplicationStore";
import EmployeeApplicationStore from "../../../admin/state/EmployeeApplicationStore";
import {Message} from "../../../core/components/Message";
import * as React from "react";
import ConnectedTextField from "../../../core/components/conntectedTextField/ConnectedTextField";

export default class ClientForm extends React.Component<Properties> {
    render() {
        return (
            <>
                <div className={this.props.rowStyle}>
                    <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedClientName: "editedClientNameField"}}
                        label={(<Message messageKey={"dialog.client.field.name.label"}/>)}
                        required={true}
                        size="small"
                        fullWidth={true}
                    />
                </div>
                <div className={this.props.rowStyle}>
                    <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedClientPhone: "editedClientPhoneField"}}
                        label={(<Message messageKey={"dialog.client.field.phone.label"}/>)}
                        required={true}
                        size="small"
                        fullWidth={true}
                        mask={"+7(???)-???-??-??"}
                    />
                </div>
                <div className={this.props.rowStyle}>
                    <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedClientMail: "editedClientMailField"}}
                        label={(<Message messageKey={"dialog.client.field.mail.label"}/>)}
                        required={true}
                        size="small"
                        fullWidth={true}
                    />
                </div>
                <div className={this.props.rowStyle}>
                    <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedClientAddress: "editedClientAddressField"}}
                        label={(<Message messageKey={"dialog.client.field.address.label"}/>)}
                        required={true}
                        size="small"
                        fullWidth={true}
                    />
                </div>
            </>
        )
    }
}

type Properties = {
    controller: EmployeeAppController,
    rowStyle: string,
}