import GoodsPackWithPrice from "../../common/beans/GoodsPackWithPrice";
import GoodsPack from "../../common/beans/GoodsPack";
import MessageResource from "../message/MessageResource";
import {DateUtils} from "./DateUtils";

export namespace SalesUtils {

    function getExpirationText(pack: GoodsPack): string {
        return pack.expirationDate
            ? MessageResource.getMessage("list.goods.date.label") + " " + DateUtils.standardFormatDate(pack.expirationDate)
            : ""
    }

    export function formatSeriesAndExpirationDate(pack: GoodsPack) {
        return getSeriesText(pack) + getExpirationText(pack)
    }

    function getSeriesText(item: GoodsPack): string {
        return item.series
            ? MessageResource.getMessage("list.goods.series.label") + " " + item.series + " "
            : ""
    }
}