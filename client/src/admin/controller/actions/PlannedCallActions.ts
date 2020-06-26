import EmployeeAppController from "../EmployeeAppController";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {DialogType} from "../../state/enum/DialogType";
import PlannedCall from "../../../common/beans/PlannedCall";
import {PlannedCallStateType} from "../../../common/beans/enums/PlannedCallStateType";

export default class PlannedCallActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public loadList(callback: Function = () => {}): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllPlannedCalls,
            params: [],
            successCallback: result => {
                this.controller.setState({
                    plannedCalls: result
                })
                callback(result)
            },
        })
    }

    public openCreateForm(callback: Function = () => {}): void {
        this.controller.setState({
            dialogType: DialogType.CreatePlannedCall,
            plannedCallId: undefined,
            plannedCallClinic: null,
            plannedCallDoctor: null,
            plannedCallClient: null,
            plannedCallPet: null,
            plannedCallDate: "",
            plannedCallNote: "",
        })
        callback()
    }

    public openEditForm(call: PlannedCall, callback: Function = () => {}): void {
        this.controller.setState({
            dialogType: DialogType.EditPlannedCall,
        })
        callback()
    }

    public buildCallByField(): PlannedCall {
        return new PlannedCall({
            id: this.controller.state.plannedCallId,
            state: PlannedCallStateType.Assigned,
            clinicId: this.controller.state.plannedCallClinic!.id!,
            doctorId: this.controller.state.plannedCallDoctor!.id!,
            clientId: this.controller.state.plannedCallClient!.id!,
            petId: this.controller.state.plannedCallPet ? this.controller.state.plannedCallPet!.id! : null,
            callDate: new Date(this.controller.state.plannedCallDateField.value),
            note: this.controller.state.plannedCallNoteField.value
        })
    }

    public addPlannedCall(callback: Function = () => {}): void {
        const call = this.buildCallByField()
        fetchUserZoneRpc({
            method: RemoteMethods.addPlannedCall,
            params: [call],
            successCallback: result => {
                call.id = +result
                this.controller.setState({
                    plannedCalls: [...this.controller.state.plannedCalls, call],
                })
                this.controller.closeCurrentDialog()
            }
        })
    }
}