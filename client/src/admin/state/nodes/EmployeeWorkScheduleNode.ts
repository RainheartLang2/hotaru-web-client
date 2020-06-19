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
            employeeWorkSchedulesList: [new EmployeeWorkSchedule(1, 1, false, true, new WorkSchedule(2, false, CollectionUtils.fillArray(2, new DaySchedule([])))),
                                        new EmployeeWorkSchedule(2, 0, true, false, new WorkSchedule(10, false, CollectionUtils.fillArray(10, new DaySchedule([]))))],
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
    employeeWorkSchedulesList: EmployeeWorkSchedule[]
}

export type EmployeeScheduleSelectors = {
    employeeRecordsById: Map<number, EmployeeRecord>,
    employeeSchedulesByEmployeeId: Map<number, EmployeeWorkSchedule>,
    scheduleForSelectedEmployee: EmployeeWorkSchedule | null,
    employeeScheduleShowDefaultCheckBox: boolean,
    employeeScheduleDisableEditing: boolean,
    employeeScheduleUsesDefault: boolean,
}

