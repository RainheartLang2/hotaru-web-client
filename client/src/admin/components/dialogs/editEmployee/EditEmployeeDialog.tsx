import * as React from "react";
import {DialogContent, DialogTitle} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import AdminAppController from "../../../controller/AdminAppController";
import {Message} from "../../../../core/components/Message";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import {ButtonComponent} from "../../../../core/components";
import EmployeeActions from "../../../controller/actions/EmployeeActions";
import {AdminStateProperty} from "../../../state/AdminApplicationState";
import {ConfigureDialogType} from "../../../../core/types/ConfigureDialogType";
import UserActiveSwitch from "./subcomponents/userActiveSwitch/UserActiveSwitch";
import Dropzone, {DropzoneState} from "react-dropzone";
import CredentialsSection from "./subcomponents/credentialsSection/CredentialsSection";

var styles = require("./styles.css");

export default class EditEmployeeDialog extends React.Component<Properties, State> {

    private controller: AdminAppController
    private actions: EmployeeActions

    constructor(props: Properties) {
        super(props);
        this.controller = AdminAppController.instance
        this.actions = this.controller.employeeActions
        this.state = {
            [StateProperty.Mode]: 'none',
            [StateProperty.IsActive]: true,
            [StateProperty.HasErrors]: false,
        }
    }

    private closeDialog() {
        this.controller.closeCurrentDialog()
    }

    private onSubmitButtonClick() {
        const mode = this.state[StateProperty.Mode]
        if (mode == 'edit' || mode == 'profile') {
            this.actions.submitEditEmployeeForm()
        } else if (mode == 'create') {
            this.actions.submitCreateEmployeeForm()
        } else {
            throw new Error('unknown value of mode ' + this.state[StateProperty.Mode])
        }
    }

    private getTitleMessageKey(): string {
        switch (this.state[StateProperty.Mode]) {
            case "create": return "dialog.employee.create.label"
            case "edit": return "dialog.employee.edit.label"
            case "profile": return "dialog.employee.profile.label"
            default: return "dialog.employee.create.label"
        }
    }

    render() {
        return (
            <Dialog open={this.props.open}
                    fullWidth={true}
                    maxWidth="md"
                    onBackdropClick={() => this.closeDialog()}
                    onClose={() => this.closeDialog()}>
                <DialogTitle>
                    <Message messageKey={this.getTitleMessageKey()}
                    />
                </DialogTitle>
                <DialogContent>
                    <div className={styles.dialogContent}>
                        <div className={styles.column}>
                            <Dropzone
                                onDrop={(acceptedFiles: File[]) => {
                                    console.log(acceptedFiles)
                                }}
                            >
                                {(state: DropzoneState) => {
                                    return (<div></div>)
                                }}
                            </Dropzone>
                            <div className={styles.row}>
                                <ConnectedTextField
                                    controller={this.controller}
                                    fieldPropertyName={AdminStateProperty.EditedEmployeeLastName}
                                    label={(<Message messageKey={"dialog.employee.field.lastName.label"}/>)}
                                    required={true}
                                    size="small"
                                    fullWidth={true}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField
                                    controller={this.controller}
                                    fieldPropertyName={AdminStateProperty.EditedEmployeeFirstName}
                                    label={(<Message messageKey={"dialog.employee.field.firstName.label"}/>)}
                                    required={true}
                                    size="small"
                                    fullWidth={true}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField
                                    controller={this.controller}
                                    fieldPropertyName={AdminStateProperty.EditedEmployeeMiddleName}
                                    label={(<Message messageKey={"dialog.employee.field.middleName.label"}/>)}
                                    size="small"
                                    fullWidth={true}
                                />
                            </div>
                            <CredentialsSection controller={this.controller}/>
                        </div>
                        <div className={styles.column}>
                            {this.state[StateProperty.Mode] == "edit"
                                ? (
                                    <div className={styles.row}>
                                        <div className={styles.activeSwitchWrapper}>
                                            <UserActiveSwitch
                                                active={this.state[StateProperty.IsActive]}
                                                onChange={(event) => this.actions.setEmployeeActive(event.target.checked)}
                                            />
                                        </div>
                                    </div>
                                )
                                : ""
                            }
                            <div className={styles.row}>
                                <ConnectedTextField
                                    controller={this.controller}
                                    fieldPropertyName={AdminStateProperty.EditedEmployeePhone}
                                    label={(<Message messageKey="dialog.employee.field.phone.label"/>)}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField
                                    controller={this.controller}
                                    fieldPropertyName={AdminStateProperty.EditedEmployeeEmail}
                                    label={(<Message messageKey="dialog.employee.field.email.label"/>)}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField
                                    controller={this.controller}
                                    fieldPropertyName={AdminStateProperty.EditedEmployeeAddress}
                                    label={(<Message messageKey="dialog.employee.field.address.label"/>)}
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.footer}>
                        <div className={styles.footerButton}>
                            <ButtonComponent
                                variant="contained"
                                color="primary"
                                size="small"
                                disabled={this.state[StateProperty.HasErrors]}
                                onClick={() => this.onSubmitButtonClick()}
                            >
                                <Message messageKey={"common.button.save"}/>
                            </ButtonComponent>
                        </div>
                        <div className={styles.footerButton}>
                            <ButtonComponent
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={() => this.closeDialog()}>
                                <Message messageKey={"common.button.back"}/>
                            </ButtonComponent>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    componentDidMount(): void {
        this.controller.subscribe(AdminStateProperty.EmployeeDialogType, this, StateProperty.Mode)
        this.controller.subscribe(AdminStateProperty.EditedEmployeeActive, this, StateProperty.IsActive)
        this.controller.subscribe(AdminStateProperty.EditEmployeeFormHasErrors, this, StateProperty.HasErrors)
    }
}

enum StateProperty {
    Mode = "mode",
    IsActive = "isActive",
    HasErrors = "hasErrors",
}

type Properties = {
    open: boolean
}

type State = {
    [StateProperty.Mode]: ConfigureDialogType,
    [StateProperty.IsActive]: boolean,
    [StateProperty.HasErrors]: boolean,
}