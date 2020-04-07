import * as React from "react";
import EditEmployeeDialog from "../components/dialogs/editEmployee/EditEmployeeDialog";
import {SHOW_DIALOG} from "../state/AdminApplicationState";
import {DialogType} from "../state/DialogType";
import AdminAppController from "../controller/AdminAppController";

export default class AdminDialogsContainer extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);
        this.state = {
            [SHOW_DIALOG]: DialogType.NONE,
        }
    }

    render() {
        return (
            <>
                <EditEmployeeDialog open={this.state.showDialog === DialogType.CREATE_EMPLOYEE
                                            || this.state.showDialog === DialogType.EDIT_EMPLOYEE}/>
            </>
        )
    }

    componentDidMount(): void {
        const controller = AdminAppController.getInstance()
        controller.subscribe(SHOW_DIALOG, this)
    }
}

type State = {
    [SHOW_DIALOG]: DialogType,
}