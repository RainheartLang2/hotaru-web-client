import * as React from "react";
import {DialogContent, DialogTitle} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import AdminAppController from "../../../controller/AdminAppController";
import {Message} from "../../../../core/components/Message";
import EmployeeActions from "../../../controller/actions/EmployeeActions";
import {AdminStateProperty} from "../../../state/AdminApplicationState";
import {ConfigureDialogType} from "../../../../core/types/ConfigureDialogType";
import LeftColumn from "./subcomponents/leftColumn/LeftColumn";
import RightColumn from "./subcomponents/rightColumn/RightColumn";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";

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
                            <LeftColumn
                                controller={this.controller}
                                rowStyle={styles.row}
                            />
                        </div>
                        <div className={styles.column}>
                            <RightColumn
                                controller={this.controller}
                                showActiveSwitch={this.state[StateProperty.Mode] == "edit"}
                                userActive={this.state[StateProperty.IsActive]}
                                setUserActive={(value: boolean) => this.actions.setEmployeeActive(value)}
                                styles={styles}/>
                        </div>
                    </div>
                    <div className={styles.footer}>
                        <DialogFooter
                            submitDisabled={this.state[StateProperty.HasErrors]}
                            onSubmitClick={() => this.onSubmitButtonClick()}
                            onCancelClick={() => this.closeDialog()}
                        />
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