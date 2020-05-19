import {Clinic} from "../../../common/beans/Clinic";
import TypedApplicationStoreFriend from "../../../core/mvc/store/TypedApplicationStoreFriend";
import {EmployeeDerivation, EmployeeState} from "../EmployeeApplicationStore";

export default class TypedClinicNode {
    private _store: TypedApplicationStoreFriend<EmployeeState, EmployeeDerivation>


    constructor(store: TypedApplicationStoreFriend<EmployeeState, EmployeeDerivation>) {
        this._store = store;
    }

    public getDefaultState(): ClinicPageState {
        return {
            clinicList: []
        }
    }
}

export type ClinicPageState = {
    clinicList: Clinic[]
}