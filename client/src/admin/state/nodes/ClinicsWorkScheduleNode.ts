import {Clinic} from "../../../common/beans/Clinic";
import {WeekDay} from "../../../common/beans/enums/WeekDay";
import {DaySchedule} from "../../../common/beans/DaySchedule";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import MessageResource from "../../../core/message/MessageResource";
import {ClinicSelectors} from "./ClinicNode";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";

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
            clinicsSchedule: new Map(),
            clinicsWorkScheduleUseDefault: true,
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

            }
        }
    }
}

export type ClinicsWorkScheduleState = {
    clinicsWorkScheduleSelectedClinic: Clinic | null,
    clinicsSchedule: Map<WeekDay, DaySchedule>,
    clinicsWorkScheduleUseDefault: boolean,
}

export type ClinicsWorkScheduleSelectors = {
    clinicsByIdWithDefaultWorkSchedule: Map<number, Clinic>,
    clinicsWorkScheduleShowDefaultCheckBox: boolean,
}
