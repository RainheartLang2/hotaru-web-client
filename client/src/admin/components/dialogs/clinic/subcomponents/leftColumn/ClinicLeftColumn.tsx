import * as React from "react";
import ConnectedTextField from "../../../../../../core/components/conntectedTextField/ConnectedTextField";
import AdminAppController from "../../../../../controller/AdminAppController";
import {AdminStateProperty} from "../../../../../state/AdminApplicationState";
import {Message} from "../../../../../../core/components/Message";

var styles = require("../../styles.css")

export default class ClinicLeftColumn extends React.Component<Properties> {
    render() {
        return (<>
            <div className={styles.row}>
                <ConnectedTextField
                    controller={this.props.controller}
                    fieldPropertyName={AdminStateProperty.EditedClinicName}
                    label={(<Message messageKey={"page.clinics.name.title"}/>)}
                    required={true}
                    size="small"
                    fullWidth={true}
                />
            </div>
            <div className={styles.row}>
                <ConnectedTextField
                    controller={this.props.controller}
                    fieldPropertyName={AdminStateProperty.EditedClinicSiteUrl}
                    label={(<Message messageKey={"dialog.clinic.siteUrl.label"}/>)}
                    required={true}
                    size="small"
                    fullWidth={true}
                />
            </div>
            <div className={styles.row}>
                <ConnectedTextField
                    controller={this.props.controller}
                    fieldPropertyName={AdminStateProperty.EditedClinicCity}
                    label={(<Message messageKey={"dialog.clinic.city.label"}/>)}
                    required={true}
                    size="small"
                    fullWidth={true}
                />
            </div>
            <div className={styles.row}>
                <ConnectedTextField
                    controller={this.props.controller}
                    fieldPropertyName={AdminStateProperty.EditedClinicAddress}
                    label={(<Message messageKey={"dialog.clinic.address.label"}/>)}
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