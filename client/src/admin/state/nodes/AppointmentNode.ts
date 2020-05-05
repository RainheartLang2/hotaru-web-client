import CrudNode from "../../../core/mvc/crud/CrudNode";
import {MedicalAppointment} from "../../../common/beans/MedicalAppointment";
import {AdminStateProperty} from "../AdminApplicationState";
import {ApplicationStoreFriend} from "../../../core/mvc/store/ApplicationStoreFriend";
import {DateUtils} from "../../../core/utils/DateUtils";
import Time = DateUtils.Time;
import {AppointmentModel} from "@devexpress/dx-react-scheduler";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import TimeValidator from "../../../core/mvc/validators/TimeValidator";

export default class AppointmentNode extends CrudNode<MedicalAppointment> {

    constructor(store: ApplicationStoreFriend) {
        super(store)

        this.store.registerField(AdminStateProperty.EditedAppointmentTitle, "",
            [new RequiredFieldValidator(), new MaximalLengthValidator(100)])
        this.store.registerProperty(AdminStateProperty.EditedAppointmentDate, null)
        this.store.registerField(AdminStateProperty.EditedAppointmentStartTime, "00:00", [new TimeValidator()])
        this.store.registerField(AdminStateProperty.EditedAppointmentEndTime, "00:00", [new TimeValidator()])

        this.store.registerSelector(AdminStateProperty.AppointmentModelsList, {
            dependsOn: [AdminStateProperty.AppointmentsList],
            get: map => this.getList().map(item => this.toAppointmentModel(item))
        })
    }

    buildBasedOnFields(): MedicalAppointment {
        const date: Date = this.store.getPropertyValue(AdminStateProperty.EditedAppointmentDate)
        const startTime: Time = DateUtils.parseTime(this.store.getFieldValue(AdminStateProperty.EditedAppointmentStartTime))
        const endTime: Time = DateUtils.parseTime(this.store.getFieldValue(AdminStateProperty.EditedAppointmentEndTime))
        return {
            title: this.store.getFieldValue(AdminStateProperty.EditedAppointmentTitle),
            startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), startTime.hours, startTime.minutes),
            endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), endTime.hours, endTime.minutes),
        }
    }

    protected getListPropertyName(): string {
        return AdminStateProperty.AppointmentsList;
    }

    protected getMapByIdPropertyName(): string {
        return AdminStateProperty.AppointmentsListById;
    }

    private toAppointmentModel(appointment: MedicalAppointment): AppointmentModel {
        return {
            id: appointment.id,
            title: appointment.title,
            startDate: appointment.startDate,
            endDate: appointment.endDate,
        }
    }
}