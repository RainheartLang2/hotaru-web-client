import Identifiable from "../../core/entities/Identifiable";
import {SalesType} from "./enums/SalesType";

export class SalesCategory extends Identifiable {
    private salesType: SalesType
    private name: string
    private extraCharge: number

    constructor(bean: SalesCategoryBean) {
        super(bean.id)
        this.salesType = bean.type
        this.name = bean.name
        this.extraCharge = bean.extraCharge
    }

    public getSalesType(): SalesType {
        return this.salesType
    }

    public getName(): string {
        return this.name
    }

    public getExtraCharge(): number {
        return this.extraCharge
    }
}

export type SalesCategoryBean = {
    id?: number
    type: SalesType
    name: string
    extraCharge: number
}