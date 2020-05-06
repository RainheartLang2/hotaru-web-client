import CrudNode from "../../../core/mvc/crud/CrudNode";
import {MedicalAppointment} from "../../../common/beans/MedicalAppointment";
import {AdminStateProperty} from "../AdminApplicationState";
import {ApplicationStoreFriend} from "../../../core/mvc/store/ApplicationStoreFriend";
import {DateUtils} from "../../../core/utils/DateUtils";
import {AppointmentModel} from "@devexpress/dx-react-scheduler";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import TimeValidator from "../../../core/mvc/validators/TimeValidator";
import {DialogType} from "../enum/DialogType";
import OnlyDigitsValidator from "../../../core/mvc/validators/OnlyDigitsValidator";
import EmailFormatValidator from "../../../core/mvc/validators/EmailFormatValidator";
import Time = DateUtils.Time;
import {Client} from "../../../common/beans/Client";

export default class AppointmentNode extends CrudNode<MedicalAppointment> {

    constructor(store: ApplicationStoreFriend) {
        super(store)

        this.store.registerProperty(AdminStateProperty.EditedAppointmentId, null)
        this.store.registerField(AdminStateProperty.EditedAppointmentTitle, "",
            [new RequiredFieldValidator(), new MaximalLengthValidator(100)])
        this.store.registerProperty(AdminStateProperty.EditedAppointmentDate, null)
        this.store.registerField(AdminStateProperty.EditedAppointmentStartTime, "00:00", [new TimeValidator()])
        this.store.registerField(AdminStateProperty.EditedAppointmentEndTime, "00:00", [new TimeValidator()])

        this.store.registerSelector(AdminStateProperty.AppointmentModelsList, {
            dependsOn: [AdminStateProperty.AppointmentsList],
            get: map => this.getList().map(item => this.toAppointmentModel(item))
        })

        this.store.registerSelector(AdminStateProperty.AppointmentDialogMode, {
            dependsOn: [AdminStateProperty.DialogType],
            get: map => {
                const dialogType: DialogType = map.get(AdminStateProperty.DialogType)
                switch (dialogType) {
                    case DialogType.CreateAppointment: return "create"
                    case DialogType.EditAppointment: return "edit"
                    default: return "none"
                }
            }
        })

        this.store.registerProperty(AdminStateProperty.EditedClientInfoId, null)
        this.store.registerField(AdminStateProperty.EditedClientInfoFirstName, "", [new MaximalLengthValidator(100)])
        this.store.registerField(AdminStateProperty.EditedClientInfoMiddleName, "", [new MaximalLengthValidator(100)])
        this.store.registerField(AdminStateProperty.EditedClientInfoLastName, "", [new MaximalLengthValidator(100)])
        this.store.registerField(AdminStateProperty.EditedClientInfoPhone, "", [new OnlyDigitsValidator()])
        this.store.registerField(AdminStateProperty.EditedClientInfoMail, "", [new EmailFormatValidator()])
        this.store.registerField(AdminStateProperty.EditedClientInfoAddress, "")
        this.store.registerProperty(AdminStateProperty.CreateClientInfo, false)

        const fieldsList = [
            AdminStateProperty.EditedAppointmentTitle,
            AdminStateProperty.EditedAppointmentStartTime,
            AdminStateProperty.EditedAppointmentEndTime,
            AdminStateProperty.EditedClientInfoFirstName,
            AdminStateProperty.EditedClientInfoMiddleName,
            AdminStateProperty.EditedClientInfoPhone,
            AdminStateProperty.EditedClientInfoMail,
            AdminStateProperty.EditedClientInfoAddress,
        ]
        this.store.registerSelector(AdminStateProperty.AppointmentFormHasErrors, {
            dependsOn: fieldsList,
            get: map => !this.store.fieldsHaveNoErrors(fieldsList)
        })
    }

    buildBasedOnFields(): MedicalAppointment {
        const date: Date = this.store.getPropertyValue(AdminStateProperty.EditedAppointmentDate)
        const startTime: Time = DateUtils.parseTime(this.store.getFieldValue(AdminStateProperty.EditedAppointmentStartTime))
        const endTime: Time = DateUtils.parseTime(this.store.getFieldValue(AdminStateProperty.EditedAppointmentEndTime))
        return {
            id: this.store.getPropertyValue(AdminStateProperty.EditedAppointmentId),
            title: this.store.getFieldValue(AdminStateProperty.EditedAppointmentTitle),
            startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), startTime.hours, startTime.minutes),
            endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), endTime.hours, endTime.minutes),
        }
    }

    buildClientInfo(): Client | null {
        if (!this.store.getPropertyValue(AdminStateProperty.CreateClientInfo)) {
            return null
        }
        return {
            id: this.store.getPropertyValue(AdminStateProperty.EditedClientInfoId),
            firstName: this.store.getFieldValue(AdminStateProperty.EditedClientInfoFirstName),
            middleName: this.store.getFieldValue(AdminStateProperty.EditedClientInfoMiddleName),
            lastName: this.store.getFieldValue(AdminStateProperty.EditedClientInfoLastName),
            phone: this.store.getFieldValue(AdminStateProperty.EditedClientInfoPhone),
            email: this.store.getFieldValue(AdminStateProperty.EditedClientInfoMail),
            address: this.store.getFieldValue(AdminStateProperty.EditedClientInfoAddress),
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