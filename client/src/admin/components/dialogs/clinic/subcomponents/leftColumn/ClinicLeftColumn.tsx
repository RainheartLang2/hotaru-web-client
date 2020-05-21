import * as React from "react";
import {Message} from "../../../../../../core/components/Message";
import EmployeeAppController from "../../../../../controller/EmployeeAppController";
import TypedConnectedTextField from "../../../../../../core/components/conntectedTextField/TypedConnectedTextField";
import EmployeeApplicationStore, {
    EmployeeAppSelectors,
    EmployeeAppState
} from "../../../../../state/EmployeeApplicationStore";

var styles = require("../../styles.css")

export default class ClinicLeftColumn extends React.Component<Properties> {
    render() {
        return (<>
            <div className={styles.row}>
                <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                    controller={this.props.controller}
                    fieldKey={{editedClinicName: "editedClinicNameField"}}
                    label={(<Message messageKey={"page.clinics.name.title"}/>)}
                    required={true}
                    size="small"
                    fullWidth={true}
                />
            </div>
            <div className={styles.row}>
                <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                    controller={this.props.controller}
                    fieldKey={{editedClinicSiteUrl: "editedClinicSiteUrlField"}}
                    label={(<Message messageKey={"dialog.clinic.siteUrl.label"}/>)}
                    required={true}
                    size="small"
                    fullWidth={true}
                />
            </div>
            <div className={styles.row}>
                <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                    controller={this.props.controller}
                    fieldKey={{editedClinicCity: "editedClinicCityField"}}
                    label={(<Message messageKey={"dialog.clinic.city.label"}/>)}
                    required={true}
                    size="small"
                    fullWidth={true}
                />
            </div>
            <div className={styles.row}>
                <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                    controller={this.props.controller}
                    fieldKey={{editedClinicAddress: "editedClinicAddressField"}}
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
    controller: EmployeeAppController
}