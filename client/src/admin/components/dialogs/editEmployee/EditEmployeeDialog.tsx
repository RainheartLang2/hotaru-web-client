import * as React from "react";
import {DialogContent, DialogTitle} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import AdminAppController from "../../../controller/AdminAppController";
import {Message} from "../../../../core/components/Message";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import {ButtonComponent} from "../../../../core/components";
import EmployeeActions from "../../../controller/actions/EmployeeActions";
import {GlobalStateProperty} from "../../../state/AdminApplicationState";

var styles = require("./styles.css");

export default class EditEmployeeDialog extends React.Component<Properties, State> {

    private controller: AdminAppController
    private actions: EmployeeActions

    constructor(props: Properties) {
        super(props);
        this.controller = AdminAppController.instance
        this.actions = this.controller.employeeActions
        this.state = {
            mode: 'create',
            hasErrors: false,
        }
    }

    render() {
        return (
            <Dialog open={this.props.open}
                    fullWidth={true}
                    maxWidth="md"
                    onBackdropClick={() => this.controller.closeCurrentDialog()}
                    onClose={() => this.controller.closeCurrentDialog()}>
                <DialogTitle>
                    <Message messageKey={"dialog.employee.create.label"}/>
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
                            <ButtonComponent
                                variant="contained"
                                color="primary"
                                size="small"
                                disabled={this.state[StateProperty.HasErrors]}
                                onClick={() => this.actions.submitCreateEmployeeForm()}
                            >
                                <Message messageKey={"common.button.save"}/>
                            </ButtonComponent>
                        </div>
                        <div className={styles.footerButton}>
                            <ButtonComponent
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={() => this.controller.closeCurrentDialog()}>
                                <Message messageKey={"common.button.cancel"}/>
                            </ButtonComponent>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    componentDidMount(): void {
        this.controller.subscribe(GlobalStateProperty.EditEmployeeFormHasErrors, this, StateProperty.HasErrors)
    }
}

enum StateProperty {
    HasErrors = "hasErrors"
}

type Properties = {
    open: boolean
}

type State = {
    mode: 'create' | 'edit',
    [StateProperty.HasErrors]: boolean
}