import {Clinic} from "../../../common/beans/Clinic";
import {WeekDay} from "../../../common/beans/enums/WeekDay";
import {DaySchedule} from "../../../common/beans/DaySchedule";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import MessageResource from "../../../core/message/MessageResource";
import {ClinicSelectors} from "./ClinicNode";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {ClinicWorkSchedule} from "../../../common/beans/ClinicWorkSchedule";
import WorkSchedule from "../../../common/beans/WorkSchedule";
import {ScheduleRecord} from "../../../common/beans/ScheduleRecord";
import {Time} from "../../../core/utils/Time";

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

    public getDefaultState(): ClinicsWorkScheduleState {
        //TODO: mock
        const mondaySchedule = new DaySchedule([
            new ScheduleRecord(new Time(0, 0), new Time(23, 59))
        ])
        const tuesdaySchedule = new DaySchedule([])
        const wednesdaySchedule = new DaySchedule([
            new ScheduleRecord(new Time(9, 0), new Time(21, 0))
        ])
        const thursdaySchedule = new DaySchedule([
            new ScheduleRecord(new Time(0, 0), new Time(13, 0)),
            new ScheduleRecord(new Time(14, 0), new Time(21, 0)),
        ])
        const workScheduleMap = new Map<WeekDay, DaySchedule>()
        workScheduleMap.set(0, mondaySchedule)
        workScheduleMap.set(1, tuesdaySchedule)
        workScheduleMap.set(2, wednesdaySchedule)
        workScheduleMap.set(3, thursdaySchedule)
        const workSchedule = new WorkSchedule(7, workScheduleMap)
        const scheduleList = [
            new ClinicWorkSchedule(1, workSchedule, false, true, 1),
            new ClinicWorkSchedule(2, workSchedule, true, false, 0),
        ]
        return {
            clinicsWorkScheduleSelectedClinic: ClinicsWorkScheduleNode.getDefaultWorkSchedule(),
            clinicsWorkSchedulesList: scheduleList,
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
                    const selectedClinicWorkSchedule = state.clinicsWorkSchedulesByClinicId.get(state.clinicsWorkScheduleSelectedClinic.id!)!
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
                    return state.clinicsWorkSchedulesByClinicId.get(state.clinicsWorkScheduleSelectedClinic.id!)!.usesDefault
                },
                value: true,
            }
        }
    }
}

export type ClinicsWorkScheduleState = {
    clinicsWorkScheduleSelectedClinic: Clinic | null,
    clinicsWorkSchedulesList: ClinicWorkSchedule[],
}

export type ClinicsWorkScheduleSelectors = {
    clinicsByIdWithDefaultWorkSchedule: Map<number, Clinic>,
    clinicsWorkSchedulesByClinicId: Map<number, ClinicWorkSchedule>,
    workScheduleForSelectedClinic: ClinicWorkSchedule | null,
    clinicsWorkScheduleShowDefaultCheckBox: boolean,
    clinicsWorkScheduleDisableEditing: boolean,
    clinicsWorkScheduleUsesDefault: boolean,
}
