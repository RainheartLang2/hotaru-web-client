import CrudAction from "../../../core/mvc/crud/CrudAction";
import AdminAppController from "../AdminAppController";
import AppointmentNode from "../../state/nodes/AppointmentNode";
import {Appointment} from "../../../common/beans/Appointment";
import {RemoteMethod} from "../../../core/http/RemoteMethod";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {plainToClass} from "class-transformer";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import {DialogType} from "../../state/enum/DialogType";

export default class AppointmentActions extends CrudAction<Appointment, AdminAppController, AppointmentNode> {

    protected get addMethod(): RemoteMethod {
        return RemoteMethods.addAppointment
    }

    protected convertResultToItem(result: any): Appointment[] {
        return plainToClass(Appointment, result) as unknown as Appointment[]
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

    public openCreateAppointmentDialog(): void {
        console.log(1)
        this.controller.setShowDialog(DialogType.CreateAppointment)
    }

}