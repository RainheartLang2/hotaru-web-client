import * as React from "react";
import {DialogContent, DialogTitle} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import {ConfigureType} from "../../../../core/types/ConfigureType";
import LeftColumn from "./subcomponents/leftColumn/LeftColumn";
import RightColumn from "./subcomponents/rightColumn/RightColumn";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";
import EmployeeAppController from "../../../controller/EmployeeAppController";

var styles = require("./styles.css")

export default class EditEmployeeDialog extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props);
        this.state = {
            mode: 'none',
            isActive: true,
            hasErrors: false,
        }
    }

    private closeDialog() {
        this.props.controller.closeCurrentDialog()
    }

    private onSubmitButtonClick() {
        const mode = this.state.mode
        if (mode == 'edit' || mode == 'profile') {
            this.props.controller.employeeActions.submitEditEmployeeForm()
        } else if (mode == 'create') {
            this.props.controller.employeeActions.submitCreateEmployeeForm()
        } else {
            throw new Error('unknown value of mode ' + mode)
        }
    }

    private getTitleMessageKey(): string {
        switch (this.state.mode) {
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
                                showActiveSwitch={this.state.mode == "edit"}
                                userActive={this.state.isActive}
                                setUserActive={(value: boolean) => {
                                    this.props.controller.setState({
                                        editedEmployeeActive: value
                                    })
                                }}
                                styles={styles}/>
                        </div>
                    </div>
                    <DialogFooter
                        controller={this.props.controller}
                        submitDisabled={this.state.hasErrors}
                        onSubmitClick={() => this.onSubmitButtonClick()}
                        onCancelClick={() => this.closeDialog()}
                    />
                </DialogContent>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            employeeDialogType: "mode",
            editedEmployeeActive: "isActive",
            employeeFormHasError: "hasErrors",
        })
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {
    mode: ConfigureType,
    isActive: boolean,
    hasErrors: boolean,
}