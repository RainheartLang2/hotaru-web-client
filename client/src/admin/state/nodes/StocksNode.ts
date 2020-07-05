import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import Stock from "../../../common/beans/Storage";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import Species from "../../../common/beans/Species";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import {SpeciesPageSelector, SpeciesPageState} from "./SpeciesNode";
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
        return {
            stocksList: [],
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
            stockFormHasErrors: this._store.createFormHasErrorsSelector(["editedStockNameField"],
                ["editedStockClinic", "editedStockEmployee"])
        }
    }
}

export type StockState = {
    stocksList: Stock[]
    editedStockId: number | null,
    editedStockName: string,
    editedStockType: StockType,
    editedStockClinic: Clinic | null,
    editedStockEmployee: Employee | null,
}

export type StockSelectors = {
    stocksById: Map<number, Stock>
    editedStockNameField: Field,
    stockDialogMode: ConfigureType,
    stockFormHasErrors: boolean,
}