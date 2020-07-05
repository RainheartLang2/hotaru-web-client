import Identifiable from "../../core/entities/Identifiable";
import {StockType} from "./enums/StockType";

export default class Stock extends Identifiable {
    public name: string
    public stockType: StockType
    public responsiblePersonId: number
    public clinicId: number

    constructor(bean: StockBean) {
        super(bean.id)
        this.name = bean.name
        this.stockType = bean.stockType
        this.responsiblePersonId = bean.responsiblePersonId
        this.clinicId = bean.clinicId
    }
}

export type StockBean = {
    id?: number,
    name: string,
    stockType: StockType
    responsiblePersonId: number
    clinicId: number
}
