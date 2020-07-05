import MessageResource from "../../../core/message/MessageResource";
import Stock from "../Storage";

export enum StockType {
    Storing = "Storing",
    Selling = "Selling",
}

export namespace StockType {
    export function stockTypeToString(stockType: StockType): string {
        if (stockType == StockType.Storing) {
            return MessageResource.getMessage("stockType.storing.name")
        } else if (stockType == StockType.Selling) {
            return MessageResource.getMessage("stockType.selling.name")
        } else {
            throw new Error("no name for stock type " + stockType)
        }
    }

    export function getDefaultType(): StockType {
        return StockType.Selling
    }

    export function stockTypeToNumber(stockType: StockType): number {
        if (stockType == StockType.Storing) {
            return 1
        } else if (stockType == StockType.Selling) {
            return 2
        } else {
            throw new Error("no number for stock type " + stockType)
        }
    }
}