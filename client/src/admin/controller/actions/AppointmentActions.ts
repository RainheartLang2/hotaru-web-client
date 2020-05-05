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
        this.controller.setFieldValue(AdminStateProperty.EditedAppointmentTitle, "")
        this.controller.toggleFieldValidation(AdminStateProperty.EditedAppointmentTitle, false)
        this.controller.setPropertyValue(AdminStateProperty.EditedAppointmentDate,
            new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()))
        this.controller.setFieldValue(AdminStateProperty.EditedAppointmentStartTime,
            DateUtils.dateToTimeString(startDate))
        this.controller.setFieldValue(AdminStateProperty.EditedAppointmentEndTime,
                DateUtils.dateToTimeString(endDate))
        this.controller.setShowDialog(DialogType.CreateAppointment)
    }
}

type ServerAppointmentBean = {
    id: number,
    title: string,
    startDate: number,
    endDate: number,
}