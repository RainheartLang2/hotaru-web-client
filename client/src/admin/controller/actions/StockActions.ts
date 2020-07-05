import EmployeeAppController from "../EmployeeAppController";
import Stock from "../../../common/beans/Storage";
import {StockType} from "../../../common/beans/enums/StockType";
import {EmployeeStateContext} from "../../state/EmployeeApplicationStore";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";

export default class StockActions {

    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public loadList(callback: Function = () => {}): void {
        this.controller.setState({
            stocksList: [
                new Stock({
                    id: 1,
                    name: "Склад",
                    stockType: StockType.Selling,
                    responsiblePersonId: 1,
                    clinicId: 1,
                })
            ]
        })
        callback()
    }

    public openCreateDialog(callback: Function = () => {}, context?: EmployeeStateContext) {
        callback()
    }

    public openEditDialog(stock: Stock, callback: Function = () => {}, context?: EmployeeStateContext) {
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