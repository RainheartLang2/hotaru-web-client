import Identifiable from "../../core/entities/Identifiable";

export default class GoodsPack extends Identifiable {
    public stockId: number
    public goodsTypeId: number
    public goodsProducerId?: number
    public incomeDocumentId?: number
    public amount: number
    public series: string
    public creationDate?: Date
    public expirationDate?: Date

    constructor(bean: GoodsPackBean) {
        super(bean.id)
        this.stockId = bean.stockId
        this.goodsTypeId = bean.goodsTypeId
        this.goodsProducerId = bean.goodsProducerId
        this.incomeDocumentId = bean.incomeDocumentId
        this.amount = bean.amount
        this.series = bean.series
        this.creationDate = bean.creationDate ? new Date(bean.creationDate) : undefined
        this.expirationDate = bean.expirationDate ? new Date(bean.expirationDate) : undefined
    }

    public toBean(): GoodsPackBean {
        return {
            id: this.id,
            stockId: this.stockId,
            goodsTypeId: this.goodsTypeId,
            goodsProducerId: this.goodsProducerId,
            incomeDocumentId: this.incomeDocumentId,
            amount: this.amount,
            series: this.series,
            creationDate: this.creationDate,
            expirationDate: this.expirationDate,
        }
    }
}

export type GoodsPackBean = {
    id?: number
    stockId: number
    goodsTypeId: number
    goodsProducerId?: number
    incomeDocumentId?: number
    amount: number
    series: string
    creationDate?: Date
    expirationDate?: Date
}