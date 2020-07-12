import EmployeeAppController from "../EmployeeAppController";
import Stock from "../../../common/beans/Storage";
import {DialogType} from "../../state/enum/DialogType";
import {DateUtils} from "../../../core/utils/DateUtils";
import {RightPanelType} from "../../state/enum/RightPanelType";
import GoodsPackWithPrice from "../../../common/beans/GoodsPackWithPrice";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import GoodsDocument from "../../../common/beans/GoodsDocument";
import {DocumentState} from "../../../common/beans/enums/DocumentState";
import {ShipingType} from "../../../common/beans/enums/ShipingType";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import CustomContainer from "../../../core/beans/CustomContainer";
import GoodsPack from "../../../common/beans/GoodsPack";
import {DocumentUtils} from "../../../core/utils/DocumentUtils";

export default class GoodsDocumentActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    private loadGoodsDocDialogData(callback: Function = () => {}): void {
        this.controller.stockActions.loadList(() => {
            this.controller.counterAgentActions.loadList(() => {
                this.controller.salesUnitActions.loadList(() => {
                    this.controller.dictionariesActions.loadMeasureUnits([], () => {
                        callback()
                    })
                })
            })
        })
    }

    private finishGoodsDocDialogOpening(stock: Stock, type: ShipingType) {
        this.controller.setState({
            editedShipmentDocumentId: undefined,
            editedShipDocType: type,
            editedShipDocState: null,
            editedShipDocStock: stock,
            editedShipDocCounterAgent: null,
            editedShipDocNumber: "",
            editedShipDocDate: DateUtils.standardFormatDate(DateUtils.getCurrentDate()),
            editedShipDocGoods: [],
        })
    }

    public openCreateIncomeGoodsDocDialog(stock: Stock, callback: Function = () => {}): void {
        this.controller.openDialog(DialogType.EditGoodsIncome, setLoading => {
            this.loadGoodsDocDialogData(() => {
                this.finishGoodsDocDialogOpening(stock, ShipingType.Income)
                setLoading()
                callback()
            })
        })
    }

    public openCreateOutcomeGoodsDocDialog(stock: Stock, callback: Function = () => {}): void {
        this.controller.openDialog(DialogType.EditGoodsOutcome, setLoading => {
            this.loadGoodsDocDialogData(() => {
                this.controller.stockActions.loadGoodsPacksForCurrentStock(stock.id!, () => {
                    this.finishGoodsDocDialogOpening(stock, ShipingType.Outcome)
                    setLoading()
                    callback()
                })
            })
        })
    }

    public openCreateInventoryGoodsDocDialog(stock: Stock, callback: Function = () => {}): void {
        this.controller.openDialog(DialogType.EditGoodsInventory, setLoading => {
            this.loadGoodsDocDialogData(() => {
                this.controller.stockActions.loadGoodsPacksForCurrentStock(stock.id!, () => {
                    this.finishGoodsDocDialogOpening(stock, ShipingType.Inventory)
                    setLoading()
                    callback()
                })
            })
        })
    }

    public addDocPacksBySelection(items: GoodsPack[], callback: Function = () => {}): void {
        const map: GoodsPackWithPrice[] = items.map(goodsPack => {
            const result = new GoodsPackWithPrice(goodsPack.toBean(), 0, 0)
            result.amount = 0
            return result
        })
        this.controller.setState({
            editedShipDocGoods: this.controller.state.editedShipDocGoods.concat(map),
        })
        callback()
    }

    public setGoodsPackAmount(item: GoodsPackWithPrice, amount: number): void {
        const documentType = this.controller.state.editedShipDocType
        if (documentType == ShipingType.Outcome) {
            const goodsPackFromStock = this.controller.state.editedStockGoodsById.get(item.id!)
            if (!goodsPackFromStock) {
                throw new Error("no goodsPack on current stock for id " + item.id)
            }
            item.amount = Math.min(goodsPackFromStock.amount, amount)
        } else if (documentType == ShipingType.Inventory) {
            item.amount = amount
        } else {
            throw new Error("unknown document type " + documentType)
        }

        this.controller.setState({
            editedShipDocGoods: CollectionUtils.updateIdentifiableArray(this.controller.state.editedShipDocGoods, item)
        })
        console.log(this.controller.state.editedShipDocGoods)
    }

    public buildDocumentByField(actualDocumentState: DocumentState): GoodsDocument {
        const state = this.controller.state
        const counterAgentId = DocumentUtils.documentTypeHasCounterAgent(state.editedShipDocType!)
                                    ? state.editedShipDocCounterAgent!.id!
                                    : null
        return  new GoodsDocument({
            id: state.editedShipmentDocumentId,
            documentState: actualDocumentState,
            shipingType: state.editedShipDocType!,
            date: new Date(state.editedShipDocDate),
            stockId: state.editedShipDocStock!.id!,
            counterAgentId: counterAgentId,
            num: state.editedShipDocNumber,
            goods: new CustomContainer<GoodsPackWithPrice>(state.editedShipDocGoods),
        })
    }

    public submitCreateIncomeDocument(execute: boolean, callback: Function = () => {}): void {
        const actualDocumentState = execute ? DocumentState.Executed : DocumentState.Saved
        const document = this.buildDocumentByField(actualDocumentState)

        fetchUserZoneRpc({
            method: RemoteMethods.addGoodsDocument,
            params: [document, execute],
            successCallback: result => {
                document.id = +result
                this.controller.setState({
                    goodsDocuments: [...this.controller.state.goodsDocuments, document],
                    editedShipDocState: actualDocumentState,
                    editedShipmentDocumentId: document.id
                })
                callback()
            },
        })
    }

    public submitEditIncomeDocument(execute: boolean, callback: Function = () => {}): void {
        const actualDocumentState = execute ? DocumentState.Executed : DocumentState.Saved
        const document = this.buildDocumentByField(actualDocumentState)

        fetchUserZoneRpc({
            method: RemoteMethods.editGoodsDocument,
            params: [document, execute],
            successCallback: result => {
                this.controller.setState({
                    goodsDocuments: CollectionUtils.updateIdentifiableArray(this.controller.state.goodsDocuments, document),
                    editedShipDocState: actualDocumentState,
                })
                callback()
            },
        })
    }

    public getDocumentById(id: number) {
        const result = this.controller.state.goodsDocumentsById.get(id)
        if (!result) {
            throw new Error("no document for id " + id)
        }
        return result
    }

    public submitCancelDocument(callback: Function = () => {}): void {
        const document = this.buildDocumentByField(DocumentState.Canceled)
        fetchUserZoneRpc({
            method: RemoteMethods.cancelGoodsDocument,
            params: [document.id],
            successCallback: result => {
                this.controller.setState({
                    goodsDocuments: CollectionUtils.updateIdentifiableArray(this.controller.state.goodsDocuments, document),
                    editedShipDocState: DocumentState.Canceled,
                })
                callback()
            }
        })
    }

    private loadDataForGoodsPackPanel(callback: Function = () => {}): void {
        this.controller.dictionariesActions.loadGoodsProducers(() => {
            this.controller.dictionariesActions.loadMeasureUnits([], () => {
                callback()
            })
        })
    }

    public openCreateGoodsPackRightPanel(callback: Function = () => {}): void {
        this.controller.openRightPanel(RightPanelType.AddGoodsPack, setLoading => {
            this.loadDataForGoodsPackPanel(() => {
                this.controller.setState({
                    editedGoodsPackId: undefined,
                    editedGoodsPackSalesType: null,
                    editedGoodsPackAmount: "0",
                    editedGoodsPackUnitPrice: "0",
                    editedGoodsPackTaxRate: "",
                    editedGoodsPackProducer: null,
                    editedGoodsPackSeries: "",
                    editedGoodsPackCreationDate: "",
                    editedGoodsPackExpirationDate: "",
                })
                this.controller.toggleFieldValidation("editedGoodsPackAmountField", false)
                this.controller.toggleFieldValidation("editedGoodsPackUnitPriceField", false)
                this.controller.toggleFieldValidation("editedGoodsPackTaxRateField", false)
                this.controller.toggleFieldValidation("editedGoodsPackCreationDateField", false)
                this.controller.toggleFieldValidation("editedGoodsPackExpirationDateField", false)
                setLoading()
                callback()
            })
        })
    }

    public openEditGoodsPackRightPanel(pack: GoodsPackWithPrice, callback: Function = () => {}) {
        this.controller.openRightPanel(RightPanelType.EditGoodsPack, setLoading => {
            this.loadDataForGoodsPackPanel(() => {
                const salesType = this.controller.salesUnitActions.getUnitById(pack.goodsTypeId)
                const goodsProducer = pack.goodsProducerId
                    ? this.controller.dictionariesActions.getGoodsProducerById(pack.goodsProducerId)
                    : null
                this.controller.setState({
                    editedGoodsPackId: pack.id,
                    editedGoodsPackSalesType: salesType,
                    editedGoodsPackAmount: pack.amount.toString(),
                    editedGoodsPackUnitPrice: pack.price.toString(),
                    editedGoodsPackTaxRate: pack.price.toString(),
                    editedGoodsPackProducer: goodsProducer,
                    editedGoodsPackSeries: pack.series,
                    editedGoodsPackCreationDate: DateUtils.standardFormatDate(pack.creationDate),
                    editedGoodsPackExpirationDate: DateUtils.standardFormatDate(pack.expirationDate),
                })
                setLoading()
                callback()
            })
        })
    }

    public getCurrentStockId(): number {
        if (this.controller.state.dialogType == DialogType.EditGoodsIncome
            || this.controller.state.dialogType == DialogType.EditGoodsOutcome
            || this.controller.state.dialogType == DialogType.EditGoodsInventory) {
            return this.controller.state.editedShipDocStock!.id!
        }
        throw new Error("no stock specified in current state")
    }

    public buildGoodsPackByFields(): GoodsPackWithPrice {
        const state = this.controller.state
        return new GoodsPackWithPrice({
            id: state.editedGoodsPackId,
            stockId: this.getCurrentStockId(),
            goodsTypeId: state.editedGoodsPackSalesType!.id!,
            goodsProducerId: state.editedGoodsPackProducer ? state.editedGoodsPackProducer.id! : undefined,
            incomeDocumentId: state.editedGoodsPackId,
            amount: +state.editedGoodsPackAmountField.value,
            series: state.editedGoodsPackSeriesField.value,
            creationDate: new Date(state.editedGoodsPackCreationDate),
            expirationDate: new Date(state.editedGoodsPackExpirationDate),
        },
            +state.editedGoodsPackUnitPriceField.value,
            state.editedGoodsPackTaxRateField.value ? +state.editedGoodsPackTaxRateField.value : 0,
        )
    }

    public submitCreateGoodsPackForDocument(callback: Function = () => {}): void {
        const item = this.buildGoodsPackByFields()
        item.id = 1 + CollectionUtils.getMaxByPredicate(this.controller.state.editedShipDocGoods, item => item.id ? item.id : 0)

        this.controller.setState({
            editedShipDocGoods: [...this.controller.state.editedShipDocGoods, item]
        })
        this.controller.closeCurrentRightPanel()
    }

    public submitEditGoodsPackForDocument(callback: Function = () => {}): void {
        const item = this.buildGoodsPackByFields()
        this.controller.setState({
            editedShipDocGoods: CollectionUtils.updateIdentifiableArray(this.controller.state.editedShipDocGoods, item)
        })
        this.controller.closeCurrentRightPanel()
    }

    public deleteGoodsPackForDocument(id: number, callback: Function = () => {}): void {
        this.controller.setState({
            editedShipDocGoods: this.controller.state.editedShipDocGoods.filter(item => item.id != id)
        })
    }
}