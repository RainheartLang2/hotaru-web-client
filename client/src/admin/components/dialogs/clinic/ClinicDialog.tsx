import * as React from "react";
import {DialogContent, DialogTitle} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import {ConfigureDialogType} from "../../../../core/types/ConfigureDialogType";
import AdminAppController from "../../../controller/AdminAppController";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";
import {AdminStateProperty} from "../../../state/AdminApplicationState";
import ClinicLeftColumn from "./subcomponents/leftColumn/ClinicLeftColumn";
import ClinicRightColumn from "./subcomponents/rightColumn/ClinicRightColumn";

var styles = require("./styles.css")

export default class ClinicDialog extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props);
        this.state = {
            [StateProperty.Mode]: 'none',
            [StateProperty.IsActive]: true,
            [StateProperty.HasErrors]: false,
        }
    }

    private getTitleMessageKey(): string {
        switch (this.state[StateProperty.Mode]) {
            case "create":
                return "dialog.clinic.create.label"
            case "edit":
                return "dialog.clinic.edit.label"
            default:
                return "dialog.clinic.create.label"
        }
    }

    private submitForm(): void {
        const mode = this.state[StateProperty.Mode]
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
                            active={this.state[StateProperty.IsActive]}
                            showActiveSwitch={this.state[StateProperty.Mode] == "edit"}
                        />
                    </div>
                </div>
                <DialogFooter
                    controller={this.props.controller}
                    submitDisabled={this.state[StateProperty.HasErrors]}
                    onSubmitClick={() => this.submitForm()}
                    onCancelClick={() => controller.closeCurrentDialog()}
                />
            </DialogContent>
        </>)
    }

    componentDidMount() {
        this.props.controller.subscribe(AdminStateProperty.ClinicDialogType, this, StateProperty.Mode)
        this.props.controller.subscribe(AdminStateProperty.EditedClinicActive, this, StateProperty.IsActive)
        this.props.controller.subscribe(AdminStateProperty.EditClinicFormHasErrors, this, StateProperty.HasErrors)
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