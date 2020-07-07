import EmployeeAppController from "../../../controller/EmployeeAppController";
import {ConfigureType} from "../../../../core/types/ConfigureType";
import * as React from "react";
import {DialogContent, DialogTitle} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import EmployeeApplicationStore from "../../../state/EmployeeApplicationStore";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import ConnectedSelect from "../../../../core/components/ConnectedSelect/ConnectedSelect";
import {PersonType} from "../../../../common/beans/enums/PersonType";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";

var styles = require("../../../commonStyles.css")

export default class EditCounterAgentForm extends React.Component<Properties, State> {
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
                return "dialog.agent.create.label"
            case "edit":
                return "dialog.agent.edit.label"
            default:
                return "dialog.agent.create.label"
        }
    }

    private submitForm(): void {
        const mode = this.state.mode
        const actions = this.props.controller.counterAgentActions
        if (mode == "create") {
            actions.submitCreate()
        } else if (mode == 'edit') {
            actions.submitEdit()
        } else {
            throw new Error('unknown value of mode ' + mode)
        }
    }

    render(): React.ReactNode {
        const actions = this.props.controller.counterAgentActions
        return (
            <>
                <DialogTitle>
                    <Message messageKey={this.getTitleMessageKey()}
                    />
                </DialogTitle>
                <DialogContent>
                    <div className={styles.dialogContent}>
                        <div className={styles.column}>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedAgentName: "editedAgentNameField"}}
                                    label={(<Message messageKey={"dialog.agent.name.field.label"}/>)}
                                    required={true}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedAgentPersonName: "editedAgentPersonNameField"}}
                                    label={(<Message messageKey={"dialog.agent.contactName.field.label"}/>)}
                                    required={true}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedSelect<PersonType, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    label={<Message messageKey={"dialog.agent.personType.field.label"}/>}
                                    controller={this.props.controller}
                                    mapProperty={"personTypes"}
                                    selectedItemProperty={"editedAgentType"}
                                    itemToString={personType => PersonType.personTypeToString(personType)}
                                    getKey={personType => personType ? PersonType.personTypeToNumber(personType) : 0}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedAgentPhone: "editedAgentPhoneField"}}
                                    label={(<Message messageKey={"dialog.agent.phone.field.label"}/>)}
                                    mask={"+7(???)-???-??-??"}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedAgentEmail: "editedAgentEmailField"}}
                                    label={(<Message messageKey={"dialog.agent.email.field.label"}/>)}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedAgentNote: "editedAgentNoteField"}}
                                    label={(<Message messageKey={"dialog.agent.note.field.label"}/>)}
                                />
                            </div>
                        </div>
                        <div className={styles.column}>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedAgentPersonFinancialId: "editedAgentPersonFinancialIdField"}}
                                    label={(<Message messageKey={"dialog.agent.personFinancialId.field.label"}/>)}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedAgentBankId: "editedAgentBankIdField"}}
                                    label={(<Message messageKey={"dialog.agent.bankId.field.label"}/>)}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedAgentCorAccount: "editedAgentCorAccountField"}}
                                    label={(<Message messageKey={"dialog.agent.corAccount.field.label"}/>)}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedAgentGyroAccount: "editedAgentGyroAccountField"}}
                                    label={(<Message messageKey={"dialog.agent.gyroAccount.field.label"}/>)}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedAgentBankName: "editedAgentBankNameField"}}
                                    label={(<Message messageKey={"dialog.agent.bankName.field.label"}/>)}
                                />
                            </div>
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
            counterAgentDialogMode: "mode",
            counterAgentFormHasErrors: "hasErrors",
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