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
                cliendId: bean.clientId
            }
        })
    }

    protected get deleteMethod(): RemoteMethod {
        return RemoteMethods.deleteAppointment
    }

    protected getAllLoadingProperty(): string {
        return AdminStateProperty.IsPageLoading
    }

    protected get getAllMethod(): RemoteMethod {
        return RemoteMethods.getAllAppointments
    }

    protected get updateMethod(): RemoteMethod {
        return RemoteMethods.editAppointment
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

        this.controller.setPropertyValue(AdminStateProperty.EditedClientInfoId, null)
        this.controller.setFieldValue(AdminStateProperty.EditedClientInfoFirstName, "")
        this.controller.setFieldValue(AdminStateProperty.EditedClientInfoMiddleName, "")
        this.controller.setFieldValue(AdminStateProperty.EditedClientInfoLastName, "")
        this.controller.setFieldValue(AdminStateProperty.EditedClientInfoPhone, "")
        this.controller.setFieldValue(AdminStateProperty.EditedClientInfoMail, "")
        this.controller.setFieldValue(AdminStateProperty.EditedClientInfoAddress, "")

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
        this.controller.setShowDialog(DialogType.EditAppointment)
    }

    public submitCreateItem(callback: Function = () => {}): void {
        const appointment = this.getCreateItem()
        const client = this.node.buildClientInfo()
        fetchUserZoneRpc({
            method: this.addMethod,
            params: [appointment, client],
            successCallback: (result) => {
                const addedAppointment = result as MedicalAppointment
                this.node.add(addedAppointment)
                if (!!client) {
                    client.id = addedAppointment.cliendId
                    this.controller.clientActions.addClient(client)
                }
                callback()
            },
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
            const clientIds = appointments.map(appointment => appointment.cliendId).filter(id => !!id)
            this.controller.clientActions.loadList(clientIds.length > 0 ? [clientIds] : [], () => callback())
        })
    }
}

type ServerAppointmentBean = {
    id: number,
    title: string,
    startDate: number,
    endDate: number,
    clientId?: number,
}