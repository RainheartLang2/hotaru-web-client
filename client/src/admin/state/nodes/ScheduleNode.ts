import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {DialogType} from "../enum/DialogType";
import {AppointmentModel} from "@devexpress/dx-react-scheduler";
import {ConfigureDialogType} from "../../../core/types/ConfigureDialogType";
import {Employee} from "../../../common/beans/Employee";
import Species from "../../../common/beans/Species";
import Breed from "../../../common/beans/Breed";
import {MedicalAppointment} from "../../../common/beans/MedicalAppointment";
import {Field} from "../../../core/mvc/store/Field";

export default class ScheduleNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): ScheduleState {
        return {
            appointmentsList: [],
            schedulePageDate: new Date(),
            selectedEmployeeForSchedulePage: undefined,
            editedAppointmentId: 0,
            editedAppointmentTitle: "",
            editedAppointmentDate: new Date(),
            editedAppointmentStartTime: "00:00",
            editedAppointmentEndTime: "00:00",
            createClientInfo: false,
            editedClientInfoId: 0,
            editedClientInfoFirstName: "",
            editedClientInfoPhone: "",
            editedClientInfoMail: "",
            editedClientInfoAddress: "",
            editedClientPetId: 0,
            editedClientPetName: "",
            editedClientSelectedSpecies: Species.getMock(),
            editedClientSelectedBreed: Breed.getMock(),
        }
    }

    private toAppointmentModel(appointment: MedicalAppointment): AppointmentModel {
        return {
            id: appointment.id,
            title: appointment.title,
            startDate: appointment.startDate,
            endDate: appointment.endDate,
        }
    }

    public getSelectors(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, ScheduleSelectors> {
        return {
            appointmentsListById: {
                dependsOn: ["appointmentsList"],
                get: (state: Pick<ScheduleState, "appointmentsList">) =>
                    CollectionUtils.mapArrayByUniquePredicate(state.appointmentsList, appointment => appointment.id ? appointment.id: 0),
                value: new Map<number, MedicalAppointment>(),
            },
            appointmentsForSelectedMedic: {
                dependsOn: ["selectedEmployeeForSchedulePage", "appointmentsList"],
                get: (state: Pick<ScheduleState, "selectedEmployeeForSchedulePage" | "appointmentsList">) => {
                    const selectedEmployee = state.selectedEmployeeForSchedulePage
                    if (selectedEmployee) {
                        return state.appointmentsList.filter(appointment => appointment.medicId == selectedEmployee.id)
                    } else {
                        return []
                    }
                },
                value: [],
            },
            appointmentsModelList: {
                dependsOn: ["appointmentsForSelectedMedic"],
                get: (state: Pick<ScheduleSelectors, "appointmentsForSelectedMedic">) => {
                    return state.appointmentsForSelectedMedic.map(item => this.toAppointmentModel(item))
                },
                value: [],
            },
            appointmentDialogMode: {
                dependsOn: ["dialogType"],
                get: (state: Pick<EmployeeAppState, "dialogType">) => {
                    switch (state.dialogType) {
                        case DialogType.CreateAppointment: return "create"
                        case DialogType.EditAppointment: return "edit"
                        default: return "none"
                    }
                },
                value: "none",
            },
            editedClientPetSpecies: {
                dependsOn: ["speciesListById"],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors, "speciesListById">) => {
                    const result = CollectionUtils.cloneMap(state.speciesListById)
                    result.set(0, Species.getMock())
                    return result
                },
                value: new Map<number, Species>(),
            },
            editedClientPetBreeds: {
                dependsOn: ["breedsList", "editedClientSelectedSpecies"],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors, "breedsList" | "editedClientSelectedSpecies">) => {
                    const breeds = (state.breedsList).filter(breed => breed.speciesId == state.editedClientSelectedSpecies.id)
                    breeds.push(Breed.getMock())
                    const result = CollectionUtils.mapArrayByUniquePredicate(breeds, breed => breed.id ? breed.id : 0)
                    return result
                },
                value: new Map<number, Breed>(),
            },
            editedAppointmentTitleField: this._store.createField("editedAppointmentTitle", "", []),
            editedClientInfoFirstNameField: this._store.createField("editedClientInfoFirstName", "", []),
            editedClientInfoPhoneField: this._store.createField("editedClientInfoPhone", "", []),
            editedClientInfoMailField: this._store.createField("editedClientInfoMail", "", []),
            editedClientInfoAddressField: this._store.createField("editedClientInfoAddress", "", []),
            editedClientPetNameField: this._store.createField("editedClientPetName", "", []),
            editedAppointmentStartTimeField: this._store.createField("editedAppointmentStartTime", "", []),
            editedAppointmentEndTimeField: this._store.createField("editedAppointmentEndTime", "", []),
            appointmentFormHasErrors: this._store.createFormHasErrorsSelector([]),
        }
    }
}

export type ScheduleState = {
    appointmentsList: MedicalAppointment[],
    schedulePageDate: Date,
    selectedEmployeeForSchedulePage: Employee | undefined,
    editedAppointmentId: number,
    editedAppointmentTitle: string,
    editedAppointmentDate: Date,
    editedAppointmentStartTime: string,
    editedAppointmentEndTime: string,
    createClientInfo: boolean,
    editedClientInfoId: number,
    editedClientInfoFirstName: string,
    editedClientInfoPhone: string,
    editedClientInfoMail: string,
    editedClientInfoAddress: string,
    editedClientPetId: number,
    editedClientPetName: string,
    editedClientSelectedSpecies: Species,
    editedClientSelectedBreed: Breed,
}

export type ScheduleSelectors = {
    appointmentsListById: Map<number, MedicalAppointment>,
    appointmentsForSelectedMedic: MedicalAppointment[],
    appointmentsModelList: AppointmentModel[],
    appointmentDialogMode: ConfigureDialogType,
    editedClientPetSpecies: Map<number, Species>,
    editedClientPetBreeds: Map<number, Breed>,
    editedAppointmentStartTimeField: Field,
    editedAppointmentEndTimeField: Field,
    editedAppointmentTitleField: Field,
    editedClientInfoFirstNameField: Field,
    editedClientInfoPhoneField: Field,
    editedClientInfoMailField: Field,
    editedClientInfoAddressField: Field,
    editedClientPetNameField: Field,
    appointmentFormHasErrors: boolean,
}