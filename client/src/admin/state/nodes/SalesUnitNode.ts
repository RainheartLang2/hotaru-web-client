import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import SalesUnit from "../../../common/beans/SalesUnit";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";

export default class SalesUnitNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): SalesUnitState {
        return {
            salesUnitList: [],
            editedSalesUnitId: null,
            editedSalesUnitName: "",
        }
    }

    public getSelectors(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, SalesUnitSelectors> {
        return {
            salesUnitListById: {
                dependsOn: ["salesUnitList"],
                get: (state: Pick<SalesUnitState, "salesUnitList">) =>
                    CollectionUtils.mapIdentifiableArray(state.salesUnitList),
                value: new Map(),
            }
        }
    }
}

export type SalesUnitState = {
    salesUnitList: SalesUnit[],
    editedSalesUnitId: number | null,
    editedSalesUnitName: string,
}

export type SalesUnitSelectors = {
    salesUnitListById: Map<number, SalesUnit>
}