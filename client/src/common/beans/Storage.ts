import Identifiable from "../../core/entities/Identifiable";
import {StockType} from "./enums/StockType";

export default class Stock extends Identifiable {
    public name: string
    public storageType: StockType
    public responsiblePersonId: number
    public clinicId: number

    constructor(bean: StockBean) {
        super(bean.id)
        this.name = bean.name
        this.storageType = bean.storageType
        this.responsiblePersonId = bean.responsiblePersonId
        this.clinicId = bean.clinicId
    }
}

export type StockBean = {
    id?: number,
    name: string,
    storageType: StockType
    responsiblePersonId: number
    clinicId: number
}
