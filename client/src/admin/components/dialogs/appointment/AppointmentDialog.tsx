import * as React from "react";
import AdminAppController from "../../../controller/AdminAppController";
import {ConfigureDialogType} from "../../../../core/types/ConfigureDialogType";
import {DialogContent, DialogTitle} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import {AdminStateProperty} from "../../../state/AdminApplicationState";

const styles = require("./styles.css");

export default class AppointmentDialog extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)

        this.state = {
            [StateProperty.Mode]: 'none',
            [StateProperty.HasErrors]: false,
        }
    }

    private getTitleMessageKey(): string {
        switch (this.state[StateProperty.Mode]) {
            case "create":
                return "dialog.appointment.create.label"
            case "edit":
                return "dialog.appointment.edit.label"
            default:
                return "dialog.appointment.create.label"
        }
    }

    private onSubmitClick(): void {
        if (this.state[StateProperty.Mode]) {
            this.props.controller.appointmentActions.submitCreateItem(() => this.props.controller.closeCurrentDialog())
        } else {
            this.props.controller.appointmentActions.submitEditItem(() => this.props.controller.closeCurrentDialog())
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
                            <ConnectedTextField
                                controller={this.props.controller}
                                fieldPropertyName={AdminStateProperty.EditedAppointmentTitle}
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.timeRow}>
                            <div className={styles.dateFieldTitle}>
                                Время приёма:
                            </div>
                            <div className={styles.dateField}>
                                <ConnectedTextField
                                    controller={this.props.controller}
                                    fieldPropertyName={AdminStateProperty.EditedAppointmentStartTime}
                                    type={"time"}
                                />
                            </div>
                            <div className={styles.dateSeparator}>
                                -
                            </div>
                            <div className={styles.dateField}>
                                <ConnectedTextField
                                    controller={this.props.controller}
                                    fieldPropertyName={AdminStateProperty.EditedAppointmentEndTime}
                                    type={"time"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter
                    submitDisabled={this.state[StateProperty.HasErrors]}
                    onSubmitClick={() => this.onSubmitClick()}
                    onCancelClick={() => this.props.controller.closeCurrentDialog()}
                />
            </DialogContent>
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(AdminStateProperty.AppointmentDialogMode, this, StateProperty.Mode)
        this.props.controller.subscribe(AdminStateProperty.AppointmentFormHasErrors, this, StateProperty.HasErrors)
    }
}

enum StateProperty {
    Mode = "mode",
    HasErrors = "hasErrors",
}

type Properties = {
    controller: AdminAppController
}

type State = {
    [StateProperty.Mode]: ConfigureDialogType,
    [StateProperty.HasErrors]: boolean,
}