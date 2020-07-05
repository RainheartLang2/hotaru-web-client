import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import Stock from "../../../common/beans/Storage";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import Species from "../../../common/beans/Species";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import {SpeciesPageSelector, SpeciesPageState} from "./SpeciesNode";

export default class StockNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): StockState {
        return {
            stocksList: []
        }
    }

    public getSelectors(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, StockSelectors> {
        return {
            stocksById: {
                dependsOn: ["stocksList"],
                get: (state: Pick<StockState, "stocksList">) =>
                    CollectionUtils.mapIdentifiableArray(state.stocksList),
                value: new Map<number, Stock>(),
            },
        }
    }
}

export type StockState = {
    stocksList: Stock[]
}

export type StockSelectors = {
    stocksById: Map<number, Stock>
}