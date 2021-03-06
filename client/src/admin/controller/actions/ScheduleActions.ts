import EmployeeAppController from "../EmployeeAppController";
import {MedicalAppointment} from "../../../common/beans/MedicalAppointment";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import Species from "../../../common/beans/Species";
import Breed from "../../../common/beans/Breed";
import {AppointmentInfo} from "../../../common/beans/AppointmentInfo";
import {DateUtils} from "../../../core/utils/DateUtils";
import {DialogType} from "../../state/enum/DialogType";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {ChangeSet} from "@devexpress/dx-react-scheduler";
import {Client} from "../../../common/beans/Client";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {Employee} from "../../../common/beans/Employee";
import {ClientType} from "../../../common/beans/enums/ClientType";
import {Time} from "../../../core/utils/Time";
import {PersonalScheduleAppointmentType} from "../../../common/beans/enums/PersonalScheduleAppointmentType";
import StateChangeContext from "../../../core/mvc/store/StateChangeContext";
import {EmployeeAppSelectors, EmployeeAppState} from "../../state/EmployeeApplicationStore";

export default class ScheduleActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    protected convertResultToItem(result: any): MedicalAppointment[] {
        const resultArray = result as ServerAppointmentBean[]
        return resultArray.map(bean => {
            return {
                id: bean.id,
                title: "123",
                startDate: new Date(bean.startDate),
                endDate: new Date(bean.endDate),
                clientId: bean.clientId,
                medicId: bean.medicId,
            }
        })
    }

    public changeWeek(dayInWeek: Date): void {
        this.controller.employeeScheduleActions.loadEmployeeSchedule(this.controller.state.selectedEmployeeForSchedulePage!.id!, dayInWeek, () => {
            this.controller.setState({
                schedulePageDate: dayInWeek,
            })
        })
    }

    private initializeClientInfo(): void {
        this.controller.setState({
            editedClientId: 0,
            editedClientName: "",
            editedClientPhone: "",
            editedClientAddress: "",
            editedClientMail: "",
            createClientInfo: false,
            saveClientAsPermanent: false,
            editedClientPetId: 0,
            editedClientPetName: "",
            editedClientSelectedSpecies: Species.getMock(),
            editedClientSelectedBreed: Breed.getMock(),
        })
    }

    public openCreateAppointmentDialog(appointment: AppointmentInfo): void {
        const startDate = appointment.startDate
        const endDate = appointment.endDate
        this.controller.setState({
            editedAppointmentId: 0,
            editedAppointmentTitle: "",
            editedAppointmentDate: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
            editedAppointmentStartTime: DateUtils.dateToTimeString(startDate),
            editedAppointmentEndTime: DateUtils.dateToTimeString(endDate),
            dialogType: DialogType.CreateAppointment,
        })
        this.initializeClientInfo()
    }

    public openEditAppointmentDialog(editedAppointment: Object): void {
        const appointment = editedAppointment as AppointmentInfo
        const startDate = new Date(appointment.startDate)
        const endDate = new Date(appointment.endDate)
        const appointmentId = PersonalScheduleAppointmentType.extractIdData(appointment.id!).id
        this.controller.setState({
            editedAppointmentId: appointmentId,
            editedAppointmentTitle: appointment.title,
            editedAppointmentDate: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
            editedAppointmentStartTime: DateUtils.dateToTimeString(startDate),
            editedAppointmentEndTime: DateUtils.dateToTimeString(endDate),
        })
        const medicalAppointment = this.controller.state.appointmentsListById.get(appointmentId)

        if (medicalAppointment && medicalAppointment.clientId) {
            const client = this.controller.state.clientsListById.get(medicalAppointment.clientId)
            if (client) {
                this.controller.setState({
                    editedClientId: client.id,
                    editedClientName: client.firstName,
                    editedClientPhone: client.phone,
                    editedClientAddress: client.address,
                    editedClientMail: client.email,
                    createClientInfo: true,
                    saveClientAsPermanent: false,
                })
            } else {
                this.initializeClientInfo()
            }
        } else {
            this.initializeClientInfo()
        }
        this.controller.toggleFieldValidation("editedClientNameField", false)
        this.controller.toggleFieldValidation("editedClientPhoneField", false)
        this.controller.setState({
            dialogType: DialogType.EditAppointment
        })
    }

    private buildAppointmentByFields(): MedicalAppointment {
        const date: Date = this.controller.state.editedAppointmentDate
        const startTime: Time = DateUtils.parseTime(this.controller.state.editedAppointmentStartTime)!
        const endTime: Time = DateUtils.parseTime(this.controller.state.editedAppointmentEndTime)!
        const selectedMedic = this.controller.state.selectedEmployeeForSchedulePage
        if (!selectedMedic || !selectedMedic.id) {
            throw new Error("medic id should be defined")
        }
        return {
            id: this.controller.state.editedAppointmentId,
            title: this.controller.state.editedAppointmentTitleField.value,
            startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), startTime.getHours(), startTime.getMinutes()),
            endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), endTime.getHours(), endTime.getMinutes()),
            medicId: selectedMedic.id,
        }
    }

    private buildClientInfoByFields(): Client | null {
        const state = this.controller.state
        if (!state.createClientInfo) {
            return null
        }
        return this.controller
            .clientActions
            .buildClientByFields(state.saveClientAsPermanent
                ? ClientType.Permanent
                : ClientType.Temporary)
    }

    public submitCreateItem(callback: Function = () => {}): void {
        this.controller.setDialogButtonLoading(true)
        const appointment = this.buildAppointmentByFields()
        const client = this.buildClientInfoByFields()
        const pet = null
        fetchUserZoneRpc({
            method: RemoteMethods.addAppointment,
            params: [appointment, client, pet],
            successCallback: (result) => {
                const addedAppointment = result as MedicalAppointment
                this.controller.setState({
                    appointmentsList: [...this.controller.state.appointmentsList, addedAppointment]
                })
                    if (!!client) {
                        client.id = addedAppointment.clientId
                        this.controller.clientActions.addClient(client)
                    }
                    if (!!pet) {
                        //TODO: add pet to application state
                    }
                    callback()
                    this.controller.setDialogButtonLoading(false)
            },
            errorCallback: () => this.controller.setDialogButtonLoading(false)
        })
    }

    private updateAppointment(item: MedicalAppointment) {
        this.controller.setState({
            appointmentsList: CollectionUtils.updateArray(this.controller.state.appointmentsList, item, appointment => appointment.id ? appointment.id : 0)
        })
    }

    public submitEditItem(callback: Function = () => {}): void {
        this.controller.setDialogButtonLoading(true)
        const appointment = this.buildAppointmentByFields()
        const client = this.buildClientInfoByFields()
        fetchUserZoneRpc({
            method: RemoteMethods.editAppointment,
            params: [appointment, client],
            successCallback: result => {
                this.updateAppointment(result)
                if (!!client) {
                    // this.controller.clientActions.updateClient(client)
                }

                //TODO: update pet
                callback()
                this.controller.setDialogButtonLoading(false)
            },
            errorCallback: () => this.controller.setDialogButtonLoading(false)
        })
    }

    public handleAppointmentChange(changes: ChangeSet,
                                   isChangeAllowed: (startDate: Date, endDate: Date) => boolean,
                                   callback: Function = () => {}
                                   ): void {
        if (!changes.changed) {
            return
        }
        const changedList = changes.changed
        for (let key in changedList) {
            const id = PersonalScheduleAppointmentType.extractIdData(key).id
            const dateRange = changedList[key]
            if (isChangeAllowed(dateRange.startDate, dateRange.endDate)) {
                this.updateDates(id, dateRange.startDate, dateRange.endDate, callback)
            }
        }
    }

    private updateDates(id: number, startDate: Date, endDate: Date, callback: Function): void {
        const appointment = this.controller.state.appointmentsListById.get(id)
        if (!appointment) {
            throw new Error("no appointment with id " + id)
        }
        this.updateAppointment({
            id: appointment.id,
            title: appointment.title,
            startDate,
            endDate,
            medicId: appointment.medicId,
        })
        fetchUserZoneRpc({
            method: RemoteMethods.updateAppointmentDates,
            params: [id, startDate, endDate],
            successCallback: (result) => {
                callback()
            },
        })
    }

    public loadAppointmentsList(callback: (employees: Employee[]) => void = () => {},
                                context?: StateChangeContext<EmployeeAppState, EmployeeAppSelectors>
    ): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllAppointments,
            successCallback: result => {
                this.controller.setState({appointmentsList: result}, context)
                callback(result)
            },
        })
    }

    public loadAppointmentsWithClients(context?: StateChangeContext<EmployeeAppState, EmployeeAppSelectors>,
                                       callback: Function = () => {}) : void {
        this.loadAppointmentsList(() => {
            const appointments = this.controller.state.appointmentsList
            const clientIds = appointments.map(appointment => appointment.clientId).filter(id => !!id)
            // @ts-ignore
            this.controller.clientActions.loadClientsWithPets(clientIds, () => callback(), context)
        }, context)
    }

    public deleteAppointment(id: number, callback: Function = () => {}): void {
        fetchUserZoneRpc({
            method: RemoteMethods.deleteAppointment,
            params: [id],
            successCallback: (result) => {
                callback()
                this.controller.setState({
                    appointmentsList: this.controller.state.appointmentsList.filter(user => user.id != id)
                })
            },
        })
    }
}

type ServerAppointmentBean = {
    id: number,
    title: string,
    startDate: number,
    endDate: number,
    clientId?: number,
    medicId: number,
}