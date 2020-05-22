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
import Time = DateUtils.Time;

export default class TypedScheduleActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    protected convertResultToItem(result: any): MedicalAppointment[] {
        const resultArray = result as ServerAppointmentBean[]
        return resultArray.map(bean => {
            return {
                id: bean.id,
                title: bean.title,
                startDate: new Date(bean.startDate),
                endDate: new Date(bean.endDate),
                clientId: bean.clientId,
                medicId: bean.medicId,
            }
        })
    }

    public changeWeek(dayInWeek: Date): void {
        this.controller.setState({
            schedulePageDate: dayInWeek,
        })
    }

    private initializeClientInfo(): void {
        this.controller.setState({
            editedClientInfoId: 0,
            editedClientInfoFirstName: "",
            editedClientInfoMiddleName: "",
            editedClientInfoLastName: "",
            editedClientInfoMail: "",
            editedClientInfoPhone: "",
            editedClientInfoAddress: "",
            createClientInfo: false,
            editedClientPetId: 0,
            editedClientPetName: "",
            editedClientSelectedSpecies: Species.getMock(),
            editedClientSelectedBreed: Breed.getMock(),
        })
    }

    public openCreateAppointmentDialog(addedAppointment: Object): void {
        const appointment = addedAppointment as AppointmentInfo
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
        const startDate = appointment.startDate
        const endDate = appointment.endDate

        this.controller.setState({
            editedAppointmentId: appointment.id,
            editedAppointmentTitle: appointment.title,
            editedAppointmentDate: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
            editedAppointmentStartTime: DateUtils.dateToTimeString(startDate),
            editedAppointmentEndTime: DateUtils.dateToTimeString(endDate),
        })
        const medicalAppointment = appointment.id ? this.controller.state.appointmentsListById.get(appointment.id) : null

        if (medicalAppointment && medicalAppointment.clientId) {
            const client = this.controller.state.userListById.get(medicalAppointment.clientId)
            if (client) {
                this.controller.setState({
                    editedClientInfoId: client.id,
                    editedClientInfoFirstName: client.firstName,
                    editedClientInfoMiddleName: client.middleName,
                    editedClientInfoLastName: client.lastName,
                    editedClientInfoPhone: client.phone,
                    editedClientInfoMail: client.email,
                    editedClientInfoAddress: client.address,
                    createClientInfo: true,
                })
            } else {
                this.initializeClientInfo()
            }
        } else {
            this.initializeClientInfo()
        }
        this.controller.setState({
            dialogType: DialogType.EditAppointment
        })
    }

    private buildAppointmentByFields(): MedicalAppointment {
        const date: Date = this.controller.state.editedAppointmentDate
        const startTime: Time = DateUtils.parseTime(this.controller.state.editedAppointmentStartTime)
        const endTime: Time = DateUtils.parseTime(this.controller.state.editedAppointmentEndTime)
        const selectedMedic = this.controller.state.selectedEmployeeForSchedulePage
        if (!selectedMedic || !selectedMedic.id) {
            throw new Error("medic id should be defined")
        }
        return {
            id: this.controller.state.editedAppointmentId,
            title: this.controller.state.editedAppointmentTitleField.value,
            startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), startTime.hours, startTime.minutes),
            endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), endTime.hours, endTime.minutes),
            medicId: selectedMedic.id,
        }
    }

    private buildClientInfoByFields(): Client | null {
        const state = this.controller.state
        if (!state.createClientInfo) {
            return null
        }
        return {
            id: state.editedClientInfoId,
            firstName: state.editedClientInfoFirstNameField.value,
            middleName: state.editedClientInfoMiddleNameField.value,
            lastName: state.editedClientInfoLastNameField.value,
            phone: state.editedClientInfoPhoneField.value,
            email: state.editedClientInfoMailField.value,
            address: state.editedClientInfoAddressField.value,
        }
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

    public handleAppointmentChange(changes: ChangeSet, callback: Function = () => {}): void {
        if (!changes.changed) {
            return
        }
        const changedList = changes.changed
        for (let key in changedList) {
            const id = +key
            const dateRange = changedList[key]
            this.updateDates(id, dateRange.startDate, dateRange.endDate, callback)
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

    public loadAppointmentsList(callback: (employees: Employee[]) => void = () => {}): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllAppointments,
            successCallback: result => {
                this.controller.setState({appointmentsList: result})
                callback(result)
            },
        })
    }

    public loadAppointmentsWithClients(callback: Function = () => {}) : void {
        this.loadAppointmentsList(() => {
            const appointments = this.controller.state.appointmentsList
            const clientIds = appointments.map(appointment => appointment.clientId).filter(id => !!id)
            // @ts-ignore
            this.controller.clientActions.loadClientsWithPets(clientIds, () => callback())
            callback()
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