import * as React from "react";
import {Button, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import AdminAppController from "../../../controller/AdminAppController";
import AdminApplicationState, {
    EDITED_EMPLOYEE_FIRST_NAME,
    EDITED_EMPLOYEE_LAST_NAME,
    EDITED_EMPLOYEE_MIDDLE_NAME
} from "../../../state/AdminApplicationState";

var styles = require("./styles.css");

export default class EditEmployeeDialog extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props);
        this.state = {
            mode: 'create',
            [FIRST_NAME_PROPERTY]: "",
            [MIDDLE_NAME_PROPERTY]: "",
            [LAST_NAME_PROPERTY]: "",
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
                    Создать нового сотрудника
                </DialogTitle>
                <DialogContent>
                    <div className={styles.dialogContent}>
                        <div className={styles.column}>
                            <div className={styles.row}>
                                <TextField label={"Фамилия"}
                                           required={true}
                                           size="small"
                                           fullWidth={true}
                                           defaultValue={this.state[LAST_NAME_PROPERTY]}
                                           onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                               AdminAppController
                                                   .getInstance()
                                                   .setEmployeeLastName(event.target.value)
                                           }}
                                />
                            </div>
                            <div className={styles.row}>
                                <TextField label={"Имя"}
                                           required={true}
                                           size="small"
                                           fullWidth={true}
                                           defaultValue={this.state[FIRST_NAME_PROPERTY]}
                                           onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                               AdminAppController
                                                   .getInstance()
                                                   .setEmployeeFirstName(event.target.value)
                                           }}
                                />
                            </div>
                            <div className={styles.row}>
                                <TextField label={"Отчество"}
                                           size="small"
                                           fullWidth={true}
                                           defaultValue={this.state[LAST_NAME_PROPERTY]}
                                           onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                               AdminAppController
                                                   .getInstance()
                                                   .setEmployeeMiddleName(event.target.value)
                                           }}
                                />
                            </div>
                        </div>
                        <div className={styles.column}>
                        </div>
                    </div>
                    <div className={styles.footer}>
                        <div className={styles.footerButton}>
                            <Button variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => AdminAppController.getInstance().submitCreateEmployeeForm()}
                            >
                                Сохранить
                            </Button>
                        </div>
                        <div className={styles.footerButton}>
                            <Button variant="contained"
                                    color="secondary"
                                    size="small"
                                    onClick={() => AdminAppController.getInstance().closeCurrentDialog()}>
                                Отменить
                            </Button>
                        </div>

                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    componentDidMount(): void {
        const controller = AdminAppController.getInstance()
        controller.subscribe(EDITED_EMPLOYEE_FIRST_NAME, this, FIRST_NAME_PROPERTY)
        controller.subscribe(EDITED_EMPLOYEE_MIDDLE_NAME, this, MIDDLE_NAME_PROPERTY)
        controller.subscribe(EDITED_EMPLOYEE_LAST_NAME, this, LAST_NAME_PROPERTY)
    }
}

const FIRST_NAME_PROPERTY = "firstName"
const MIDDLE_NAME_PROPERTY = "middleName"
const LAST_NAME_PROPERTY = "lastName"

type Properties = {
    open: boolean
}

type State = {
    mode: 'create' | 'edit',
    [FIRST_NAME_PROPERTY]: string,
    [MIDDLE_NAME_PROPERTY]: string,
    [LAST_NAME_PROPERTY]: string,
}