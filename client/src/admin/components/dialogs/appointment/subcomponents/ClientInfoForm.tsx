import * as React from "react";
import ConnectedTextField from "../../../../../core/components/conntectedTextField/ConnectedTextField";
import AdminAppController from "../../../../controller/AdminAppController";
import {AdminStateProperty} from "../../../../state/AdminApplicationState";
import {Message} from "../../../../../core/components/Message";

const styles = require("../styles.css");

export default class ClientInfoForm extends React.Component<Properties> {
    render() {
        return (<>
            <div className={styles.row}>
                <div className={styles.nameField}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={AdminStateProperty.EditedClientInfoLastName}
                        label={<Message messageKey={"dialog.appointment.field.lastName.label"}/>}
                    />
                </div>
                <div className={styles.nameField}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={AdminStateProperty.EditedClientInfoFirstName}
                        label={<Message messageKey={"dialog.appointment.field.firstName.label"}/>}
                    />
                </div>
                <div className={styles.nameField}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={AdminStateProperty.EditedClientInfoMiddleName}
                        label={<Message messageKey={"dialog.appointment.field.middleName.label"}/>}
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={"addressField"}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={AdminStateProperty.EditedClientInfoPhone}
                        label={<Message messageKey={"dialog.appointment.field.phone.label"}/>}
                    />
                </div>
                <div className={"addressField"}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={AdminStateProperty.EditedClientInfoMail}
                        label={<Message messageKey={"dialog.appointment.field.email.label"}/>}
                    />
                </div>
                <div className={"addressField"}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={AdminStateProperty.EditedClientInfoAddress}
                        label={<Message messageKey={"dialog.appointment.field.address.label"}/>}
                    />
                </div>
            </div>
        </>)
    }
}

type Properties = {
    controller: AdminAppController,
}