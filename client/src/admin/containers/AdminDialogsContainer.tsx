import * as React from "react";
import EditEmployeeDialog from "../components/dialogs/editEmployee/EditEmployeeDialog";
import {DialogType} from "../state/enum/DialogType";
import {Dialog} from "@material-ui/core";
import ClinicDialog from "../components/dialogs/clinic/ClinicDialog";
import AppointmentDialog from "../components/dialogs/appointment/AppointmentDialog";
import EmployeeAppController from "../controller/EmployeeAppController";
import ClientDialog from "../components/dialogs/client/ClientDialog";
import PlannedCallDialog from "../components/dialogs/plannedCall/PlannedCallDialog";

export default class AdminDialogsContainer extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props);
        this.state = {
            dialogType: DialogType.None,
            isLoading: false,
            showDialog: false,
        }
    }

    private closeDialog() {
        this.props.controller.closeCurrentDialog()
    }

    render() {
        const dialogType = this.state.dialogType
        return (
            <>
                <Dialog open={dialogType != DialogType.None}
                        maxWidth="md"
                        onBackdropClick={() => this.closeDialog()}
                        onClose={() => this.closeDialog()}>
                    {(dialogType == DialogType.CreateEmployee
                        || dialogType == DialogType.EditEmployee
                        || dialogType == DialogType.EditEmployeeProfile)
                    && (<EditEmployeeDialog controller={this.props.controller}/>)}

                    {(dialogType == DialogType.CreateClinic || dialogType == DialogType.EditClinic)
                        && (<ClinicDialog controller={this.props.controller}/>)}
                    {(dialogType == DialogType.CreateAppointment || dialogType == DialogType.EditAppointment)
                        && (<AppointmentDialog controller={this.props.controller}/>)}
                    {(dialogType == DialogType.CreateClient || dialogType == DialogType.EditClient)
                        && (<ClientDialog controller={this.props.controller}/>)}
                    {(dialogType == DialogType.CreatePlannedCall || dialogType == DialogType.EditPlannedCall)
                        && (<PlannedCallDialog controller={this.props.controller}/>)
                    }
                </Dialog>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            dialogType: "dialogType",
            isDialogLoading: "isLoading",
            showDialog: "showDialog",
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
    dialogType: DialogType,
    isLoading: boolean,
    showDialog: boolean,
}