import CrudAction from "../../../core/mvc/crud/CrudAction";
import AdminAppController from "../AdminAppController";
import AppointmentNode from "../../state/nodes/AppointmentNode";
import {MedicalAppointment} from "../../../common/beans/MedicalAppointment";
import {RemoteMethod} from "../../../core/http/RemoteMethod";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import {DialogType} from "../../state/enum/DialogType";
import {AppointmentInfo} from "../../../common/beans/AppointmentInfo";
import {DateUtils} from "../../../core/utils/DateUtils";
import {ChangeSet} from "@devexpress/dx-react-scheduler";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import Species from "../../../common/beans/Species";
import Breed from "../../../common/beans/Breed";

export default class AppointmentActions extends CrudAction<MedicalAppointment, AdminAppController, AppointmentNode> {

    protected get addMethod(): RemoteMethod {
        return RemoteMethods.addAppointment
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

    protected get deleteMethod(): RemoteMethod {
        return RemoteMethods.deleteAppointment
    }

    protected get getAllMethod(): RemoteMethod {
        return RemoteMethods.getAllAppointments
    }

    protected get updateMethod(): RemoteMethod {
        return RemoteMethods.editAppointment
    }

    public changeWeek(dayInWeek: Date): void {
        this.controller.setPropertyValue(AdminStateProperty.SchedulePageDate, dayInWeek)
    }

    private initializeClientInfo(): void {
        this.controller.setPropertyValue(AdminStateProperty.EditedClientInfoId, null)
        this.controller.setFieldValue(AdminStateProperty.EditedClientInfoFirstName, "")
        this.controller.setFieldValue(AdminStateProperty.EditedClientInfoMiddleName, "")
        this.controller.setFieldValue(AdminStateProperty.EditedClientInfoLastName, "")
        this.controller.setFieldValue(AdminStateProperty.EditedClientInfoPhone, "")
        this.controller.setFieldValue(AdminStateProperty.EditedClientInfoMail, "")
        this.controller.setFieldValue(AdminStateProperty.EditedClientInfoAddress, "")
        this.controller.setPropertyValue(AdminStateProperty.CreateClientInfo, false)
        this.controller.setPropertyValue(AdminStateProperty.EditedClientPetId, null)
        this.controller.setFieldValue(AdminStateProperty.EditedClientPetName, "")
        this.controller.setFieldValue(AdminStateProperty.EditedClientSelectedSpecies, Species.getMock())
        this.controller.setFieldValue(AdminStateProperty.EditedClientSelectedBreed, Breed.getMock())
    }

    public openCreateAppointmentDialog(addedAppointment: Object): void {
        const appointment = addedAppointment as AppointmentInfo
        const startDate = appointment.startDate
        const endDate = appointment.endDate
        this.controller.setPropertyValue(AdminStateProperty.EditedAppointmentId, null)
        this.controller.setFieldValue(AdminStateProperty.EditedAppointmentTitle, "")
        this.controller.toggleFieldValidation(AdminStateProperty.EditedAppointmentTitle, false)
        this.controller.setPropertyValue(AdminStateProperty.EditedAppointmentDate,
            new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()))
        this.controller.setFieldValue(AdminStateProperty.EditedAppointmentStartTime,
            DateUtils.dateToTimeString(startDate))
        this.controller.setFieldValue(AdminStateProperty.EditedAppointmentEndTime,
            DateUtils.dateToTimeString(endDate))

        this.initializeClientInfo()

        this.controller.setShowDialog(DialogType.CreateAppointment)
    }

    public openEditAppointmentDialog(editedAppointment: Object): void {
        const appointment = editedAppointment as AppointmentInfo
        const startDate = appointment.startDate
        const endDate = appointment.endDate

        this.controller.setPropertyValue(AdminStateProperty.EditedAppointmentId, appointment.id)
        this.controller.setFieldValue(AdminStateProperty.EditedAppointmentTitle, appointment.title)
        this.controller.setPropertyValue(AdminStateProperty.EditedAppointmentDate,
            new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()))
        this.controller.setFieldValue(AdminStateProperty.EditedAppointmentStartTime,
            DateUtils.dateToTimeString(startDate))
        this.controller.setFieldValue(AdminStateProperty.EditedAppointmentEndTime,
            DateUtils.dateToTimeString(endDate))

        const clientId = appointment.id ? this.node.getItemById(appointment.id).clientId : null
        if (!!clientId) {
            const client = this.controller.clientActions.getItemById(clientId)
            this.controller.setPropertyValue(AdminStateProperty.EditedClientInfoId, clientId)
            this.controller.setFieldValue(AdminStateProperty.EditedClientInfoFirstName, client.firstName)
            this.controller.setFieldValue(AdminStateProperty.EditedClientInfoMiddleName, client.middleName)
            this.controller.setFieldValue(AdminStateProperty.EditedClientInfoLastName, client.lastName)
            this.controller.setFieldValue(AdminStateProperty.EditedClientInfoPhone, client.phone)
            this.controller.setFieldValue(AdminStateProperty.EditedClientInfoMail, client.email)
            this.controller.setFieldValue(AdminStateProperty.EditedClientInfoAddress, client.address)
            this.controller.setPropertyValue(AdminStateProperty.CreateClientInfo, true)

            const pet = this.controller.petActions.getOwnerPets(clientId)[0]
            this.controller.setPropertyValue(AdminStateProperty.EditedClientPetId, pet.id)
            this.controller.setFieldValue(AdminStateProperty.EditedClientPetName, pet.name)

            const breed = pet.breedId ? this.controller.breedActions.getItemById(pet.breedId) : Breed.getMock()
            const species = breed.speciesId ? this.controller.speciesActions.getItemById(breed.speciesId) : Species.getMock()
            this.controller.setPropertyValue(AdminStateProperty.EditedClientSelectedSpecies, species)
            this.controller.setPropertyValue(AdminStateProperty.EditedClientSelectedBreed, breed)
        } else {
            this.initializeClientInfo()
        }

        this.controller.setShowDialog(DialogType.EditAppointment)
    }

    public submitCreateItem(callback: Function = () => {}): void {
        this.controller.setDialogButtonLoading(true)
        const appointment = this.getCreateItem()
        const client = this.node.buildClientInfo()
        const pet = this.node.buildPetInfo()
        fetchUserZoneRpc({
            method: this.addMethod,
            params: [appointment, client, pet],
            successCallback: (result) => {
                const addedAppointment = result as MedicalAppointment
                this.node.add(addedAppointment)
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

    public submitEditItem(callback: Function = () => {}): void {
        this.controller.setDialogButtonLoading(true)
        const appointment = this.getEditItem()
        const client = this.node.buildClientInfo()
        fetchUserZoneRpc({
            method: this.updateMethod,
            params: [appointment, client],
            successCallback: result => {
                this.node.update(appointment)
                if (!!client) {
                    this.controller.clientActions.updateClient(client)
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
        const appointment = this.node.getItemById(id)
        this.node.update({
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

    public loadAppointmentsWithClients(callback: Function = () => {}) : void {
        super.loadList([],() => {
            const appointments = this.node.getList()
            const clientIds = appointments.map(appointment => appointment.clientId).filter(id => !!id)
            // @ts-ignore
            this.controller.clientActions.loadClientsWithPets(clientIds, () => callback())
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