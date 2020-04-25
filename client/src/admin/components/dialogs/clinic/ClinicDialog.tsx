import * as React from "react";
import {DialogContent, DialogTitle} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import {ConfigureDialogType} from "../../../../core/types/ConfigureDialogType";
import AdminAppController from "../../../controller/AdminAppController";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";
import {AdminStateProperty} from "../../../state/AdminApplicationState";

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

    render() {
        const controller = this.props.controller
        return (<>
            <DialogTitle>
                <Message messageKey={this.getTitleMessageKey()}
                />
            </DialogTitle>
            <DialogContent>
                <DialogFooter
                    submitDisabled={this.state[StateProperty.HasErrors]}
                    onSubmitClick={() => {}}
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