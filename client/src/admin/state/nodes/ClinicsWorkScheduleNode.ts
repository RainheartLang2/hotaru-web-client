import {Clinic} from "../../../common/beans/Clinic";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import MessageResource from "../../../core/message/MessageResource";
import {ClinicSelectors} from "./ClinicNode";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {ClinicWorkSchedule} from "../../../common/beans/ClinicWorkSchedule";
import {ClinicWorkScheduleDeviation} from "../../../common/beans/ClinicWorkScheduleDeviation";
import {WorkScheduleDeviation} from "../../../common/beans/WorkScheduleDeviation";
import {DaySchedule} from "../../../common/beans/DaySchedule";
import {AppointmentModel} from "@devexpress/dx-react-scheduler";
import {Time} from "../../../core/utils/Time";
import {ScheduleRecord} from "../../../common/beans/ScheduleRecord";

export default class ClinicsWorkScheduleNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>

    public static defaultWorkSchedule: Clinic | null = null
    public static getDefaultWorkSchedule(): Clinic {
        if (!this.defaultWorkSchedule) {
            this.defaultWorkSchedule = {
                id: 0,
                name: MessageResource.getMessage("page.clinicsWorkSchedule.defaultWorkSchedule.name")
            }
        }
        return this.defaultWorkSchedule
    }

    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    private deviationToAppoinment(deviation: ClinicWorkScheduleDeviation): AppointmentModel {
        return {
            id: deviation.id,
            title: deviation.getName(),
            startDate: deviation.getDeviationData().getStartDate(),
            endDate: deviation.getDeviationData().getEndDate(),
        }
    }

    public getDefaultState(): ClinicsWorkScheduleState {
        let today = new Date()
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)
        const mockDeviationsList = [
            new ClinicWorkScheduleDeviation(1,
                "Изменение графика",
                true,
                new WorkScheduleDeviation(today, tomorrow, new DaySchedule([new ScheduleRecord(new Time(6, 0), new Time(17, 0))]))
            ),
        ]
        return {
            clinicsWorkScheduleSelectedClinic: ClinicsWorkScheduleNode.getDefaultWorkSchedule(),
            clinicsWorkSchedulesList: [],
            clinicsWorkScheduleDeviationsList: mockDeviationsList,
        }
    }

    public getDefaultSelectors(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, ClinicsWorkScheduleSelectors> {
        return {
            clinicsByIdWithDefaultWorkSchedule: {
                dependsOn: ["clinicListById"],
                get: (state: Pick<ClinicSelectors, "clinicListById">) => {
                    const resultMap = new Map<number, Clinic>()
                    resultMap.set(0, ClinicsWorkScheduleNode.getDefaultWorkSchedule())
                    CollectionUtils.mergeMaps(resultMap, state.clinicListById)
                    return resultMap
                },
                value: new Map<number, Clinic>()
            },
            clinicsWorkScheduleShowDefaultCheckBox: {
                dependsOn: ["clinicsWorkScheduleSelectedClinic"],
                get: (state: Pick<ClinicsWorkScheduleState, "clinicsWorkScheduleSelectedClinic">) =>
                    state.clinicsWorkScheduleSelectedClinic != ClinicsWorkScheduleNode.defaultWorkSchedule,
                value: false,
            },
            clinicsWorkScheduleDisableEditing: {
                dependsOn: [
                    "clinicsWorkSchedulesByClinicId",
                    "clinicsWorkScheduleSelectedClinic",
                ],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors,
                    "clinicsWorkSchedulesByClinicId"
                    | "clinicsWorkScheduleSelectedClinic"
                    >) => {
                        return state.clinicsWorkScheduleSelectedClinic != ClinicsWorkScheduleNode.getDefaultWorkSchedule()
                        && state.clinicsWorkSchedulesByClinicId.get(state.clinicsWorkScheduleSelectedClinic!.id!)!.usesDefault},
                value: false,
            },
            clinicsWorkSchedulesByClinicId: {
                dependsOn: ["clinicsWorkSchedulesList"],
                get: (state: Pick<ClinicsWorkScheduleState, "clinicsWorkSchedulesList">) => {
                    return CollectionUtils.mapArrayByUniquePredicate(state.clinicsWorkSchedulesList,
                                                                                    schedule => schedule.clinicId ? schedule.clinicId : 0)
                },
                value: new Map()
            },
            workScheduleForSelectedClinic: {
                dependsOn: [
                    "clinicsWorkSchedulesByClinicId",
                    "clinicsWorkScheduleSelectedClinic",
                ],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors,
                    "clinicsWorkSchedulesByClinicId"
                    | "clinicsWorkScheduleSelectedClinic"
                    >) => {
                    if (!state.clinicsWorkScheduleSelectedClinic) {
                        return null
                    }
                    const defaultWorkSchedule = ClinicsWorkScheduleNode.getDefaultWorkSchedule()
                    const selectedClinicWorkSchedule = state.clinicsWorkSchedulesByClinicId.get(state.clinicsWorkScheduleSelectedClinic.id!)
                    if (!selectedClinicWorkSchedule) {
                        return null
                    }
                    return selectedClinicWorkSchedule.usesDefault
                            ? state.clinicsWorkSchedulesByClinicId.get(defaultWorkSchedule.id!)!
                            : state.clinicsWorkSchedulesByClinicId.get(state.clinicsWorkScheduleSelectedClinic.id!)!
                },
                value: null
            },
            clinicsWorkScheduleUsesDefault: {
                dependsOn: [
                    "clinicsWorkSchedulesByClinicId",
                    "clinicsWorkScheduleSelectedClinic",
                ],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors,
                    "clinicsWorkSchedulesByClinicId"
                    | "clinicsWorkScheduleSelectedClinic"
                    >) => {
                    if (!state.clinicsWorkScheduleSelectedClinic) {
                        return false
                    }
                    const selectedClinic = state.clinicsWorkSchedulesByClinicId.get(state.clinicsWorkScheduleSelectedClinic.id!)
                    if (!selectedClinic) {
                        return true
                    }
                    return selectedClinic.usesDefault
                },
                value: true,
            },
            clinicsScheduleDeviationsById: {
                dependsOn: ["clinicsWorkScheduleDeviationsList"],
                get: (state: Pick<ClinicsWorkScheduleState, "clinicsWorkScheduleDeviationsList">) =>
                    CollectionUtils.mapIdentifiableArray(state.clinicsWorkScheduleDeviationsList),
                value: new Map(),
            },
            clinicsScheduleGlobalDeviations: {
                dependsOn: ["clinicsWorkScheduleDeviationsList"],
                get: (state: Pick<ClinicsWorkScheduleState, "clinicsWorkScheduleDeviationsList">) =>
                    state.clinicsWorkScheduleDeviationsList.filter(item => item.isGlobal()),
                value: [],
            },
            clinicsScheduleNotGlobalDeviations: {
                dependsOn: ["clinicsWorkScheduleDeviationsList"],
                get: (state: Pick<ClinicsWorkScheduleState, "clinicsWorkScheduleDeviationsList">) =>
                    state.clinicsWorkScheduleDeviationsList.filter(item => !item.isGlobal()),
                value: [],
            },
            clinicsScheduleDeviationsByClinic: {
                dependsOn: ["clinicsScheduleNotGlobalDeviations"],
                get: (state: Pick<ClinicsWorkScheduleSelectors, "clinicsScheduleNotGlobalDeviations">) =>
                    CollectionUtils.mapArrayByPredicate(state.clinicsScheduleNotGlobalDeviations, deviation => deviation.getClinicId()!),
                value: new Map(),
            },
            clinicsScheduleDeviationsForSelectedClinic: {
                dependsOn: [
                    "clinicsScheduleDeviationsByClinic",
                    "clinicsScheduleGlobalDeviations",
                    "clinicsWorkScheduleSelectedClinic"
                ],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors,
                    "clinicsScheduleDeviationsByClinic" |
                    "clinicsScheduleGlobalDeviations" |
                    "clinicsWorkScheduleSelectedClinic"
                    >) => {
                    const selectedClinic = state.clinicsWorkScheduleSelectedClinic
                    if (!selectedClinic) {
                        return state.clinicsScheduleGlobalDeviations
                    }

                    const localDeviations = state.clinicsScheduleDeviationsByClinic.get(selectedClinic.id!)

                    if (!localDeviations) {
                        return state.clinicsScheduleGlobalDeviations
                    }

                    return state.clinicsScheduleDeviationsByClinic.get(selectedClinic.id!)!
                        .concat(state.clinicsScheduleGlobalDeviations)
                },
                value: [],
            },
            clinicsScheduleDeviationsAppointments: {
                dependsOn: ["clinicsScheduleDeviationsForSelectedClinic"],
                get: (state: Pick<ClinicsWorkScheduleSelectors, "clinicsScheduleDeviationsForSelectedClinic">) =>
                    state.clinicsScheduleDeviationsForSelectedClinic.map(deviation => this.deviationToAppoinment(deviation)),
                value: [],
            }
        }
    }
}

export type ClinicsWorkScheduleState = {
    clinicsWorkScheduleSelectedClinic: Clinic | null,
    clinicsWorkSchedulesList: ClinicWorkSchedule[],
    clinicsWorkScheduleDeviationsList: ClinicWorkScheduleDeviation[],
}

export type ClinicsWorkScheduleSelectors = {
    clinicsByIdWithDefaultWorkSchedule: Map<number, Clinic>,
    clinicsWorkSchedulesByClinicId: Map<number, ClinicWorkSchedule>,
    workScheduleForSelectedClinic: ClinicWorkSchedule | null,
    clinicsWorkScheduleShowDefaultCheckBox: boolean,
    clinicsWorkScheduleDisableEditing: boolean,
    clinicsWorkScheduleUsesDefault: boolean,
    clinicsScheduleDeviationsById: Map<number, ClinicWorkScheduleDeviation>,
    clinicsScheduleGlobalDeviations: ClinicWorkScheduleDeviation[],
    clinicsScheduleNotGlobalDeviations: ClinicWorkScheduleDeviation[],
    clinicsScheduleDeviationsByClinic: Map<number, ClinicWorkScheduleDeviation[]>,
    clinicsScheduleDeviationsForSelectedClinic: ClinicWorkScheduleDeviation[],
    clinicsScheduleDeviationsAppointments: AppointmentModel[],
}
