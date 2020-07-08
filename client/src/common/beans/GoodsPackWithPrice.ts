import GoodsPack, {GoodsPackBean} from "./GoodsPack";

export default class GoodsPackWithPrice extends GoodsPack {
    public price: number
    public taxRate: number

    constructor(bean: GoodsPackBean, price: number, taxRate: number) {
        super(bean)
        this.price = price
        this.taxRate = taxRate
    }
}