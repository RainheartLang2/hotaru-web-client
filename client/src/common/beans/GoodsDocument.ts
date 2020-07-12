import Identifiable from "../../core/entities/Identifiable";
import {DocumentState} from "./enums/DocumentState";
import GoodsPackWithPrice from "./GoodsPackWithPrice";
import {ShipingType} from "./enums/ShipingType";
import CustomContainer from "../../core/beans/CustomContainer";

export default class GoodsDocument extends Identifiable {
   public documentState: DocumentState
   public shipingType: ShipingType
   public date: Date
   public stockId: number
   public counterAgentId: number | null
   public num: string
   public goods: CustomContainer<GoodsPackWithPrice>

   constructor(bean: GoodsDocumentBean) {
      super(bean.id)
      this.documentState = bean.documentState
      this.shipingType = bean.shipingType
      this.date = new Date(bean.date)
      this.stockId = bean.stockId
      this.counterAgentId = bean.counterAgentId
      this.num = bean.num
      this.goods = bean.goods
   }
}

export type GoodsDocumentBean = {
   id?: number
   documentState: DocumentState
   shipingType: ShipingType
   date: Date
   stockId: number
   counterAgentId: number | null
   num: string
   goods: CustomContainer<GoodsPackWithPrice>
}