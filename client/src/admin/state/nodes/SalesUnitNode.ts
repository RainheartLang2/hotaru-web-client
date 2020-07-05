import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import SalesUnit from "../../../common/beans/SalesUnit";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {SalesType} from "../../../common/beans/enums/SalesType";
import {SalesCategory} from "../../../common/beans/SalesCategory";
import MeasureUnit from "../../../common/beans/MeasureUnit";
import {Field} from "../../../core/mvc/store/Field";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import EnteringPriceValidator from "../../../core/mvc/validators/EnteringPriceValidator";
import PriceValidator from "../../../core/mvc/validators/PriceValidator";

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
            addedSalesUnitName: "",
            addedSalesUnitType: SalesType.Goods,
            addedSalesUnitCategory: null,
            addedSalesUnitMeasureUnit: null,
            addedSalesUnitPrice: "",
        }
    }

    public getSelectors(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, SalesUnitSelectors> {
        return {
            salesUnitListById: {
                dependsOn: ["salesUnitList"],
                get: (state: Pick<SalesUnitState, "salesUnitList">) =>
                    CollectionUtils.mapIdentifiableArray(state.salesUnitList),
                value: new Map(),
            },
            addedSalesUnitNameField: this._store.createField("addedSalesUnitName", "", [
                new RequiredFieldValidator(),
                new MaximalLengthValidator(100),
            ]),
            addedSalesUnitPriceField: this._store.createField("addedSalesUnitPrice", "", [
                new RequiredFieldValidator(),
                new MaximalLengthValidator(10),
                new EnteringPriceValidator(),
                new PriceValidator(),
            ]),
            salesCategoriesForSelectedType: {
                dependsOn: ["addedSalesCategoryType", "serviceSalesCategories", "goodsSalesCategories"],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors,
                    "addedSalesCategoryType" |
                    "serviceSalesCategories" |
                    "goodsSalesCategories">) => {
                    if (state.addedSalesCategoryType == SalesType.Goods) {
                        return state.goodsSalesCategories
                    } else {
                        return state.serviceSalesCategories
                    }
                },
                value: [],
            },
            addedSalesUnitFieldsHasError: {
                dependsOn: [
                    "addedSalesUnitNameField",
                    "addedSalesUnitPriceField",
                    "addedSalesCategoryType",
                    "addedSalesUnitMeasureUnit"
                ],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors,
                    "addedSalesUnitNameField" |
                    "addedSalesUnitPriceField" |
                    "addedSalesCategoryType" |
                    "addedSalesUnitMeasureUnit">) => {
                    return state.addedSalesUnitPriceField.errors.length > 0
                            || state.addedSalesUnitNameField.errors.length > 0
                            || !state.addedSalesCategoryType
                            || !state.addedSalesUnitMeasureUnit
                },
                value: false,
            }
        }
    }
}

export type SalesUnitState = {
    salesUnitList: SalesUnit[],
    editedSalesUnitId: number | null,
    editedSalesUnitName: string,

    addedSalesUnitName: string,
    addedSalesUnitType: SalesType,
    addedSalesUnitCategory: SalesCategory | null,
    addedSalesUnitMeasureUnit: MeasureUnit | null,
    addedSalesUnitPrice: string,
}

export type SalesUnitSelectors = {
    salesUnitListById: Map<number, SalesUnit>
    addedSalesUnitNameField: Field,
    addedSalesUnitPriceField: Field,
    addedSalesUnitFieldsHasError: boolean,
    salesCategoriesForSelectedType: SalesCategory[],
}