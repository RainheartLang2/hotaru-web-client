import * as React from "react";
import {DialogContent, DialogTitle} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import AdminAppController from "../../controller/AdminAppController";

export default class EditEmployeeDialog extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props);
        this.state = {
            mode: 'create',
        }
    }

    render() {
        return (
            <Dialog open={this.props.open}
                    fullWidth={true}
                    maxWidth="sm"
                    onBackdropClick={() => AdminAppController.getInstance().closeCurrentDialog()}
                    onClose={() => AdminAppController.getInstance().closeCurrentDialog()}>
                <DialogTitle>
                    Создать нового сотрудника
                </DialogTitle>
                <DialogContent>
                    Здесь будет контент
                </DialogContent>
            </Dialog>
        )
    }
}

type Properties = {
    open: boolean
}

type State = {
    mode: 'create' | 'edit',
}