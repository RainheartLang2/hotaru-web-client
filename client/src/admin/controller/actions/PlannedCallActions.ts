import EmployeeAppController from "../EmployeeAppController";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {DialogType} from "../../state/enum/DialogType";
import PlannedCall from "../../../common/beans/PlannedCall";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {DateUtils} from "../../../core/utils/DateUtils";
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
                const calls = result as PlannedCall[]
                calls.forEach(call => {
                    call.callDate = new Date(call.callDate)
                })
                this.controller.setState({
                    plannedCalls: calls
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
        this.controller.toggleFieldValidation("plannedCallDateField", false)
        callback()
    }

    public openEditForm(call: PlannedCall, callback: Function = () => {}): void {
        const clinic = this.controller.state.clinicListById.get(call.clinicId)
        const doctor = this.controller.state.medicsListById.get(call.doctorId)
        const client = this.controller.state.clientsListById.get(call.clientId)
        const pet = call.petId ? this.controller.state.petsById.get(call.petId) : null
        this.controller.setState({
            dialogType: DialogType.EditPlannedCall,
            plannedCallId: call.id,
            plannedCallClinic: clinic,
            plannedCallDoctor: doctor,
            plannedCallClient: client,
            plannedCallPet: pet,
            plannedCallDate: DateUtils.standardFormatDate(call.callDate),
            plannedCallNote: call.note,
        })
        callback()
    }

    private buildCallByField(): PlannedCall {
        return new PlannedCall({
            id: this.controller.state.plannedCallId,
            state: this.controller.state.plannedCallStateType,
            clinicId: this.controller.state.plannedCallClinic!.id!,
            doctorId: this.controller.state.plannedCallDoctor!.id!,
            clientId: this.controller.state.plannedCallClient!.id!,
            petId: this.controller.state.plannedCallPet ? this.controller.state.plannedCallPet!.id! : null,
            callDate: new Date(this.controller.state.plannedCallDateField.value),
            note: this.controller.state.plannedCallNoteField.value
        })
    }

    public getPlannedCall(id: number): PlannedCall {
        const result = this.controller.state.plannedCallsById.get(id)
        if (!result) {
            throw new Error("there is no planned call with id " + id)
        }
        return result
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

    public editPlannedCall(callback: Function = () => {}): void {
        const call = this.buildCallByField()
        fetchUserZoneRpc({
            method: RemoteMethods.updatePlannedCall,
            params: [call],
            successCallback: result => {
                this.controller.setState({
                    plannedCalls: CollectionUtils.updateArray(this.controller.state.plannedCalls, call, call => call.id)
                })
                this.controller.closeCurrentDialog()
            }
        })
    }

    public markCallDone(call: PlannedCall = this.buildCallByField(), callback: Function = () => {}): void {
        call.state = PlannedCallStateType.Done
        fetchUserZoneRpc({
            method: RemoteMethods.setPlannedCallDone,
            params: [this.controller.state.plannedCallId],
            successCallback: result => {
                this.controller.setState({
                    plannedCalls: CollectionUtils.updateArray(this.controller.state.plannedCalls, call, call => call.id)
                })
                this.controller.closeCurrentDialog()
            }
        })
    }

    public cancelCall(call: PlannedCall = this.buildCallByField(), callback: Function = () => {}): void {
        call.state = PlannedCallStateType.Canceled
        fetchUserZoneRpc({
            method: RemoteMethods.cancelPlannedCall,
            params: [this.controller.state.plannedCallId],
            successCallback: result => {
                this.controller.setState({
                    plannedCalls: CollectionUtils.updateArray(this.controller.state.plannedCalls, call, call => call.id)
                })
                this.controller.closeCurrentDialog()
            }
        })
    }
}