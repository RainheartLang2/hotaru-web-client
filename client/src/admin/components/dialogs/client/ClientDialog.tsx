import EmployeeAppController from "../../../controller/EmployeeAppController";
import * as React from "react";
import {DialogContent, DialogTitle} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";
import {ConfigureType} from "../../../../core/types/ConfigureType";
import ErrorArea from "../../../../common/components/errorArea/ErrorArea";
import ClientForm from "../../../../common/components/clientForm/ClientForm";
import PetsList from "./subcomponents/PetsList";
import DisablingMoire from "../../../../core/components/disablingMoire/DisablingMoire";

var styles = require("./styles.css")

export default class ClientDialog extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            mode: "none",
            hasErrors: false,
            formErrorMessage: "",
        }
    }

    private getTitleMessageKey(): string {
        return "dialog.client.create.label"
    }

    private submitForm(): void {
        const mode = this.state.mode
        const actions = this.props.controller.clientActions
        if (mode == "create") {
            actions.submitCreateClient()
        } else if (mode == 'edit') {
            actions.submitEditClient()
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
                    <div className={styles.error}>
                        {this.state.formErrorMessage && <ErrorArea message={this.state.formErrorMessage}/>}
                    </div>
                    <div className={styles.dialogContent}>
                        <div className={styles.column}>
                            <ClientForm
                                controller={this.props.controller}
                                rowStyle={styles.row}
                            />
                        </div>
                        <div className={styles.column}>
                            <div className={styles.petsListWrapper}>
                                <PetsList controller={this.props.controller}/>
                                <DisablingMoire
                                    active={this.state.mode != "edit"}
                                    tooltipLabel={<Message messageKey={"dialog.client.petsList.disabled.tooltip"}/>}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter
                        controller={this.props.controller}
                        submitDisabled={this.state.hasErrors}
                        onSubmitClick={() => this.submitForm()}
                        onCancelClick={() => this.props.controller.closeCurrentDialog()}
                    />
                </DialogContent>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            clientDialogType: "mode",
            clientFormHasErrors: "hasErrors",
            clientDialogErrorText: "formErrorMessage",
        })
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {
    mode: ConfigureType,
    hasErrors: boolean,
    formErrorMessage: string,
}