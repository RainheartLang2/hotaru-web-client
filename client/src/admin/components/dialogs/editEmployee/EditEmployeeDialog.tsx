import * as React from "react";
import {DialogContent, DialogTitle} from "@material-ui/core";
import AdminAppController from "../../../controller/AdminAppController";
import {Message} from "../../../../core/components/Message";
import EmployeeActions from "../../../controller/actions/EmployeeActions";
import {AdminStateProperty} from "../../../state/AdminApplicationState";
import {ConfigureDialogType} from "../../../../core/types/ConfigureDialogType";
import LeftColumn from "./subcomponents/leftColumn/LeftColumn";
import RightColumn from "./subcomponents/rightColumn/RightColumn";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";

var styles = require("./styles.css")

export default class EditEmployeeDialog extends React.Component<Properties, State> {

    private actions: EmployeeActions

    constructor(props: Properties) {
        super(props);
        this.actions = this.props.controller.employeeActions
        this.state = {
            [StateProperty.Mode]: 'none',
            [StateProperty.IsActive]: true,
            [StateProperty.HasErrors]: false,
        }
    }

    private closeDialog() {
        this.props.controller.closeCurrentDialog()
    }

    private onSubmitButtonClick() {
        const mode = this.state[StateProperty.Mode]
        if (mode == 'edit' || mode == 'profile') {
            this.actions.submitEditEmployeeForm()
        } else if (mode == 'create') {
            this.actions.submitCreateEmployeeForm()
        } else {
            throw new Error('unknown value of mode ' + mode)
        }
    }

    private getTitleMessageKey(): string {
        switch (this.state[StateProperty.Mode]) {
            case "create":
                return "dialog.employee.create.label"
            case "edit":
                return "dialog.employee.edit.label"
            case "profile":
                return "dialog.employee.profile.label"
            default:
                return "dialog.employee.create.label"
        }
    }

    render() {
        return (
            <>
                <DialogTitle>
                    <Message messageKey={this.getTitleMessageKey()}
                    />
                </DialogTitle>
                <DialogContent>
                    <div className={styles.dialogContent}>
                        <div className={styles.column}>
                            <LeftColumn
                                controller={this.props.controller}
                                rowStyle={styles.row}
                            />
                        </div>
                        <div className={styles.column}>
                            <RightColumn
                                controller={this.props.controller}
                                showActiveSwitch={this.state[StateProperty.Mode] == "edit"}
                                userActive={this.state[StateProperty.IsActive]}
                                setUserActive={(value: boolean) => this.actions.setEmployeeActive(value)}
                                styles={styles}/>
                        </div>
                    </div>
                    <DialogFooter
                        controller={this.props.controller}
                        submitDisabled={this.state[StateProperty.HasErrors]}
                        onSubmitClick={() => this.onSubmitButtonClick()}
                        onCancelClick={() => this.closeDialog()}
                    />
                </DialogContent>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(AdminStateProperty.EmployeeDialogType, this, StateProperty.Mode)
        this.props.controller.subscribe(AdminStateProperty.EditedEmployeeActive, this, StateProperty.IsActive)
        this.props.controller.subscribe(AdminStateProperty.EditEmployeeFormHasErrors, this, StateProperty.HasErrors)
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

enum StateProperty {
    Mode = "mode",
    IsActive = "isActive",
    HasErrors = "hasErrors",
}

type Properties = {
    controller: AdminAppController
}

type State = {
    [StateProperty.Mode]: ConfigureDialogType,
    [StateProperty.IsActive]: boolean,
    [StateProperty.HasErrors]: boolean,
}