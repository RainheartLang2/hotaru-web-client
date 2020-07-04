import Identifiable from "../../core/entities/Identifiable";
import {SalesType} from "./enums/SalesType";

export default class SalesUnit extends Identifiable {
    private name: string
    private salesType: SalesType
    private categoryId: number
    private measureUnitId: number
    private price: number

    constructor(bean: SalesUnitBean) {
        super(bean.id)
        this.name = bean.name
        this.salesType = bean.salesType
        this.categoryId = bean.categoryId
        this.measureUnitId = bean.measureUnitId
        this.price = bean.price
    }

    public getName(): string {
        return this.name
    }

    public getSalesType(): SalesType {
        return this.salesType
    }

    public getCategoryId(): number {
        return this.categoryId
    }

    public getMeasureUnitId(): number {
        return this.measureUnitId
    }

    public getPrice(): number {
        return this.price
    }

}

export type SalesUnitBean = {
    id? : number
    name: string
    salesType: SalesType
    categoryId: number
    measureUnitId: number
    price: number
}