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
import MessageResource from "../../../core/message/MessageResource";
import {CommonUtils} from "../../../core/utils/CommonUtils";
import {DaySchedule} from "../../../common/beans/DaySchedule";
import {PageType} from "../enum/PageType";
import {DateUtils} from "../../../core/utils/DateUtils";
import {WorkScheduleUtils} from "../../../core/utils/WorkScheduleUtils";
import {NumberUtils} from "../../../core/utils/NumberUtils";
import CallbackValidator from "../../../core/mvc/validators/CallbackValidator";

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
            saveClientAsPermanent: false,
            editedClientInfoId: 0,
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
        const timeValidator = new CallbackValidator<string>(() =>
                MessageResource.getMessage("page.schedule.workingTime.validator.message"),
            (value: string) => {
                const startTime = DateUtils.parseTime(this._store.state.editedAppointmentStartTime)
                const endTime = DateUtils.parseTime(this._store.state.editedAppointmentEndTime)
                if (!startTime || !endTime || this._store.state.personalSchedule.length == 0) {
                    return true
                }

                const date = this._store.state.editedAppointmentDate
                const daySchedule = this._store.state.personalSchedule[date.getDay()]
                return daySchedule.includes(startTime.mergeWithDate(date), endTime.mergeWithDate(date))
            }
        )
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
            editedClientPetNameField: this._store.createField("editedClientPetName", "", []),
            editedAppointmentStartTimeField: this._store.createField("editedAppointmentStartTime", "", []),
            editedAppointmentEndTimeField: this._store.createField("editedAppointmentEndTime", "", []),
            appointmentFormHasStandardErrors: this._store.createFormHasErrorsSelector([
                "editedAppointmentStartTimeField",
                "editedAppointmentEndTimeField"]),
            appointmentFormHasErrors: {
                dependsOn: ["appointmentFormHasStandardErrors",
                    "saveClientAsPermanent",
                    "editedClientNameField",
                    "editedClientPhoneField",
                    "appointmentDialogErrorMessage",
                ],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors, "appointmentFormHasStandardErrors"
                    | "saveClientAsPermanent"
                    | "editedClientNameField"
                    | "editedClientPhoneField"
                    | "appointmentDialogErrorMessage"
                    >) => {
                    return !!state.appointmentDialogErrorMessage ||
                        (state.appointmentFormHasStandardErrors
                            || (state.saveClientAsPermanent
                                && CommonUtils.allFieldsAreEmpty([state.editedClientPhoneField,
                                    state.editedClientNameField]))
                        )
                },
                value: false,
            },
            appointmentDialogErrorMessage: {
                dependsOn: ["clientNameOrPhoneNotEntered", "createClientInfo", "saveClientAsPermanent",
                            "editedAppointmentStartTimeField", "editedAppointmentEndTimeField", "editedAppointmentDate", "personalSchedule"],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors, "clientNameOrPhoneNotEntered"
                    | "createClientInfo"
                    | "saveClientAsPermanent"
                    | "editedAppointmentStartTimeField"
                    | "editedAppointmentEndTimeField"
                    | "editedAppointmentDate"
                    | "personalSchedule"
                    >) => {
                    if (state.createClientInfo && state.saveClientAsPermanent && state.clientNameOrPhoneNotEntered) {
                        return MessageResource.getMessage("dialog.appointment.permanentClient.nameOrPhone.error")
                    }
                    const startTime = DateUtils.parseTime(state.editedAppointmentStartTimeField.value)
                    const endTime = DateUtils.parseTime(state.editedAppointmentEndTimeField.value)
                    if (startTime && endTime && state.personalSchedule.length > 0) {
                        const daySchedule = state.personalSchedule[state.editedAppointmentDate.getDay()]
                        const startDate = startTime.mergeWithDate(state.editedAppointmentDate)
                        const endDate = startTime.mergeWithDate(state.editedAppointmentDate)
                        if (!daySchedule.includes(startDate, endDate)) {
                            return MessageResource.getMessage("page.schedule.workingTime.validator.message")
                        }
                    }
                    return ""
                },
                value: "",
            },
            schedulePageWeek: {
                dependsOn: ["schedulePageDate"],
                get: (state: Pick<ScheduleState, "schedulePageDate">) => DateUtils.getWeekByDate(state.schedulePageDate),
                value: [],
            },
            personalSchedule: {
                dependsOn: [
                    "pageType",
                    "defaultEmployeeWorkSchedules",
                    "nonDefaultEmployeeWorkSchedules",
                    "schedulePageWeek",
                    "employeeWorkScheduleDeviationsList",
                ],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors,
                    "pageType"
                    | "defaultEmployeeWorkSchedules"
                    | "nonDefaultEmployeeWorkSchedules"
                    | "schedulePageWeek"
                    | "employeeWorkScheduleDeviationsList"
                    >) => {
                    if (state.pageType != PageType.Schedule) {
                        return []
                    }

                    const result: DaySchedule[] = []
                    state.schedulePageWeek.forEach(day => {
                        let daySchedule = WorkScheduleUtils.getDayScheduleForDateFromDeviations(state.employeeWorkScheduleDeviationsList, day)
                        if (!daySchedule) {
                            daySchedule = (WorkScheduleUtils.getDayScheduleForDate(
                                state.nonDefaultEmployeeWorkSchedules,
                                state.defaultEmployeeWorkSchedules,
                                day
                            ))
                        }
                        result.push(daySchedule)
                    })
                    return result
                },
                value: [],
            },
            personalScheduleHours: {
                dependsOn: ["personalSchedule"],
                get: (state: Pick<ScheduleSelectors, "personalSchedule">) => {
                    let min = 24
                    let max = 0
                    state.personalSchedule.forEach(schedule => {
                        min = Math.min(min, schedule.getMinTime() ? schedule.getMinTime()!.getHours() : min)
                        max = Math.max(max, schedule.getMaxTime() ? schedule.getMaxTime()!.getHours() : max)
                    })
                    if (min == 24) {
                        return [0, 24]
                    }
                    return [min, max]
                },
                value: [0, 24],
            }
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
    saveClientAsPermanent: boolean,
    editedClientInfoId: number,
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
    editedClientPetNameField: Field,
    appointmentFormHasStandardErrors: boolean,
    appointmentFormHasErrors: boolean,
    appointmentDialogErrorMessage: string,

    schedulePageWeek: Date[],
    personalSchedule: DaySchedule[],
    personalScheduleHours: [number, number]
}