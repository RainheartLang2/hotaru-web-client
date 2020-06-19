import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import MessageResource from "../../../core/message/MessageResource";
import {Employee} from "../../../common/beans/Employee";
import {NameUtils} from "../../../core/utils/NameUtils";
import EmployeeWorkSchedule from "../../../common/beans/EmployeeWorkSchedule";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import WorkSchedule from "../../../common/beans/WorkSchedule";
import {DaySchedule} from "../../../common/beans/DaySchedule";
import {WorkScheduleDeviationContainer} from "../../../common/beans/WorkScheduleDeviationContainer";
import {AppointmentModel} from "@devexpress/dx-react-scheduler";
import {ClinicsWorkScheduleSelectors, ClinicsWorkScheduleState} from "./ClinicsWorkScheduleNode";

export default class EmployeeWorkScheduleNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>

    public static defaultWorkSchedule: EmployeeRecord | null
    public static getDefaultWorkSchedule(): EmployeeRecord {
        if (!this.defaultWorkSchedule) {
            this.defaultWorkSchedule = {
                id: 0,
                name: MessageResource.getMessage("page.employeesWorkSchedule.defaultWorkSchedule.name")
            }
        }
        return this.defaultWorkSchedule
    }

    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): EmployeeWorkScheduleState {
        return {
            employeeScheduleSelectedEmployee: EmployeeWorkScheduleNode.getDefaultWorkSchedule(),
            employeeWorkSchedulesList: [],
            employeeWorkScheduleDeviationsList: [],
        }
    }

    public getDefaultSelectors(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, EmployeeScheduleSelectors> {
        return {
            employeeRecordsById: {
                dependsOn: ["userList"],
                get: (state: Pick<EmployeeAppState, "userList">) => {
                    const records = state.userList.map(employee => getRecordFromEmployee(employee))
                    const recordsById = CollectionUtils.mapArrayByUniquePredicate(records, record => record.id)

                    const result = new Map<number, EmployeeRecord>()
                    const defaultRecord = EmployeeWorkScheduleNode.getDefaultWorkSchedule()
                    result.set(defaultRecord.id, defaultRecord)

                    CollectionUtils.mergeMaps(result, recordsById)
                    return result
                },
                value: new Map(),
            },
            employeeSchedulesByEmployeeId: {
                dependsOn: ["employeeWorkSchedulesList"],
                get: (state: Pick<EmployeeWorkScheduleState, "employeeWorkSchedulesList">) =>
                    CollectionUtils.mapArrayByUniquePredicate(state.employeeWorkSchedulesList,
                            schedule => schedule.getEmployeeId() ? schedule.getEmployeeId()! : 0),
                value: new Map(),
            },
            scheduleForSelectedEmployee: {
                dependsOn: ["employeeScheduleSelectedEmployee", "employeeSchedulesByEmployeeId"],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors,
                    "employeeScheduleSelectedEmployee"
                    | "employeeSchedulesByEmployeeId">) => {
                    if (!state.employeeScheduleSelectedEmployee) {
                        return null
                    }
                    const defaultWorkSchedule = EmployeeWorkScheduleNode.getDefaultWorkSchedule()
                    const employeeWorkSchedule = state.employeeSchedulesByEmployeeId.get(state.employeeScheduleSelectedEmployee.id)
                    if (!employeeWorkSchedule) {
                        return null
                    }
                    const result = employeeWorkSchedule.isUsesDefault()
                        ? state.employeeSchedulesByEmployeeId.get(defaultWorkSchedule.id)!
                        : employeeWorkSchedule
                    console.log(result)
                    return result
                },
                value: null,
            },
            employeeScheduleShowDefaultCheckBox: {
                dependsOn: ["employeeScheduleSelectedEmployee"],
                get: (state: Pick<EmployeeWorkScheduleState, "employeeScheduleSelectedEmployee">) =>
                    state.employeeScheduleSelectedEmployee != EmployeeWorkScheduleNode.getDefaultWorkSchedule(),
                value: false,
            },
            employeeScheduleDisableEditing: {
                dependsOn: [
                    "employeeSchedulesByEmployeeId",
                    "employeeScheduleSelectedEmployee"
                ],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors,
                    "employeeSchedulesByEmployeeId" |
                    "employeeScheduleSelectedEmployee">) => {
                    return state.employeeScheduleSelectedEmployee != EmployeeWorkScheduleNode.getDefaultWorkSchedule()
                        && state.employeeSchedulesByEmployeeId.get(state.employeeScheduleSelectedEmployee!.id)!.isUsesDefault()
                },
                value: false,
            },
            employeeScheduleUsesDefault: {
                dependsOn: [
                    "employeeSchedulesByEmployeeId",
                    "employeeScheduleSelectedEmployee"
                ],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors,
                    "employeeSchedulesByEmployeeId" |
                    "employeeScheduleSelectedEmployee">) => {
                    if (!state.employeeScheduleSelectedEmployee) {
                        return false
                    }
                    const selectedClinic = state.employeeSchedulesByEmployeeId.get(state.employeeScheduleSelectedEmployee.id)
                    if (!selectedClinic) {
                        return true
                    }
                    return selectedClinic.isUsesDefault()
                },
                value: false,
            },
            employeeScheduleDeviationsById: {
                dependsOn: ["employeeWorkScheduleDeviationsList"],
                get: (state: Pick<EmployeeWorkScheduleState, "employeeWorkScheduleDeviationsList">) =>
                    CollectionUtils.mapIdentifiableArray(state.employeeWorkScheduleDeviationsList),
                value: new Map(),
            },
            employeeScheduleGlobalDeviations: {
                dependsOn: ["employeeWorkScheduleDeviationsList"],
                get: (state: Pick<EmployeeWorkScheduleState, "employeeWorkScheduleDeviationsList">) =>
                    state.employeeWorkScheduleDeviationsList.filter(item => item.isGlobal()),
                value: [],
            },
            employeeScheduleNotGlobalDeviations: {
                dependsOn: ["employeeWorkScheduleDeviationsList"],
                get: (state: Pick<EmployeeWorkScheduleState, "employeeWorkScheduleDeviationsList">) =>
                    state.employeeWorkScheduleDeviationsList.filter(item => !item.isGlobal()),
                value: [],
            },
            employeeScheduleDeviationsByWorkSchedule: {
                dependsOn: ["employeeScheduleNotGlobalDeviations"],
                get: (state: Pick<EmployeeScheduleSelectors, "employeeScheduleNotGlobalDeviations">) =>
                    CollectionUtils.mapArrayByPredicate(state.employeeScheduleNotGlobalDeviations, deviation => deviation.getWorkScheduleId()!),
                value: new Map(),
            },
            employeeScheduleDeviationsForSelectedSchedule: {
                dependsOn: [
                    "employeeScheduleDeviationsByWorkSchedule",
                    "employeeScheduleGlobalDeviations",
                    "scheduleForSelectedEmployee",
                ],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors,
                    "employeeScheduleDeviationsByWorkSchedule" |
                    "employeeScheduleGlobalDeviations" |
                    "scheduleForSelectedEmployee"
                    >) => {
                    const currentWorkSchedule = state.scheduleForSelectedEmployee
                    if (!currentWorkSchedule) {
                        return state.employeeScheduleGlobalDeviations
                    }

                    const workScheduleId = currentWorkSchedule.id!

                    const localDeviations = state.employeeScheduleDeviationsByWorkSchedule.get(workScheduleId)

                    if (!localDeviations) {
                        return state.employeeScheduleGlobalDeviations
                    }

                    return state.employeeScheduleDeviationsByWorkSchedule.get(workScheduleId)!
                        .concat(state.employeeScheduleGlobalDeviations)
                },
                value: [],
            },
            employeeScheduleDeviationsAppointments: {
                dependsOn: ["employeeScheduleDeviationsForSelectedSchedule"],
                get: (state: Pick<EmployeeScheduleSelectors, "employeeScheduleDeviationsForSelectedSchedule">) =>
                    state.employeeScheduleDeviationsForSelectedSchedule.map(deviation => deviation.toAppointmentModel()),
                value: [],
            }
        }
    }
}

function getRecordFromEmployee(employee: Employee): EmployeeRecord {
    return {
        id: employee.id!,
        name: NameUtils.formatName(employee),
    }
}
export type EmployeeRecord = {
    id: number,
    name: string,
}

export type EmployeeWorkScheduleState = {
    employeeScheduleSelectedEmployee: EmployeeRecord | null,
    employeeWorkSchedulesList: EmployeeWorkSchedule[],
    employeeWorkScheduleDeviationsList: WorkScheduleDeviationContainer[],
}

export type EmployeeScheduleSelectors = {
    employeeRecordsById: Map<number, EmployeeRecord>,
    employeeSchedulesByEmployeeId: Map<number, EmployeeWorkSchedule>,
    scheduleForSelectedEmployee: EmployeeWorkSchedule | null,
    employeeScheduleShowDefaultCheckBox: boolean,
    employeeScheduleDisableEditing: boolean,
    employeeScheduleUsesDefault: boolean,
    employeeScheduleDeviationsById: Map<number, WorkScheduleDeviationContainer>,
    employeeScheduleGlobalDeviations: WorkScheduleDeviationContainer[],
    employeeScheduleNotGlobalDeviations: WorkScheduleDeviationContainer[],
    employeeScheduleDeviationsByWorkSchedule: Map<number, WorkScheduleDeviationContainer[]>,
    employeeScheduleDeviationsForSelectedSchedule: WorkScheduleDeviationContainer[],
    employeeScheduleDeviationsAppointments: AppointmentModel[],
}

