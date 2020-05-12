import * as React from "react";
import EditEmployeeDialog from "../components/dialogs/editEmployee/EditEmployeeDialog";
import {DialogType} from "../state/enum/DialogType";
import AdminAppController from "../controller/AdminAppController";
import {AdminStateProperty} from "../state/AdminApplicationState";
import {Dialog} from "@material-ui/core";
import ClinicDialog from "../components/dialogs/clinic/ClinicDialog";
import AppointmentDialog from "../components/dialogs/appointment/AppointmentDialog";

export default class AdminDialogsContainer extends React.Component<{}, State> {

    private controller: AdminAppController

    constructor(props: {}) {
        super(props);
        this.state = {
            [StateProperty.DialogType]: DialogType.None,
            [StateProperty.IsLoading]: false,
            [StateProperty.ShowDialog]: false,
        }

        this.controller = AdminAppController.instance
    }

    private closeDialog() {
        this.controller.closeCurrentDialog()
    }

    render() {
        const dialogType = this.state[AdminStateProperty.DialogType]
        return (
            <>
                <Dialog open={dialogType != DialogType.None}
                        maxWidth="md"
                        onBackdropClick={() => this.closeDialog()}
                        onClose={() => this.closeDialog()}>
                    {(dialogType == DialogType.CreateEmployee
                        || dialogType == DialogType.EditEmployee
                        || dialogType == DialogType.EditEmployeeProfile)
                    && (<EditEmployeeDialog controller={this.controller}/>)}

                    {(dialogType == DialogType.CreateClinic || dialogType == DialogType.EditClinic)
                        && (<ClinicDialog controller={this.controller}/>)}
                    {(dialogType == DialogType.CreateAppointment || dialogType == DialogType.EditAppointment)
                        && (<AppointmentDialog controller={this.controller}/>)}
                </Dialog>
            </>
        )
    }

    componentDidMount(): void {
        this.controller.subscribe(AdminStateProperty.DialogType, this)
    }

    componentWillUnmount(): void {
        this.controller.unsubscribe(this)
    }
}

enum StateProperty {
    DialogType = "dialogType",
    IsLoading = "isLoading",
    ShowDialog = "showDialog",
}

type State = {
    [StateProperty.DialogType]: DialogType,
    [StateProperty.IsLoading]: boolean,
    [StateProperty.ShowDialog]: boolean,
}