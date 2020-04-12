import * as React from "react";
import EditEmployeeDialog from "../components/dialogs/editEmployee/EditEmployeeDialog";
import {DialogType} from "../state/DialogType";
import AdminAppController from "../controller/AdminAppController";
import {GlobalStateProperty} from "../state/AdminApplicationState";

export default class AdminDialogsContainer extends React.Component<{}, State> {

    private controller: AdminAppController

    constructor(props: {}) {
        super(props);
        this.state = {
            [GlobalStateProperty.ShowDialog]: DialogType.None,
        }

        this.controller = AdminAppController.instance
    }

    render() {
        return (
            <>
                <EditEmployeeDialog open={this.state[GlobalStateProperty.ShowDialog] === DialogType.CreateEmployee
                || this.state[GlobalStateProperty.ShowDialog] === DialogType.EditEmployee}/>
            </>
        )
    }

    componentDidMount(): void {
        this.controller.subscribe(GlobalStateProperty.ShowDialog, this)
    }
}

type State = {
    [GlobalStateProperty.ShowDialog]: DialogType,
}