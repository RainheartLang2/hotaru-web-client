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
import {Client} from "../../../common/beans/Client";
import {Employee} from "../../../common/beans/Employee";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import Species from "../../../common/beans/Species";
import Breed from "../../../common/beans/Breed";
import Time = DateUtils.Time;
import {Pet} from "../../../common/beans/Pet";

export default class AppointmentNode extends CrudNode<MedicalAppointment> {

    constructor(store: ApplicationStoreFriend) {
        super(store)

        this.store.registerProperty(AdminStateProperty.EditedAppointmentId, null)
        this.store.registerField(AdminStateProperty.EditedAppointmentTitle, "",
            [new RequiredFieldValidator(), new MaximalLengthValidator(100)])
        this.store.registerProperty(AdminStateProperty.SchedulePageDate, new Date())
        this.store.registerProperty(AdminStateProperty.EditedAppointmentDate, null)
        this.store.registerField(AdminStateProperty.EditedAppointmentStartTime, "00:00", [new TimeValidator()])
        this.store.registerField(AdminStateProperty.EditedAppointmentEndTime, "00:00", [new TimeValidator()])

        this.store.registerProperty(AdminStateProperty.SelectedEmployeeForSchedulePage, null)

        this.store.registerSelector(AdminStateProperty.AppointmentsForSelectedMedic, {
            dependsOn: [AdminStateProperty.SelectedEmployeeForSchedulePage, AdminStateProperty.AppointmentsList],
            get: map => {
                const selectedMedic: Employee = map.get(AdminStateProperty.SelectedEmployeeForSchedulePage)
                return this.getList().filter(appointment => appointment.medicId == selectedMedic.id)
            }
        })
        this.store.registerSelector(AdminStateProperty.AppointmentModelsList, {
            dependsOn: [AdminStateProperty.AppointmentsForSelectedMedic],
            get: map => {
                const appointmentsForSelectedMedic: MedicalAppointment[] = map.get(AdminStateProperty.AppointmentsForSelectedMedic)
                return appointmentsForSelectedMedic.map(item => this.toAppointmentModel(item))
            }
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

        this.store.registerProperty(AdminStateProperty.EditedClientPetId, 0)
        this.store.registerField(AdminStateProperty.EditedClientPetName, "", [new MaximalLengthValidator(100)])
        this.store.registerSelector(AdminStateProperty.EditedClientPetSpecies, {
            dependsOn: [AdminStateProperty.SpeciesListById],
            get: map => {
                const result = CollectionUtils.cloneMap(map.get(AdminStateProperty.SpeciesListById) as Map<number, Species>)
                result.set(0, Species.getMock())
                return result
            }
        })
        this.store.registerProperty(AdminStateProperty.EditedClientSelectedSpecies, null)

        this.store.registerSelector(AdminStateProperty.EditedClientPetBreeds, {
            dependsOn: [AdminStateProperty.BreedsList, AdminStateProperty.EditedClientSelectedSpecies],
            get: map => {
                const selectedSpecies: Species | null = map.get(AdminStateProperty.EditedClientSelectedSpecies)
                if (!selectedSpecies) {
                    return [Breed.getMock()]
                }
                const breeds = (map.get(AdminStateProperty.BreedsList) as Breed[]).filter(breed => breed.speciesId == selectedSpecies.id)
                breeds.push(Breed.getMock())
                const result = CollectionUtils.mapArrayByUniquePredicate(breeds, breed => breed.id)
                return result
            }
        })

        this.store.registerProperty(AdminStateProperty.EditedClientSelectedBreed, null)

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
        const selectedMedic = this.getSelectedMedic()
        if (!selectedMedic.id) {
            throw new Error("medic id should be defined")
        }
        return {
            id: this.store.getPropertyValue(AdminStateProperty.EditedAppointmentId),
            title: this.store.getFieldValue(AdminStateProperty.EditedAppointmentTitle),
            startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), startTime.hours, startTime.minutes),
            endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), endTime.hours, endTime.minutes),
            medicId: selectedMedic.id,
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

    buildPetInfo(): Pet | null {
        if (!this.store.getPropertyValue(AdminStateProperty.CreateClientInfo)) {
            return null
        }
        const selectedBreed: Breed  = this.store.getPropertyValue(AdminStateProperty.EditedClientSelectedBreed)
        return {
            id: this.store.getPropertyValue(AdminStateProperty.EditedClientPetId),
            name: this.store.getFieldValue(AdminStateProperty.EditedClientPetName),
            ownerId: this.store.getPropertyValue(AdminStateProperty.EditedClientInfoId),
            breedId: selectedBreed ? selectedBreed.id : undefined,
        }
    }

    protected getListPropertyName(): string {
        return AdminStateProperty.AppointmentsList;
    }

    protected getMapByIdPropertyName(): string {
        return AdminStateProperty.AppointmentsListById;
    }

    protected getSelectedMedic(): Employee {
        return this.store.getPropertyValue(AdminStateProperty.SelectedEmployeeForSchedulePage)
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