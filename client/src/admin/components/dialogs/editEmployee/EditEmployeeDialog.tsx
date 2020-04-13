import * as React from "react";
import {DialogContent, DialogTitle} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import AdminAppController from "../../../controller/AdminAppController";
import {Message} from "../../../../core/components/Message";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import {ButtonComponent} from "../../../../core/components";
import EmployeeActions from "../../../controller/actions/EmployeeActions";
import {GlobalStateProperty} from "../../../state/AdminApplicationState";
import {ConfigureDialogType} from "../../../../core/types/ConfigureDialogType";

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
            [StateProperty.HasErrors]: false,
        }
    }

    private closeDialog() {
        if (this.state[StateProperty.Mode] == 'edit') {
            this.actions.submitEditEmployeeForm()
        }
        this.controller.closeCurrentDialog()
    }

    render() {
        return (
            <Dialog open={this.props.open}
                    fullWidth={true}
                    maxWidth="md"
                    onBackdropClick={() => this.closeDialog()}
                    onClose={() => this.closeDialog()}>
                <DialogTitle>
                    <Message messageKey={this.state[StateProperty.Mode] == "create"
                        ? "dialog.employee.create.label"
                        : "dialog.employee.edit.label"}
                    />
                </DialogTitle>
                <DialogContent>
                    <div className={styles.dialogContent}>
                        <div className={styles.column}>
                            <div className={styles.row}>
                                <ConnectedTextField
                                    controller={this.controller}
                                    fieldPropertyName={GlobalStateProperty.EditedEmployeeLastName}
                                    label={(<Message messageKey={"dialog.employee.field.lastName.label"}/>)}
                                    required={true}
                                    size="small"
                                    fullWidth={true}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField
                                    controller={this.controller}
                                    fieldPropertyName={GlobalStateProperty.EditedEmployeeFirstName}
                                    label={(<Message messageKey={"dialog.employee.field.firstName.label"}/>)}
                                    required={true}
                                    size="small"
                                    fullWidth={true}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField
                                    controller={this.controller}
                                    fieldPropertyName={GlobalStateProperty.EditedEmployeeMiddleName}
                                    label={(<Message messageKey={"dialog.employee.field.middleName.label"}/>)}
                                    size="small"
                                    fullWidth={true}
                                />
                            </div>
                        </div>
                        <div className={styles.column}>
                        </div>
                    </div>
                    <div className={styles.footer}>
                        <div className={styles.footerButton}>
                            {this.state[StateProperty.Mode] == "create" ?
                                (<ButtonComponent
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    disabled={this.state[StateProperty.HasErrors]}
                                    onClick={() => this.actions.submitCreateEmployeeForm()}
                                >
                                    <Message messageKey={"common.button.save"}/>
                                </ButtonComponent>)
                                : ""
                            }
                        </div>
                        <div className={styles.footerButton}>
                            <ButtonComponent
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={() => this.controller.closeCurrentDialog()}>
                                <Message messageKey={"common.button.back"}/>
                            </ButtonComponent>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    componentDidMount(): void {
        this.controller.subscribe(GlobalStateProperty.EditEmployeeFormHasErrors, this, StateProperty.HasErrors)
        this.controller.subscribe(GlobalStateProperty.EmployeeDialogType, this, StateProperty.Mode)
    }
}

enum StateProperty {
    Mode = "mode",
    HasErrors = "hasErrors"
}

type Properties = {
    open: boolean
}

type State = {
    [StateProperty.Mode]: ConfigureDialogType,
    [StateProperty.HasErrors]: boolean
}