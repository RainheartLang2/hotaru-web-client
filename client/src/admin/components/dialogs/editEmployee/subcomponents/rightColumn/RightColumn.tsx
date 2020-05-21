import * as React from "react";
import {Message} from "../../../../../../core/components/Message";
import UserActiveSwitch from "../userActiveSwitch/UserActiveSwitch";
import {Clinic} from "../../../../../../common/beans/Clinic";
import EmployeeAppController from "../../../../../controller/EmployeeAppController";
import EmployeeApplicationStore, {
    EmployeeAppSelectors,
    EmployeeAppState
} from "../../../../../state/EmployeeApplicationStore";
import TypedConnectedTextField from "../../../../../../core/components/conntectedTextField/TypedConnectedTextField";
import TypedConnectedSelect from "../../../../../../core/components/ConnectedSelect/TypedConnectedSelect";

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
                    <div className={styles.selector}>
                        <TypedConnectedSelect<Clinic, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                            controller={this.props.controller}
                            label={<Message messageKey={"dialog.employee.field.clinic"}/>}
                            mapProperty={"clinicListByIdWithMock"}
                            selectedItemProperty={"editedEmployeeClinic"}
                            itemToString={(clinic: Clinic | null) => clinic && clinic.name ? clinic.name : ""}
                            getKey={clinic => clinic && clinic.id ? clinic.id : 0}
                        />
                    </div>
                </div>
                <div className={styles.row}>
                    <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedEmployeePhone: "editedEmployeePhoneField"}}
                        label={(<Message messageKey="dialog.employee.field.phone.label"/>)}
                    />
                </div>
                <div className={styles.row}>
                    <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedEmployeeMail: "editedEmployeeMailField"}}
                        label={(<Message messageKey="dialog.employee.field.email.label"/>)}
                    />
                </div>
                <div className={styles.row}>
                    <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedEmployeeAddress: "editedEmployeeAddressField"}}
                        label={(<Message messageKey="dialog.employee.field.address.label"/>)}
                        rows={3}
                    />
                </div>
            </>
        )
    }
}

type Properties = {
    controller: EmployeeAppController,
    showActiveSwitch: boolean,
    userActive: boolean,
    setUserActive: (value: boolean) => void,
    styles: any,
}