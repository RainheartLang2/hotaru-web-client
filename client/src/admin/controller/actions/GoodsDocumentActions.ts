import EmployeeAppController from "../EmployeeAppController";
import Stock from "../../../common/beans/Storage";
import {DialogType} from "../../state/enum/DialogType";
import {DateUtils} from "../../../core/utils/DateUtils";
import {RightPanelType} from "../../state/enum/RightPanelType";
import GoodsPackWithPrice from "../../../common/beans/GoodsPackWithPrice";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import GoodsDocument, {GoodsDocumentBean} from "../../../common/beans/GoodsDocument";
import {ShipingType} from "../../../common/beans/enums/ShipingType";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import CustomContainer from "../../../core/beans/CustomContainer";
import GoodsPack from "../../../common/beans/GoodsPack";
import {DocumentUtils} from "../../../core/utils/DocumentUtils";
import {CallbackUtils} from "../../../core/utils/CallbackUtils";
import getAllGoodsDocuments = RemoteMethods.getAllGoodsDocuments;

export default class GoodsDocumentActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public loadGoodsDocuments(callback: Function = () => {}): void {
        fetchUserZoneRpc({
            method: getAllGoodsDocuments,
            params: [],
            successCallback: result => {
                const goodsDocuments = result as GoodsDocumentBean[]
                this.controller.setState({
                    goodsDocuments: goodsDocuments.map(bean => new GoodsDocument(bean))
                })
                callback()
            }
        })
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

    private finishGoodsDocDialogOpening(stock: Stock | null, type: ShipingType) {
        this.controller.setState({
            editedShipmentDocumentId: undefined,
            editedShipDocType: type,
            editedShipDocState: null,
            editedShipDocStock: stock,
            editedShipDocCounterAgent: null,
            editedShipDocNumber: "",
            editedShipDocDate: DateUtils.standardFormatDate(DateUtils.getCurrentDate()),
            editedShipDocGoods: [],
            editedShipDocDestinationStock: null,
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

    public openTransferGoodsDockDialog(sourceStock: Stock | null, destinationStock: Stock | null, callback: Function = () => {}): void {
        this.controller.openDialog(DialogType.EditGoodsTransfer, setLoading => {
            this.loadGoodsDocDialogData(() => {
                CallbackUtils.callIf(
                    !!sourceStock,
                    callback => {
                        this.controller.stockActions.loadGoodsPacksForCurrentStock(sourceStock!.id!, callback)
                    },
                    () => {
                        this.controller.setState({
                            editedShipmentDocumentId: undefined,
                            editedShipDocType: ShipingType.Transfer,
                            editedShipDocState: null,
                            editedShipDocStock: sourceStock,
                            editedShipDocCounterAgent: null,
                            editedShipDocNumber: "",
                            editedShipDocDate: DateUtils.standardFormatDate(DateUtils.getCurrentDate()),
                            editedShipDocGoods: [],
                            editedShipDocDestinationStock: destinationStock,
                        })
                        setLoading()
                        callback()
                    }
                )
            })
        })
    }

    private getDialogTypeByDocument(documentType: ShipingType): DialogType {
        switch (documentType) {
            case ShipingType.Income: return DialogType.EditGoodsIncome
            case ShipingType.Outcome: return DialogType.EditGoodsOutcome
            case ShipingType.Inventory: return DialogType.EditGoodsInventory
            case ShipingType.Transfer: return DialogType.EditGoodsTransfer
            default: return DialogType.None
        }
    }

    public openCreateGoodsDocDialog(documentType: ShipingType, callback = () => {}): void {
        this.controller.openDialog(this.getDialogTypeByDocument(documentType), setLoading => {
            this.loadGoodsDocDialogData(() => {
                this.finishGoodsDocDialogOpening(null, documentType)
                setLoading()
                callback()
            })
        })
    }

    public openEditGoodsDocDialog(document: GoodsDocument, callback = () => {}): void {
        this.controller.openDialog(this.getDialogTypeByDocument(document.shipingType), setLoading => {
            this.loadGoodsDocDialogData(() => {
                this.controller.stockActions.loadGoodsPacksForCurrentStock(document.stockId, () => {
                    const stock = this.controller.stockActions.getStockById(document.stockId)
                    const destinationStock = document.destinationStockId
                        ? this.controller.stockActions.getStockById(document.destinationStockId)
                        : null
                    const counterAgent = document.counterAgentId
                        ? this.controller.counterAgentActions.getAgentById(document.counterAgentId)
                        : null
                    this.controller.setState({
                        editedShipmentDocumentId: document.id,
                        editedShipDocType: document.shipingType,
                        editedShipDocState: document.documentState,
                        editedShipDocStock: stock,
                        editedShipDocCounterAgent: counterAgent,
                        editedShipDocNumber: document.num,
                        editedShipDocDate: DateUtils.standardFormatDate(document.date),
                        editedShipDocGoods: document.goods.list,
                        editedShipDocDestinationStock: destinationStock,
                    })
                    callback()
                    setLoading()
                })
            })
        })
    }

    public changeCurrentStock(stock: Stock | null): void {
        if (!!stock) {
            this.controller.stockActions.loadGoodsPacksForCurrentStock(stock.id!)
        } else {
            this.controller.setState({
                editedStockGoods: [],
            })
        }
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
        if (documentType == ShipingType.Outcome || documentType == ShipingType.Transfer) {
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
    }

    public buildDocumentByField(): GoodsDocument {
        const state = this.controller.state
        const counterAgentId = DocumentUtils.documentTypeHasCounterAgent(state.editedShipDocType!)
                                    ? state.editedShipDocCounterAgent!.id!
                                    : null
        const destinationStockId = state.editedShipDocType == ShipingType.Transfer
                                    ? state.editedShipDocDestinationStock!.id!
                                    : null
        return  new GoodsDocument({
            id: state.editedShipmentDocumentId,
            documentState: state.editedShipDocState!,
            shipingType: state.editedShipDocType!,
            date: new Date(state.editedShipDocDate),
            stockId: state.editedShipDocStock!.id!,
            destinationStockId: destinationStockId,
            counterAgentId: counterAgentId,
            num: state.editedShipDocNumber,
            goods: new CustomContainer<GoodsPackWithPrice>(state.editedShipDocGoods),
        })
    }

    public submitCreateIncomeDocument(execute: boolean, callback: Function = () => {}): void {
        const document = this.buildDocumentByField()

        fetchUserZoneRpc({
            method: RemoteMethods.addGoodsDocument,
            params: [document, execute],
            successCallback: result => {
                const responseDocument = new GoodsDocument(result as GoodsDocumentBean)
                this.controller.setState({
                    goodsDocuments: [...this.controller.state.goodsDocuments, responseDocument],
                    editedShipDocState: responseDocument.documentState,
                    editedShipmentDocumentId: responseDocument.id,
                })
                callback()
            },
        })
    }

    public submitEditIncomeDocument(execute: boolean, callback: Function = () => {}): void {
        const document = this.buildDocumentByField()
        fetchUserZoneRpc({
            method: RemoteMethods.editGoodsDocument,
            params: [document, execute],
            successCallback: result => {
                const responseDocument = new GoodsDocument(result as GoodsDocumentBean)
                this.controller.setState({
                    goodsDocuments: CollectionUtils.updateIdentifiableArray(this.controller.state.goodsDocuments, responseDocument),
                    editedShipDocState: responseDocument.documentState,
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
        fetchUserZoneRpc({
            method: RemoteMethods.cancelGoodsDocument,
            params: [this.controller.state.editedShipmentDocumentId],
            successCallback: result => {
                const responseDocument = new GoodsDocument(result as GoodsDocumentBean)
                this.controller.setState({
                    goodsDocuments: CollectionUtils.updateIdentifiableArray(this.controller.state.goodsDocuments, responseDocument),
                    editedShipDocState: responseDocument.documentState,
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
            || this.controller.state.dialogType == DialogType.EditGoodsInventory
            || this.controller.state.dialogType == DialogType.EditGoodsTransfer
        ) {
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