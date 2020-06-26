import * as React from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {ConfigureType} from "../../../../core/types/ConfigureType";
import {DialogContent, DialogTitle} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import ErrorArea from "../../../../common/components/errorArea/ErrorArea";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";
import ConnectedAutoCompleteField from "../../../../core/components/connectedAutoComplete/ConnectedAutoCompleteField";
import {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import EmployeeApplicationStore from "../../../state/EmployeeApplicationStore";
import {Clinic} from "../../../../common/beans/Clinic";
import {Employee} from "../../../../common/beans/Employee";
import {NameUtils} from "../../../../core/utils/NameUtils";
import {Client} from "../../../../common/beans/Client";

var styles = require("./styles.css")

export default class PlannedCallDialog extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            mode: "none",
            formErrorMessage: "",
            hasErrors: false,
        }
    }

    private getTitleMessageKey(): string {
        if (this.state.mode == "create") {
            return "dialog.plannedCall.create.title"
        } else {
            return "dialog.plannedCall.edit.title"
        }
    }

    private submitForm(): void {
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
                            <div className={styles.row}>
                                <ConnectedAutoCompleteField<Clinic, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    itemToString={clinic => clinic.name!}
                                    selectedItemProperty={"plannedCallClinic"}
                                    itemsProperty={"clinicList"}
                                    label={<Message messageKey={"dialog.plannedCall.clinic.field.label"}/>}
                                    required={true}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedAutoCompleteField<Employee, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    itemToString={doctor => NameUtils.formatName(doctor)}
                                    selectedItemProperty={"plannedCallDoctor"}
                                    itemsProperty={"userList"}
                                    label={<Message messageKey={"dialog.plannedCall.doctor.field.label"}/>}
                                    required={true}
                                />
                            </div>
                        </div>
                        <div className={styles.column}>
                            <ConnectedAutoCompleteField<Client, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                controller={this.props.controller}
                                itemToString={client => NameUtils.formatClientName(client)}
                                selectedItemProperty={"plannedCallClient"}
                                itemsProperty={"clientsList"}
                                label={<Message messageKey={"dialog.plannedCall.client.field.label"}/>}
                                required={true}
                            />
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
            editPlannedCallMode: "mode",
            editPlannedCallFormHasErrors: "hasErrors",
            editPlannedCallFormErrorMessage: "formErrorMessage",
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
    formErrorMessage: string,
}