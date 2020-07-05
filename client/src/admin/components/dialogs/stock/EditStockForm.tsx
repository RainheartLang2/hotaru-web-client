import * as React from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {DialogContent, DialogTitle} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";
import {ConfigureType} from "../../../../core/types/ConfigureType";

var styles = require("./styles.css")

export default class EditStockForm extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            mode: "none",
            hasErrors: false,
        }
    }

    private getTitleMessageKey(): string {
        switch (this.state.mode) {
            case "create":
                return "dialog.stock.create.label"
            case "edit":
                return "dialog.stock.edit.label"
            default:
                return "dialog.stock.create.label"
        }
    }

    private submitForm(): void {
        const mode = this.state.mode
        const actions = this.props.controller.stockActions
        if (mode == "create") {
            actions.submitCreate()
        } else if (mode == 'edit') {
            actions.submitEdit()
        } else {
            throw new Error('unknown value of mode ' + mode)
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
                        </div>
                        <div className={styles.column}>
                        </div>
                    </div>
                    <DialogFooter
                        controller={this.props.controller}
                        submitDisabled={this.state.hasErrors}
                        onSubmitClick={() => {this.submitForm()}}
                        onCancelClick={() => this.props.controller.closeCurrentDialog()}
                    />
                </DialogContent>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            stockDialogMode: "mode",
            stockFormHasErrors: "hasErrors"
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
    hasErrors: boolean,
}