import EmployeeAppController from "../EmployeeAppController";
import Stock from "../../../common/beans/Storage";
import {DialogType} from "../../state/enum/DialogType";
import {DateUtils} from "../../../core/utils/DateUtils";
import {RightPanelType} from "../../state/enum/RightPanelType";
import GoodsPackWithPrice from "../../../common/beans/GoodsPackWithPrice";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import editGoodsProducer = RemoteMethods.editGoodsProducer;
import {MathUtils} from "../../../core/utils/MathUtils";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";

export default class GoodsDocumentActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }


    public openCreateIncomeDocDialog(stock: Stock, callback: Function = () => {}): void {
        this.controller.openDialog(DialogType.CreateGoodsIncome, setLoading => {
            this.controller.stockActions.loadList(() => {
                this.controller.counterAgentActions.loadList(() => {
                    this.controller.salesUnitActions.loadList(() => {
                        this.controller.setState({
                            editedShipmentDocumentId: undefined,
                            editedShipDocStock: stock,
                            editedShipDocCounterAgent: null,
                            editedShipDocNumber: "",
                            editedShipDocDate: DateUtils.standardFormatDate(DateUtils.getCurrentDate())
                        })
                        setLoading()
                        callback()
                    })
                })
            })
        })
    }

    public openCreateGoodsPackRightPanel(callback: Function = () => {}): void {
        this.controller.openRightPanel(RightPanelType.AddGoodsPack, setLoading => {
            this.controller.dictionariesActions.loadGoodsProducers(() => {
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

    public getCurrentStockId(): number {
        if (this.controller.state.dialogType == DialogType.CreateGoodsIncome
            || this.controller.state.dialogType == DialogType.EditGoodsIncome) {
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
}