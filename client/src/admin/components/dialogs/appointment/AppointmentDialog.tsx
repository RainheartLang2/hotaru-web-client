import * as React from "react";
import AdminAppController from "../../../controller/AdminAppController";
import {ConfigureDialogType} from "../../../../core/types/ConfigureDialogType";
import {DialogContent, DialogTitle} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";

export default class AppointmentDialog extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)

        this.state = {
            [StateProperty.Mode]: 'none',
            [StateProperty.HasErrors]: false,
        }
    }

    private getTitleMessageKey(): string {
        switch (this.state[StateProperty.Mode]) {
            case "create":
                return "dialog.appointment.create.label"
            case "edit":
                return "dialog.appointment.edit.label"
            default:
                return "dialog.appointment.create.label"
        }
    }

    render() {
        return (<>
            <DialogTitle>
                <Message messageKey={this.getTitleMessageKey()}
                />
            </DialogTitle>
            <DialogContent>
            </DialogContent>
            <DialogFooter
                submitDisabled={this.state[StateProperty.HasErrors]}
                onSubmitClick={() => {}}
                onCancelClick={() => {}}
            />
        </>)
    }
}

enum StateProperty {
    Mode = "mode",
    HasErrors = "hasErrors",
}

type Properties = {
    controller: AdminAppController
}

type State = {
    [StateProperty.Mode]: ConfigureDialogType,
    [StateProperty.HasErrors]: boolean,
}