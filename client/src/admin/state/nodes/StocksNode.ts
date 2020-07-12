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
import CounterAgent from "../../../common/beans/CounterAgent";
import {PersonType} from "../../../common/beans/enums/PersonType";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import DigitsOnlyValidator from "../../../core/mvc/validators/DigitsOnlyValidator";
import DateValidator from "../../../core/mvc/validators/DateValidator";
import {ShipingType} from "../../../common/beans/enums/ShipingType";
import GoodsPackWithPrice from "../../../common/beans/GoodsPackWithPrice";
import SalesUnit from "../../../common/beans/SalesUnit";
import GoodsProducer from "../../../common/beans/GoodsProducer";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import PositiveNumberValidator from "../../../core/mvc/validators/PositiveNumberValidator";
import EnteringPriceValidator from "../../../core/mvc/validators/EnteringPriceValidator";
import PriceValidator from "../../../core/mvc/validators/PriceValidator";
import {RightPanelType} from "../enum/RightPanelType";
import {MathUtils} from "../../../core/utils/MathUtils";
import MeasureUnit from "../../../common/beans/MeasureUnit";
import GoodsDocument from "../../../common/beans/GoodsDocument";
import {DocumentState} from "../../../common/beans/enums/DocumentState";
import GoodsPack from "../../../common/beans/GoodsPack";

export default class StockNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): StockState {
        const stockTypesMap = new Map<number, StockType>()
        stockTypesMap.set(StockType.stockTypeToNumber(StockType.Selling), StockType.Selling)
        stockTypesMap.set(StockType.stockTypeToNumber(StockType.Storing), StockType.Storing)

        const personTypesMap = new Map<number, PersonType>()
        personTypesMap.set(PersonType.personTypeToNumber(PersonType.Legal), PersonType.Legal)
        personTypesMap.set(PersonType.personTypeToNumber(PersonType.Natural), PersonType.Natural)
        return {
            stocksList: [],
            stockTypes: stockTypesMap,
            editedStockId: null,
            editedStockName: "",
            editedStockType: StockType.getDefaultType(),
            editedStockClinic: null,
            editedStockEmployee: null,
            editedStockGoods: [],

            counterAgentsList: [],
            personTypes: personTypesMap,
            editedAgentId: null,
            editedAgentName: "",
            editedAgentPersonName: "",
            editedAgentType: PersonType.getDefaultType(),
            editedAgentPhone: "",
            editedAgentEmail: "",
            editedAgentPersonFinancialId: "",
            editedAgentBankName: "",
            editedAgentBankId: "",
            editedAgentCorAccount: "",
            editedAgentGyroAccount: "",
            editedAgentNote: "",

            goodsDocuments: [],

            editedShipmentDocumentId: undefined,
            editedShipDocState: null,
            editedShipDocType: null,
            editedShipDocStock: null,
            editedShipDocCounterAgent: null,
            editedShipDocNumber: "",
            editedShipDocDate: "",
            editedShipDocGoods: [],

            editedGoodsPackId: undefined,
            editedGoodsPackSalesType: null,
            editedGoodsPackAmount: "",
            editedGoodsPackUnitPrice: "",
            editedGoodsPackTaxRate: "",
            editedGoodsPackProducer: null,
            editedGoodsPackSeries: "",
            editedGoodsPackCreationDate: "",
            editedGoodsPackExpirationDate: "",
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
                ["editedStockEmployee"]),

            counterAgentsById: {
                dependsOn: ["counterAgentsList"],
                get: (state: Pick<StockState, "counterAgentsList">) => CollectionUtils.mapIdentifiableArray(state.counterAgentsList),
                value: new Map(),
            },
            editedAgentNameField: this._store.createField("editedAgentName", "", ValidatorUtils.getStandardTextValidators(100)),
            editedAgentPersonNameField: this._store.createField("editedAgentPersonName", "", ValidatorUtils.getStandardTextValidators(100)),
            editedAgentPhoneField: this._store.createField("editedAgentPhone", "" , ValidatorUtils.getPhoneValidators()),
            editedAgentEmailField: this._store.createField("editedAgentEmail", "", ValidatorUtils.getEmailValidators()),
            editedAgentPersonFinancialIdField: this._store.createField("editedAgentPersonFinancialId", "",
                [
                    new MaximalLengthValidator(50),
                    new DigitsOnlyValidator(),
                ]),
            editedAgentBankNameField: this._store.createField("editedAgentBankName", "",
                [
                    new MaximalLengthValidator(200)
                ]),
            editedAgentBankIdField: this._store.createField("editedAgentBankId", "",
                [
                    new MaximalLengthValidator(50),
                    new DigitsOnlyValidator(),
                ]),
            editedAgentCorAccountField: this._store.createField("editedAgentCorAccount", "",
                [
                    new MaximalLengthValidator(50),
                    new DigitsOnlyValidator(),
                ]),
            editedAgentGyroAccountField: this._store.createField("editedAgentGyroAccount", "",
                [
                    new MaximalLengthValidator(50),
                    new DigitsOnlyValidator()
                ]),
            editedAgentNoteField: this._store.createField("editedAgentNote", "", [new MaximalLengthValidator(2000)]),
            counterAgentDialogMode: {
                dependsOn: ["dialogType"],
                get: (state: Pick<EmployeeAppState, "dialogType">) => {
                    switch (state.dialogType) {
                        case DialogType.CreateCounterAgent:
                            return "create"
                        case DialogType.EditCounterAgent:
                            return "edit"
                        default:
                            return "none"
                    }
                },
                value: "none",
            },
            counterAgentFormHasErrors: this._store.createFormHasErrorsSelector([
                "editedAgentNameField",
                "editedAgentPersonNameField",
                "editedAgentBankIdField",
                "editedAgentBankNameField",
                "editedAgentPhoneField",
                "editedAgentPersonFinancialIdField",
                "editedAgentNoteField",
                "editedAgentCorAccountField",
                "editedAgentGyroAccountField",
                "editedAgentPhoneField",
                "editedAgentEmailField",
            ]),
            goodsDocumentsById: {
                dependsOn: ["goodsDocuments"],
                get: (state: Pick<StockState, "goodsDocuments">) =>
                    CollectionUtils.mapIdentifiableArray(state.goodsDocuments),
                value: new Map(),
            },
            editedShipDocNumberField: this._store.createField("editedShipDocNumber"),
            editedShipDocDateField: this._store.createField("editedShipDocDate", "", [
                new DateValidator()
            ]),
            editedShipDocType: {
                dependsOn: ["dialogType"],
                get: (state:Pick<EmployeeAppState, "dialogType">) => {
                    switch (state.dialogType) {
                        case DialogType.EditGoodsIncome:
                            return ShipingType.Income
                        case DialogType.EditGoodsOutcome:
                            return ShipingType.Outcome
                        default:
                            return null
                    }
                },
                value: null,
            },
            editedShipDocFormHasStandardErrors: this._store.createFormHasErrorsSelector([], ["editedShipDocCounterAgent", "editedShipDocStock"]),
            editedShipDocFormHasErrors: {
                dependsOn: ["editedShipDocFormHasStandardErrors",
                    "editedShipDocGoods"],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors, "editedShipDocFormHasStandardErrors" | "editedShipDocGoods">) =>
                    state.editedShipDocFormHasStandardErrors || state.editedShipDocGoods.length == 0,
                value: false,
            },
            editedShipDocGoodsById: {
                dependsOn: ["editedShipDocGoods"],
                get: (state: Pick<StockState, "editedShipDocGoods">) => CollectionUtils.mapIdentifiableArray(state.editedShipDocGoods),
                value: new Map(),
            },
            editedGoodsPackAmountField: this._store.createField("editedGoodsPackAmount", "0", [
                new RequiredFieldValidator(),
                new DigitsOnlyValidator(),
                new PositiveNumberValidator(),
                new MaximalLengthValidator(15),
            ]),
            editedGoodsPackUnitPriceField: this._store.createField("editedGoodsPackUnitPrice", "0", [
                new EnteringPriceValidator(),
                new PriceValidator(),
                new MaximalLengthValidator(15),
            ]),
            editedGoodsPackTaxRateField: this._store.createField("editedGoodsPackTaxRate", "", [
                new EnteringPriceValidator(),
                new PriceValidator(),
                new MaximalLengthValidator(6),
            ]),
            editedGoodsPackCreationDateField: this._store.createField("editedGoodsPackCreationDate", "", [
                new DateValidator(),
            ]),
            editedGoodsPackExpirationDateField: this._store.createField("editedGoodsPackExpirationDate", "", [
                new DateValidator(),
            ]),
            editedGoodsPackCalcError: this._store.createFormHasErrorsSelector([
                "editedGoodsPackAmountField",
                "editedGoodsPackUnitPriceField",
                "editedGoodsPackTaxRateField",
            ]),
            editedGoodsPackSeriesField: this._store.createField("editedGoodsPackSeries", "", [new MaximalLengthValidator(50)]),
            editedShipDocNotAddedStockGoods: {
                dependsOn: ["editedShipDocGoodsById", "editedStockGoods"],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors, "editedShipDocGoodsById" | "editedStockGoods">) => {
                    return state.editedStockGoods.filter(item => !state.editedShipDocGoodsById.get(item.id!))
                },
                value: [],
            },
            editedGoodsPackCost: {
                dependsOn: [
                    "editedGoodsPackAmountField",
                    "editedGoodsPackUnitPriceField",
                    "editedGoodsPackTaxRateField",
                    "editedGoodsPackCalcError",
                ],
                get: (state: Pick<StockSelectors,
                    "editedGoodsPackAmountField" |
                    "editedGoodsPackUnitPriceField" |
                    "editedGoodsPackTaxRateField" |
                    "editedGoodsPackCalcError"
                    >) => {
                    if (state.editedGoodsPackCalcError) {
                        return null
                    }
                    const amount = +state.editedGoodsPackAmountField.value
                    const price = +state.editedGoodsPackUnitPriceField.value
                    const taxRate = state.editedGoodsPackTaxRateField.value ? +state.editedGoodsPackTaxRateField.value : 0
                    return MathUtils.calculateCost(amount, price, taxRate)
                },
                value: null
            },
            editedGoodsPackFormMeasureUnit: {
                dependsOn: ["measureListById", "editedGoodsPackSalesType"],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors, "measureListById" | "editedGoodsPackSalesType">) => {
                    if (!state.editedGoodsPackSalesType) {
                        return null
                    }

                    const result = state.measureListById.get(state.editedGoodsPackSalesType.measureUnitId)
                    return result ? result : null
                },
                value: null,
            },
            editedGoodsPackFormMode: {
                dependsOn: ["rightPanelType"],
                get: (state:Pick<EmployeeAppState, "rightPanelType">) => {
                    switch (state.rightPanelType) {
                        case RightPanelType.AddGoodsPack:
                            return "create"
                        case RightPanelType.EditGoodsPack:
                            return "edit"
                        default:
                            return "none"
                    }
                },
                value: "none",
            },
            editedGoodsPackFormHasErrors: this._store.createFormHasErrorsSelector(
                ["editedGoodsPackAmountField", "editedGoodsPackUnitPriceField", "editedGoodsPackTaxRateField"],
                         ["editedGoodsPackSalesType"]
            ),
            editedStockGoodsById: {
                dependsOn: ["editedStockGoods"],
                get: (state: Pick<StockState, "editedStockGoods">) => CollectionUtils.mapIdentifiableArray(state.editedStockGoods),
                value: new Map(),
            },
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
    editedStockGoods: GoodsPack[],

    counterAgentsList: CounterAgent[],
    personTypes: Map<number, PersonType>
    editedAgentId: number | null,
    editedAgentName: string,
    editedAgentPersonName: string,
    editedAgentType: PersonType,
    editedAgentPhone: string,
    editedAgentEmail: string,
    editedAgentPersonFinancialId: string,
    editedAgentBankName: string,
    editedAgentBankId: string,
    editedAgentCorAccount: string,
    editedAgentGyroAccount: string,
    editedAgentNote: string,

    goodsDocuments: GoodsDocument[]

    editedShipmentDocumentId: number | undefined
    editedShipDocType: ShipingType | null,
    editedShipDocState: DocumentState | null
    editedShipDocStock: Stock | null
    editedShipDocCounterAgent: CounterAgent | null
    editedShipDocNumber: string
    editedShipDocDate: string

    editedShipDocGoods: GoodsPackWithPrice[]

    editedGoodsPackId: number | undefined
    editedGoodsPackSalesType: SalesUnit | null
    editedGoodsPackAmount: string
    editedGoodsPackUnitPrice: string
    editedGoodsPackTaxRate: string
    editedGoodsPackProducer: GoodsProducer | null
    editedGoodsPackSeries: string,
    editedGoodsPackCreationDate: string
    editedGoodsPackExpirationDate: string
}

export type StockSelectors = {
    stocksById: Map<number, Stock>
    editedStockNameField: Field,
    editedStockUsersForSelectedClinic: Employee[],
    stockDialogMode: ConfigureType,
    stockFormHasErrors: boolean,
    editedStockGoodsById: Map<number, GoodsPack>,

    counterAgentsById: Map<number, CounterAgent>
    editedAgentNameField: Field,
    editedAgentPersonNameField: Field,
    editedAgentPhoneField: Field,
    editedAgentEmailField: Field,
    editedAgentPersonFinancialIdField: Field,
    editedAgentBankNameField: Field,
    editedAgentBankIdField: Field,
    editedAgentCorAccountField: Field,
    editedAgentGyroAccountField: Field,
    editedAgentNoteField: Field,
    counterAgentDialogMode: ConfigureType,
    counterAgentFormHasErrors: boolean,

    goodsDocumentsById: Map<number, GoodsDocument>

    editedShipDocNumberField: Field,
    editedShipDocDateField: Field,
    editedShipDocType: ShipingType | null,
    editedShipDocFormHasStandardErrors: boolean,
    editedShipDocFormHasErrors: boolean,
    editedShipDocNotAddedStockGoods: GoodsPack[],

    editedShipDocGoodsById: Map<number, GoodsPackWithPrice>

    editedGoodsPackAmountField: Field
    editedGoodsPackUnitPriceField: Field
    editedGoodsPackCalcError: boolean
    editedGoodsPackCost: number | null
    editedGoodsPackTaxRateField: Field
    editedGoodsPackSeriesField: Field
    editedGoodsPackCreationDateField: Field,
    editedGoodsPackExpirationDateField: Field,
    editedGoodsPackFormMeasureUnit: MeasureUnit | null,
    editedGoodsPackFormMode: ConfigureType,
    editedGoodsPackFormHasErrors: boolean,
}