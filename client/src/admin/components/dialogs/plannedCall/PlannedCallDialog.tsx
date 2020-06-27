import * as React from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {ConfigureType} from "../../../../core/types/ConfigureType";
import {DialogContent, DialogTitle} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import ErrorArea from "../../../../common/components/errorArea/ErrorArea";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";
import ConnectedAutoCompleteField from "../../../../core/components/connectedAutoComplete/ConnectedAutoCompleteField";
import EmployeeApplicationStore, {
    EmployeeAppSelectors,
    EmployeeAppState
} from "../../../state/EmployeeApplicationStore";
import {Clinic} from "../../../../common/beans/Clinic";
import {Employee} from "../../../../common/beans/Employee";
import {NameUtils} from "../../../../core/utils/NameUtils";
import {Client} from "../../../../common/beans/Client";
import {Pet} from "../../../../common/beans/Pet";
import Species from "../../../../common/beans/Species";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import CustomContentButton from "../../../../core/components/iconButton/CustomContentButton";
import {PlannedCallStateType} from "../../../../common/beans/enums/PlannedCallStateType";
import DoneIcon from '@material-ui/icons/DoneSharp';
import CancelIcon from '@material-ui/icons/DeleteSharp'

var styles = require("./styles.css")

export default class PlannedCallDialog extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            mode: "none",
            formErrorMessage: "",
            hasErrors: false,
            selectedClinic: null,
            selectedClient: null,
            callState: PlannedCallStateType.Assigned,
            species: new Map(),
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
        if (this.state.mode == "create") {
            this.props.controller.plannedCallActions.addPlannedCall()
        } else {
            this.props.controller.plannedCallActions.editPlannedCall()
        }
    }

    render() {
        return (
            <>
                <DialogTitle>
                    <div className={styles.dialogTitleWrapper}>
                        <div className={styles.dialogTitle}>
                            <Message messageKey={this.getTitleMessageKey()}/>
                        </div>
                        {this.state.callState == PlannedCallStateType.Assigned && this.state.mode == "edit" &&
                            (
                                <div className={styles.titleButtons}>
                                    <CustomContentButton
                                        onClick={() => this.props.controller.plannedCallActions.markCallDone()}
                                        tooltipContent={<Message messageKey={"plannedCall.state.done.tooltip"}/>}
                                    >
                                        <DoneIcon/>
                                    </CustomContentButton>
                                    <CustomContentButton
                                        onClick={() => this.props.controller.plannedCallActions.cancelCall()}
                                        tooltipContent={<Message messageKey={"plannedCall.state.cancel.tooltip"}/>}
                                    >
                                        <CancelIcon/>
                                    </CustomContentButton>
                                </div>
                            )
                        }
                    </div>
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
                                    itemsProperty={"editPlannedCallDoctorsList"}
                                    label={<Message messageKey={"dialog.plannedCall.doctor.field.label"}/>}
                                    disabled={!this.state.selectedClinic}
                                    required={true}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{plannedCallDate: "plannedCallDateField"}}
                                    label={<Message messageKey={"dialog.plannedCall.date.field.label"}/>}
                                    type={"date"}
                                />
                            </div>
                        </div>
                        <div className={styles.column}>
                            <div className={styles.row}>
                                <ConnectedAutoCompleteField<Client, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    itemToString={client => NameUtils.formatClientName(client)}
                                    selectedItemProperty={"plannedCallClient"}
                                    itemsProperty={"clientsList"}
                                    label={<Message messageKey={"dialog.plannedCall.client.field.label"}/>}
                                    required={true}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedAutoCompleteField<Pet, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    itemToString={pet => {
                                        const species = this.state.species.get(pet.speciesId!)
                                        return NameUtils.formatPetName(pet, species!)
                                    }}
                                    selectedItemProperty={"plannedCallPet"}
                                    itemsProperty={"editPlannedCallPetsList"}
                                    label={<Message messageKey={"dialog.plannedCall.pet.field.label"}/>}
                                    disabled={!this.state.selectedClient}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{plannedCallNote: "plannedCallNoteField"}}
                                    label={<Message messageKey={"dialog.plannedCall.note.field.label"}/>}
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
            editPlannedCallMode: "mode",
            speciesListById: "species",
            plannedCallClinic: "selectedClinic",
            plannedCallClient: "selectedClient",
            plannedCallStateType: "callState",
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
    selectedClinic: Clinic | null,
    selectedClient: Client | null,
    callState: PlannedCallStateType,
    species: Map<number, Species>,
    hasErrors: boolean,
    formErrorMessage: string,
}