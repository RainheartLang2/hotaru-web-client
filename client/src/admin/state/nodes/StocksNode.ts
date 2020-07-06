import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import Stock from "../../../common/beans/Storage";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {StockType} from "../../../common/beans/enums/StockType";
import {Clinic} from "../../../common/beans/Clinic";
import {Employee} from "../../../common/beans/Employee";
import {Field} from "../../../core/mvc/store/Field";
import {ConfigureType} from "../../../core/types/ConfigureType";
import {ValidatorUtils} from "../../../core/utils/ValidatorUtils";
import {DialogType} from "../enum/DialogType";

export default class StockNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): StockState {
        const stockTypesMap = new Map<number, StockType>()
        stockTypesMap.set(StockType.stockTypeToNumber(StockType.Selling), StockType.Selling)
        stockTypesMap.set(StockType.stockTypeToNumber(StockType.Storing), StockType.Storing)
        return {
            stocksList: [],
            stockTypes: stockTypesMap,
            editedStockId: null,
            editedStockName: "",
            editedStockType: StockType.getDefaultType(),
            editedStockClinic: null,
            editedStockEmployee: null,
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
            editedStockNameField: this._store.createField("editedStockName", "",
                ValidatorUtils.getStandardTextValidators(100)),
            stockDialogMode: {
                dependsOn: ["dialogType"],
                get: (state: Pick<EmployeeAppState, "dialogType">) => {
                    switch (state.dialogType) {
                        case DialogType.CreateStock:
                            return "create"
                        case DialogType.EditStock:
                            return "edit"
                        default:
                            return "none"
                    }
                },
                value: "none",
            },
            editedStockUsersForSelectedClinic: {
                dependsOn: ["userList", "editedStockClinic"],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors, "userList" | "editedStockClinic">) => {
                    if (!state.editedStockClinic) {
                        return state.userList
                    }
                    return state.userList.filter(user => !user.clinicId || user.clinicId == state.editedStockClinic!.id)
                },
                value: [],
            },
            stockFormHasErrors: this._store.createFormHasErrorsSelector(["editedStockNameField"],
                ["editedStockEmployee"])
        }
    }
}

export type StockState = {
    stocksList: Stock[],
    stockTypes: Map<number, StockType>
    editedStockId: number | null,
    editedStockName: string,
    editedStockType: StockType,
    editedStockClinic: Clinic | null,
    editedStockEmployee: Employee | null,
}

export type StockSelectors = {
    stocksById: Map<number, Stock>
    editedStockNameField: Field,
    editedStockUsersForSelectedClinic: Employee[],
    stockDialogMode: ConfigureType,
    stockFormHasErrors: boolean,
}