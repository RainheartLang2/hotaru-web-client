import * as React from "react";
import {Message} from "../../../../../core/components/Message";
import PetInfoForm from "./PetInfoForm";
import EmployeeAppController from "../../../../controller/EmployeeAppController";
import ConnectedTextField from "../../../../../core/components/conntectedTextField/ConnectedTextField";
import EmployeeApplicationStore, {EmployeeAppSelectors, EmployeeAppState} from "../../../../state/EmployeeApplicationStore";

const styles = require("../styles.css");

export default class ClientInfoForm extends React.Component<Properties> {
    render() {
        return (<>
            <div className={styles.row}>
                <div className={styles.nameField}>
                    <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedClientInfoFirstName: "editedClientInfoFirstNameField"}}
                        label={<Message messageKey={"dialog.appointment.field.firstName.label"}/>}
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={"addressField"}>
                    <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedClientInfoPhone: "editedClientInfoPhoneField"}}
                        label={<Message messageKey={"dialog.appointment.field.phone.label"}/>}
                    />
                </div>
                <div className={"addressField"}>
                    <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedClientInfoMail: "editedClientInfoMailField"}}
                        label={<Message messageKey={"dialog.appointment.field.email.label"}/>}
                    />
                </div>
                <div className={"addressField"}>
                    <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedClientInfoAddress: "editedClientInfoAddressField"}}
                        label={<Message messageKey={"dialog.appointment.field.address.label"}/>}
                    />
                </div>
            </div>
            <PetInfoForm controller={this.props.controller}/>
        </>)
    }
}

type Properties = {
    controller: EmployeeAppController,
}