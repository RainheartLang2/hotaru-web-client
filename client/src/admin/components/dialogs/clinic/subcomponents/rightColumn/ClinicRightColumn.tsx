import * as React from "react";
import AdminAppController from "../../../../../controller/AdminAppController";
import {AdminStateProperty} from "../../../../../state/AdminApplicationState";
import {Message} from "../../../../../../core/components/Message";
import ConnectedTextField from "../../../../../../core/components/conntectedTextField/ConnectedTextField";

var styles = require("../../styles.css")

export default class ClinicRightColumn extends React.Component<Properties> {
    render() {
        return (<>
            <div className={styles.row}>
                <ConnectedTextField
                    controller={this.props.controller}
                    fieldPropertyName={AdminStateProperty.EditedClinicPhone}
                    label={(<Message messageKey={"dialog.clinic.phone.label"}/>)}
                    required={true}
                    size="small"
                    fullWidth={true}
                />
            </div>
            <div className={styles.row}>
                <ConnectedTextField
                    controller={this.props.controller}
                    fieldPropertyName={AdminStateProperty.EditedClinicEmail}
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
    controller: AdminAppController
}