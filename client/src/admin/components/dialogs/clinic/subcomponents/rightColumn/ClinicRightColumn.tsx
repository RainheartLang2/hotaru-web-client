import * as React from "react";
import AdminAppController from "../../../../../controller/AdminAppController";
import {AdminStateProperty} from "../../../../../state/AdminApplicationState";
import {Message} from "../../../../../../core/components/Message";
import ConnectedTextField from "../../../../../../core/components/conntectedTextField/ConnectedTextField";
import LabeledSwitch from "../../../../../../core/components/labeledSwitch/LabeledSwitch";
import {ReactNode} from "react";

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
    controller: AdminAppController,
    active: boolean,
    showActiveSwitch: boolean,
}