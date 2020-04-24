import * as React from "react";
import EditEmployeeDialog from "../components/dialogs/editEmployee/EditEmployeeDialog";
import {DialogType} from "../state/DialogType";
import AdminAppController from "../controller/AdminAppController";
import {AdminStateProperty} from "../state/AdminApplicationState";

export default class AdminDialogsContainer extends React.Component<{}, State> {

    private controller: AdminAppController

    constructor(props: {}) {
        super(props);
        this.state = {
            [AdminStateProperty.DialogType]: DialogType.None,
        }

        this.controller = AdminAppController.instance
    }

    render() {
        const dialogType = this.state[AdminStateProperty.DialogType]
        return (
            <>
                <EditEmployeeDialog open={dialogType === DialogType.CreateEmployee
                || dialogType === DialogType.EditEmployee
                || dialogType === DialogType.EditEmployeeProfile}
                />
            </>
        )
    }

    componentDidMount(): void {
        this.controller.subscribe(AdminStateProperty.DialogType, this)
    }
}

type State = {
    [AdminStateProperty.DialogType]: DialogType,
}