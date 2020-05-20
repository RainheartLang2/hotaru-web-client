import {Clinic} from "../../../common/beans/Clinic";
import TypedApplicationStoreFriend from "../../../core/mvc/store/TypedApplicationStoreFriend";
import {EmployeeSelectors, EmployeeState} from "../EmployeeApplicationStore";
import {SelectorsInfo} from "../../../core/mvc/store/TypedApplicationStore";
import {UserSelectors} from "./TypedEmployeeNode";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";

export default class TypedClinicNode {
    private _store: TypedApplicationStoreFriend<EmployeeState, EmployeeSelectors>


    constructor(store: TypedApplicationStoreFriend<EmployeeState, EmployeeSelectors>) {
        this._store = store;
    }

    public getDefaultState(): ClinicPageState {
        return {
            clinicList: []
        }
    }

    public getSelectors(): SelectorsInfo<EmployeeState & EmployeeSelectors, ClinicSelectors> {
        return {
            clinicListById: {
                dependsOn: ["clinicList"],
                get: (state: Pick<ClinicPageState, "clinicList">) => CollectionUtils.mapArrayByUniquePredicate(state.clinicList, clinic => clinic.id ? clinic.id : 0),
                value: new Map<number, Clinic>()
            },
            clinicListByIdWithMock: {
                dependsOn: ["clinicListById"],
                get: (state: Pick<ClinicSelectors, "clinicListById">) => {
                    const resultMap = new Map<number, Clinic>()
                    resultMap.set(0, Clinic.getMock())
                    CollectionUtils.mergeMaps(resultMap, state.clinicListById)
                    return resultMap
                },
                value: new Map<number, Clinic>()
            }
        }
    }
}

export type ClinicPageState = {
    clinicList: Clinic[],
}

export type ClinicSelectors = {
    clinicListById: Map<number, Clinic>,
    clinicListByIdWithMock: Map<number, Clinic>,
}