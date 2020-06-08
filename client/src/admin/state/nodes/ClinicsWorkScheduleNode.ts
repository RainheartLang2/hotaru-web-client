import {Clinic} from "../../../common/beans/Clinic";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import MessageResource from "../../../core/message/MessageResource";
import {ClinicSelectors} from "./ClinicNode";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {ClinicWorkSchedule} from "../../../common/beans/ClinicWorkSchedule";
import WorkSchedule from "../../../common/beans/WorkSchedule";

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
        return {
            clinicsWorkScheduleSelectedClinic: ClinicsWorkScheduleNode.getDefaultWorkSchedule(),
            clinicsWorkSchedulesList: [],
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
