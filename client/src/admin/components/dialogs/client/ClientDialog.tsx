import EmployeeAppController from "../../../controller/EmployeeAppController";
import * as React from "react";
import {DialogContent, DialogTitle} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";
import {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import EmployeeApplicationStore from "../../../state/EmployeeApplicationStore";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import {ConfigureDialogType} from "../../../../core/types/ConfigureDialogType";
import ErrorArea from "../../../../common/components/errorArea/ErrorArea";

var styles = require("./styles.css")

export default class ClientDialog extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            mode: "none",
            hasErrors: false,
            nameAndPhoneNotEntered: false,
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
        console.log(this.state.hasErrors)
        return (
            <>
                <DialogTitle>
                    <Message messageKey={this.getTitleMessageKey()}
                    />
                </DialogTitle>
                <DialogContent>
                    <div className={styles.error}>
                        {this.state.nameAndPhoneNotEntered && <ErrorArea message={<Message messageKey={"dialog.client.field.nameOrPhone.error"}/>}/>}
                    </div>
                    <div className={styles.dialogContent}>
                        <div className={styles.column}>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedClientName: "editedClientNameField"}}
                                    label={(<Message messageKey={"dialog.client.field.name.label"}/>)}
                                    required={true}
                                    size="small"
                                    fullWidth={true}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedClientPhone: "editedClientPhoneField"}}
                                    label={(<Message messageKey={"dialog.client.field.phone.label"}/>)}
                                    required={true}
                                    size="small"
                                    fullWidth={true}
                                    mask={"+7(???)-???-??-??"}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedClientMail: "editedClientMailField"}}
                                    label={(<Message messageKey={"dialog.client.field.mail.label"}/>)}
                                    required={true}
                                    size="small"
                                    fullWidth={true}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedClientAddress: "editedClientAddressField"}}
                                    label={(<Message messageKey={"dialog.client.field.address.label"}/>)}
                                    required={true}
                                    size="small"
                                    fullWidth={true}
                                />
                            </div>
                        </div>
                        <div className={styles.column}>
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
            clientNameOrPhoneNotEntered: "nameAndPhoneNotEntered",
        })
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {
    mode: ConfigureDialogType,
    hasErrors: boolean,
    nameAndPhoneNotEntered: boolean,
}