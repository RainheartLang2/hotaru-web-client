import * as React from "react";
import {Button, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import AdminAppController from "../../../controller/AdminAppController";
import {
    EDIT_EMPLOYEE_FORM_HAS_ERRORS,
    EDITED_EMPLOYEE_FIRST_NAME,
    EDITED_EMPLOYEE_LAST_NAME,
    EDITED_EMPLOYEE_MIDDLE_NAME
} from "../../../state/AdminApplicationState";
import {Message} from "../../../../core/components/Message";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import ApplicationController from "../../../../core/mvc/ApplicationController";
import {ButtonComponent} from "../../../../core/components";

var styles = require("./styles.css");

export default class EditEmployeeDialog extends React.Component<Properties, State> {

    private controller: ApplicationController

    constructor(props: Properties) {
        super(props);
        this.controller = AdminAppController.getInstance()
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
                    onBackdropClick={() => AdminAppController.getInstance().closeCurrentDialog()}
                    onClose={() => AdminAppController.getInstance().closeCurrentDialog()}>
                <DialogTitle>
                    <Message messageKey={"dialog.employee.create.label"}/>
                </DialogTitle>
                <DialogContent>
                    <div className={styles.dialogContent}>
                        <div className={styles.column}>
                            <div className={styles.row}>
                                <ConnectedTextField
                                    controller={this.controller}
                                    fieldPropertyName={EDITED_EMPLOYEE_LAST_NAME}
                                    label={(<Message messageKey={"dialog.employee.field.lastName.label"}/>)}
                                    required={true}
                                    size="small"
                                    fullWidth={true}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField
                                    controller={this.controller}
                                    fieldPropertyName={EDITED_EMPLOYEE_FIRST_NAME}
                                    label={(<Message messageKey={"dialog.employee.field.firstName.label"}/>)}
                                    required={true}
                                    size="small"
                                    fullWidth={true}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField
                                    controller={this.controller}
                                    fieldPropertyName={EDITED_EMPLOYEE_MIDDLE_NAME}
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
                                disabled={this.state[HAS_ERRORS]}
                                onClick={() => AdminAppController.getInstance().submitCreateEmployeeForm()}
                            >
                                <Message messageKey={"common.button.save"}/>
                            </ButtonComponent>
                        </div>
                        <div className={styles.footerButton}>
                            <ButtonComponent
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={() => AdminAppController.getInstance().closeCurrentDialog()}>
                                <Message messageKey={"common.button.cancel"}/>
                            </ButtonComponent>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    componentDidMount(): void {
        this.controller.subscribe(EDIT_EMPLOYEE_FORM_HAS_ERRORS, this, HAS_ERRORS)
    }
}

const HAS_ERRORS = 'hasErrors'

type Properties = {
    open: boolean
}

type State = {
    mode: 'create' | 'edit',
    [HAS_ERRORS]: boolean
}