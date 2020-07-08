import Identifiable from "../../core/entities/Identifiable";
import {__extends} from "tslib";

export default class GoodsPack extends Identifiable {
    public stockId: number
    public goodsTypeId: number
    public goodsProducerId: number
    public incomeDocumentId: number
    public amount: number
    public series: string
    public creationDate: Date
    public expirationDate: Date

    constructor(bean: GoodsPackBean) {
        super(bean.id)
        this.stockId = bean.stockId
        this.goodsTypeId = bean.goodsTypeId
        this.goodsProducerId = bean.goodsProducerId
        this.incomeDocumentId = bean.incomeDocumentId
        this.amount = bean.amount
        this.series = bean.series
        this.creationDate = new Date(bean.creationDate)
        this.expirationDate = new Date(bean.expirationDate)
    }
}

export type GoodsPackBean = {
    id?: number
    stockId: number
    goodsTypeId: number
    goodsProducerId: number
    incomeDocumentId: number
    amount: number
    series: string
    creationDate: Date
    expirationDate: Date
}