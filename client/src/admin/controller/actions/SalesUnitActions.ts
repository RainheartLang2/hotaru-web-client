import EmployeeAppController from "../EmployeeAppController";
import {EmployeeStateContext} from "../../state/EmployeeApplicationStore";
import SalesUnit from "../../../common/beans/SalesUnit";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {SalesType} from "../../../common/beans/enums/SalesType";
import {SalesCategory} from "../../../common/beans/SalesCategory";
import MeasureUnit from "../../../common/beans/MeasureUnit";

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

    private getUnitById(id: number) {
        const result = this.controller.state.salesUnitListById.get(id)
        if (!result) {
            throw new Error("There is no sales unit with id " + id)
        }
        return result
    }

    public setSalesName(id: number, name: string) {
        const salesUnit = this.getUnitById(id)
        salesUnit.name = name
        this.submitEditSalesUnit(salesUnit)
    }

    public setSalesType(id: number, salesType: SalesType) {
        const salesUnit = this.getUnitById(id)
        salesUnit.salesType = salesType
        this.submitEditSalesUnit(salesUnit)
    }

    public setSalesCategory(id: number, category: SalesCategory) {
        const salesUnit = this.getUnitById(id)
        salesUnit.categoryId = category.id!
        this.submitEditSalesUnit(salesUnit)
    }

    public setMeasureUnit(id: number, measureUnit: MeasureUnit) {
        const salesUnit = this.getUnitById(id)
        salesUnit.measureUnitId = measureUnit.id!
        this.submitEditSalesUnit(salesUnit)
    }

    public setPrice(id: number, price: number) {
        const salesUnit = this.getUnitById(id)
        salesUnit.price = price
        this.submitEditSalesUnit(salesUnit)
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

    public submitEditSalesUnit(unit: SalesUnit) {
        fetchUserZoneRpc({
            method: RemoteMethods.editSalesUnit,
            params: [unit],
            successCallback: result => {
                this.controller.setState({
                    salesUnitList: CollectionUtils.updateIdentifiableArray(this.controller.state.salesUnitList, unit)
                })
            }
        })
    }
}