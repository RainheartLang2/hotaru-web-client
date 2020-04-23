import * as React from "react";
import {AdminStateProperty} from "../../../../../state/AdminApplicationState";
import {Message} from "../../../../../../core/components/Message";
import ConnectedTextField from "../../../../../../core/components/conntectedTextField/ConnectedTextField";
import AdminAppController from "../../../../../controller/AdminAppController";
import UserActiveSwitch from "../userActiveSwitch/UserActiveSwitch";

export default class RightColumn extends React.Component<Properties> {
    render() {
        const styles = this.props.styles
        return (
            <>
                {this.props.showActiveSwitch
                    ? (
                        <div className={styles.row}>
                            <div className={styles.activeSwitchWrapper}>
                                <UserActiveSwitch
                                    active={this.props.userActive}
                                    onChange={(event) => this.props.setUserActive(event.target.checked)}
                                />
                            </div>
                        </div>
                    )
                    : ""
                }
                <div className={styles.row}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={AdminStateProperty.EditedEmployeePhone}
                        label={(<Message messageKey="dialog.employee.field.phone.label"/>)}
                    />
                </div>
                <div className={styles.row}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={AdminStateProperty.EditedEmployeeEmail}
                        label={(<Message messageKey="dialog.employee.field.email.label"/>)}
                    />
                </div>
                <div className={styles.row}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        fieldPropertyName={AdminStateProperty.EditedEmployeeAddress}
                        label={(<Message messageKey="dialog.employee.field.address.label"/>)}
                        rows={3}
                    />
                </div>
            </>
        )
    }
}

type Properties = {
    controller: AdminAppController,
    showActiveSwitch: boolean,
    userActive: boolean,
    setUserActive: (value: boolean) => void,
    styles: any,
}