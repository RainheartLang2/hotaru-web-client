import * as React from "react";
import AdminAppController from "../../../controller/AdminAppController";
import {ConfigureDialogType} from "../../../../core/types/ConfigureDialogType";
import {DialogContent, DialogTitle} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import {AdminStateProperty} from "../../../state/AdminApplicationState";
import ClientInfoForm from "./subcomponents/ClientInfoForm";
import ConnectedCheckbox from "../../../../core/components/connectedCheckbox/ConnectedCheckbox";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import TypedConnectedTextField from "../../../../core/components/conntectedTextField/TypedConnectedTextField";
import EmployeeApplicationStore, {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";

const styles = require("./styles.css");

export default class AppointmentDialog extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)

        this.state = {
            mode: 'none',
            hasErrors: false,
            showClientInfoForm: false,
        }
    }

    private getTitleMessageKey(): string {
        switch (this.state.mode) {
            case "create":
                return "dialog.appointment.create.label"
            case "edit":
                return "dialog.appointment.edit.label"
            default:
                return "dialog.appointment.create.label"
        }
    }

    private onSubmitClick(): void {
        if (this.state.mode) {
            this.props.controller.scheduleActions.submitCreateItem(() => this.props.controller.closeCurrentDialog())
        } else {
            this.props.controller.scheduleActions.submitEditItem(() => this.props.controller.closeCurrentDialog())
        }
    }

    render() {
        return (<>
            <DialogTitle>
                <Message messageKey={this.getTitleMessageKey()}/>
            </DialogTitle>
            <DialogContent>
                <div className={styles.dialogContent}>
                    <div className={styles.row}>
                        <div className={styles.titleField}>
                            <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                controller={this.props.controller}
                                fieldKey={{editedAppointmentTitle: "editedAppointmentTitleField"}}
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.timeRow}>
                            <div className={styles.dateFieldTitle}>
                                Время приёма:
                            </div>
                            <div className={styles.dateField}>
                                <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedAppointmentStartTime: "editedAppointmentStartTimeField"}}
                                    type={"time"}
                                />
                            </div>
                            <div className={styles.dateSeparator}>
                                -
                            </div>
                            <div className={styles.dateField}>
                                <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedAppointmentEndTime: "editedAppointmentEndTimeField"}}
                                    type={"time"}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <ConnectedCheckbox<EmployeeAppState>
                            propertyName={"createClientInfo"}
                            label={<Message messageKey={"dialog.appointment.checkbox.createClient.label"}/>}
                            controller={this.props.controller}
                        />
                    </div>
                    {this.state.showClientInfoForm
                        && (<ClientInfoForm controller={this.props.controller}/>)}
                </div>
                <DialogFooter
                    controller = {this.props.controller}
                    submitDisabled={this.state.hasErrors}
                    onSubmitClick={() => this.onSubmitClick()}
                    onCancelClick={() => this.props.controller.closeCurrentDialog()}
                />
            </DialogContent>
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
                appointmentDialogMode: "mode",
                createClientInfo: "showClientInfoForm",
                appointmentFormHasErrors: "hasErrors",
            }
        )
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {
    mode: ConfigureDialogType,
    hasErrors: boolean,
    showClientInfoForm: boolean,
}