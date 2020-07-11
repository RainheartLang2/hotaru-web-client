import EmployeeAppController from "../EmployeeAppController";
import Stock, {StockBean} from "../../../common/beans/Storage";
import {StockType} from "../../../common/beans/enums/StockType";
import {EmployeeStateContext} from "../../state/EmployeeApplicationStore";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {DialogType} from "../../state/enum/DialogType";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import getAllGoodsByStock = RemoteMethods.getAllGoodsByStock;
import GoodsPack, {GoodsPackBean} from "../../../common/beans/GoodsPack";

export default class StockActions {

    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public loadList(callback: Function = () => {}): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllStocks,
            params: [],
            successCallback: result => {
                const stocks = result as StockBean[]
                this.controller.setState({
                    stocksList: stocks.map(stockBean => new Stock(stockBean))
                })
                callback()
            }
        })
    }

    public loadGoodsPacksForCurrentStock(stockId: number, callback: Function = () => {}, context? :EmployeeStateContext) {
        fetchUserZoneRpc({
            method: getAllGoodsByStock,
            params: [stockId],
            successCallback: result => {
                const goods = result as GoodsPackBean[]
                console.log(result)
                this.controller.setState({
                    editedStockGoods: goods.map(item => new GoodsPack(item))
                }, context)
                console.log(this.controller.state.editedStockGoods)
                callback()
            }
        })
    }

    private loadStockData(stockId?: number, callback: Function = () => {}, context?: EmployeeStateContext) {
        if (stockId) {
            this.loadGoodsPacksForCurrentStock(stockId, () => {
                this.controller.salesUnitActions.loadList(() => {
                    this.controller.dictionariesActions.loadMeasureUnits([], () => {
                        callback()
                    }, context)
                }, context)
            }, context)
        } else {
            callback()
        }
    }

    public openCreateDialog(callback: Function = () => {}, context?: EmployeeStateContext) {
        this.controller.openDialog(DialogType.CreateStock, setLoading => {
            this.controller.setState({
                editedStockId: null,
                editedStockName: "",
                editedStockType: StockType.Selling,
                editedStockClinic: null,
                editedStockEmployee: null,
            }, context)
            this.controller.toggleFieldValidation("editedStockNameField", false, context)
            setLoading(context)
            callback()
        }, context)
    }

    public openEditDialog(stock: Stock, callback: Function = () => {}, context?: EmployeeStateContext) {
        this.controller.openDialog(DialogType.EditStock, setLoading => {
            this.loadStockData(stock.id!, () => {
                this.controller.setState({
                    editedStockId: stock.id,
                    editedStockName: stock.name,
                    editedStockType: stock.stockType,
                    editedStockClinic: this.controller.clinicActions.getClinicById(stock.clinicId),
                    editedStockEmployee: this.controller.employeeActions.getEmployeeById(stock.responsiblePersonId)
                }, context)
                setLoading(context)
                callback()
            }, context)
        }, context)
    }

    protected buildStockByFields(): Stock {
        return new Stock({
            id: this.controller.state.editedStockId ? this.controller.state.editedStockId : undefined,
            name: this.controller.state.editedStockNameField.value,
            stockType: this.controller.state.editedStockType,
            clinicId: this.controller.state.editedStockClinic!.id!,
            responsiblePersonId: this.controller.state.editedStockEmployee!.id!,
        })
    }

    public submitCreate(callback: Function = () => {}) {
        const stock = this.buildStockByFields()
        fetchUserZoneRpc({
            method: RemoteMethods.addStock,
            params: [stock],
            successCallback: result => {
                stock.id = +result
                this.controller.setState({
                    stocksList: [...this.controller.state.stocksList, stock]
                })
                this.controller.closeCurrentDialog()
                callback()
            }
        })
    }

    public submitEdit(callback: Function = () => {}) {
        const stock = this.buildStockByFields()
        fetchUserZoneRpc({
            method: RemoteMethods.editStock,
            params: [stock],
            successCallback: result => {
                this.controller.setState({
                    stocksList: CollectionUtils.updateIdentifiableArray(this.controller.state.stocksList, stock)
                })
                this.controller.closeCurrentDialog()
                callback()
            }
        })
        callback()
    }

    public delete(id: number) {
        fetchUserZoneRpc({
            method: RemoteMethods.deleteStock,
            params: [id],
            successCallback: result => {
                this.controller.setState({
                    stocksList: this.controller.state.stocksList.filter(stock => stock.id != id)
                })
            }
        })
    }
}