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
import {ValidatorUtils} from "../../../core/utils/ValidatorUtils";

export default class SalesUnitNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): SalesUnitState {
        return {
            salesUnitList: [],
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
            addedSalesUnitPriceField: this._store.createField("addedSalesUnitPrice", "", ValidatorUtils.getPriceValidators()),
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
            },
            goodsSalesUnitList: {
                dependsOn: ["salesUnitList"],
                get: (state: Pick<EmployeeAppState, "salesUnitList">) => state.salesUnitList.filter(unit => unit.getSalesType() == SalesType.Goods),
                value: [],
            },
            goodsSalesUnitById: {
                dependsOn: ["goodsSalesUnitList"],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors, "goodsSalesUnitList">) => CollectionUtils.mapIdentifiableArray(state.goodsSalesUnitList),
                value: new Map(),
            },
        }
    }
}

export type SalesUnitState = {
    salesUnitList: SalesUnit[],

    addedSalesUnitName: string,
    addedSalesUnitType: SalesType,
    addedSalesUnitCategory: SalesCategory | null,
    addedSalesUnitMeasureUnit: MeasureUnit | null,
    addedSalesUnitPrice: string,
}

export type SalesUnitSelectors = {
    salesUnitListById: Map<number, SalesUnit>
    goodsSalesUnitList: SalesUnit[],
    goodsSalesUnitById: Map<number, SalesUnit>,
    addedSalesUnitNameField: Field,
    addedSalesUnitPriceField: Field,
    addedSalesUnitFieldsHasError: boolean,
    salesCategoriesForSelectedType: SalesCategory[],
}