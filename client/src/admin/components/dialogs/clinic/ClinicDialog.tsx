import * as React from "react";
import {DialogContent, DialogTitle} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import {ConfigureType} from "../../../../core/types/ConfigureType";
import ClinicLeftColumn from "./subcomponents/leftColumn/ClinicLeftColumn";
import ClinicRightColumn from "./subcomponents/rightColumn/ClinicRightColumn";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";

var styles = require("./styles.css")

export default class ClinicDialog extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props);
        this.state = {
            mode: 'none',
            isActive: true,
            hasErrors: false,
        }
    }

    private getTitleMessageKey(): string {
        switch (this.state.mode) {
            case "create":
                return "dialog.clinic.create.label"
            case "edit":
                return "dialog.clinic.edit.label"
            default:
                return "dialog.clinic.create.label"
        }
    }

    private submitForm(): void {
        const mode = this.state.mode
        const actions = this.props.controller.clinicActions
        if (mode == "create") {
            actions.submitCreateClinic()
        } else if (mode == 'edit') {
            actions.submitEditClinic()
        } else {
            throw new Error('unknown value of mode ' + mode)
        }
    }

    render() {
        const controller = this.props.controller
        return (<>
            <DialogTitle>
                <Message messageKey={this.getTitleMessageKey()}
                />
            </DialogTitle>
            <DialogContent>
                <div className={styles.dialogContent}>
                    <div className={styles.column}>
                        <ClinicLeftColumn controller={this.props.controller}/>
                    </div>
                    <div className={styles.column}>
                        <ClinicRightColumn
                            controller={this.props.controller}
                            active={this.state.isActive}
                            showActiveSwitch={this.state.mode == "edit"}
                        />
                    </div>
                </div>
                <DialogFooter
                    controller={this.props.controller}
                    submitDisabled={this.state.hasErrors}
                    onSubmitClick={() => this.submitForm()}
                    onCancelClick={() => controller.closeCurrentDialog()}
                />
            </DialogContent>
        </>)
    }

    componentDidMount() {
        this.props.controller.subscribe(this, {
            clinicDialogType: "mode",
            editedClinicActive: "isActive",
            editedClinicFormHasErrors: "hasErrors",
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