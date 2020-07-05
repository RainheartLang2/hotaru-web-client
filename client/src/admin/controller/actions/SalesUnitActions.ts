import EmployeeAppController from "../EmployeeAppController";
import {EmployeeStateContext} from "../../state/EmployeeApplicationStore";
import SalesUnit from "../../../common/beans/SalesUnit";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";

export default class SalesUnitActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public loadList(callback: Function = () => {}, context? :EmployeeStateContext): void {
        this.controller.cacheManager.salesUnitCache.execute(callback, context)
    }

    public delete(id: number) {
        fetchUserZoneRpc({
            method: RemoteMethods.deleteSalesUnit,
            params: [id],
            successCallback: result => {
                this.controller.setState({
                    salesUnitList: this.controller.state.salesUnitList.filter(unit => unit.id != id)
                })
            }
        })
    }

    public submitCreateSalesUnit() {
        const salesUnit: SalesUnit = new SalesUnit({
            name: this.controller.state.addedSalesUnitNameField.value,
            salesType: this.controller.state.addedSalesUnitType,
            categoryId: this.controller.state.addedSalesUnitCategory!.id!,
            measureUnitId: this.controller.state.addedSalesUnitMeasureUnit!.id!,
            price: Number.parseFloat(this.controller.state.addedSalesUnitPriceField.value),
        })

        fetchUserZoneRpc({
            method: RemoteMethods.addSalesUnit,
            params: [salesUnit],
            successCallback: result => {
                salesUnit.id = +result
                this.controller.setState({
                    salesUnitList: [...this.controller.state.salesUnitList, salesUnit],
                })
                this.controller.toggleFieldValidation("addedSalesUnitNameField", false)
                this.controller.toggleFieldValidation("addedSalesUnitPriceField", false)
            }
        })
    }
}