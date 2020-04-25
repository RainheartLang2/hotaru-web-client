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
        if (this.state[StateProperty.Mode] == "create") {
            this.props.controller.clinicActions.submitCreateClinic()
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
                        <ClinicRightColumn controller={this.props.controller}/>
                    </div>
                </div>
                <DialogFooter
                    submitDisabled={this.state[StateProperty.HasErrors]}
                    onSubmitClick={() => this.submitForm()}
                    onCancelClick={() => controller.closeCurrentDialog()}
                />
            </DialogContent>
        </>)
    }

    componentDidMount() {
        this.props.controller.subscribe(AdminStateProperty.ClinicDialogType, this, StateProperty.Mode)
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