import * as React from "react";
import EditEmployeeDialog from "../components/dialogs/editEmployee/EditEmployeeDialog";
import {DialogType} from "../state/enum/DialogType";
import {Dialog} from "@material-ui/core";
import ClinicDialog from "../components/dialogs/clinic/ClinicDialog";
import AppointmentDialog from "../components/dialogs/appointment/AppointmentDialog";
import EmployeeAppController from "../controller/EmployeeAppController";
import ClientDialog from "../components/dialogs/client/ClientDialog";
import PlannedCallDialog from "../components/dialogs/plannedCall/PlannedCallDialog";
import EditStockForm from "../components/dialogs/stock/EditStockForm";
import EditCounterAgentForm from "../components/dialogs/counterAgent/EditCounterAgentForm";
import EditGoodsDocumentForm from "../components/dialogs/goodsDocument/EditGoodsDocumentForm";
import LoadingMoire from "../../core/components/loadingMoire/LoadingMoire";

var styles = require("./styles.css")

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

    private isRenderDialog(dialogType: DialogType) {
        return !this.state.isLoading && this.state.dialogType == dialogType
    }

    render() {
        const dialogType = this.state.dialogType
        const isLoading = this.state.isLoading
        return (
            <>
                <Dialog open={dialogType != DialogType.None}
                        maxWidth="md"
                        onBackdropClick={() => this.closeDialog()}
                        onClose={() => this.closeDialog()}>
                    <div className={styles.dialogWindow}>
                        <LoadingMoire delay={true} visible={isLoading}/>
                        {(dialogType == DialogType.CreateEmployee
                            || this.isRenderDialog(DialogType.EditEmployee)
                            || this.isRenderDialog(DialogType.EditEmployeeProfile))
                        && (<EditEmployeeDialog controller={this.props.controller}/>)}

                        {(this.isRenderDialog(DialogType.CreateClinic) || this.isRenderDialog(DialogType.EditClinic))
                        && (<ClinicDialog controller={this.props.controller}/>)}
                        {(this.isRenderDialog(DialogType.CreateAppointment) || this.isRenderDialog(DialogType.EditAppointment))
                        && (<AppointmentDialog controller={this.props.controller}/>)}
                        {(this.isRenderDialog(DialogType.CreateClient) || this.isRenderDialog(DialogType.EditClient))
                        && (<ClientDialog controller={this.props.controller}/>)}
                        {(this.isRenderDialog(DialogType.CreatePlannedCall) || this.isRenderDialog(DialogType.EditPlannedCall))
                        && (<PlannedCallDialog controller={this.props.controller}/>)
                        }
                        {(this.isRenderDialog(DialogType.CreateStock) || this.isRenderDialog(DialogType.EditStock))
                        && (<EditStockForm controller={this.props.controller}/>)}
                        {(this.isRenderDialog(DialogType.CreateCounterAgent) || this.isRenderDialog(DialogType.EditCounterAgent))
                        && (<EditCounterAgentForm controller={this.props.controller}/>)}
                        {(this.isRenderDialog(DialogType.CreateGoodsIncome) || this.isRenderDialog(DialogType.EditGoodsIncome))
                        && (<EditGoodsDocumentForm controller={this.props.controller}/>)}
                    </div>
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