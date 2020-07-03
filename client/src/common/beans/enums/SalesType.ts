import MessageResource from "../../../core/message/MessageResource";

export enum SalesType {
    Goods = "Goods",
    Service = "Service",
}

export namespace SalesType {
    export function salesTypeToString(type: SalesType): string {
        if (type == SalesType.Goods) {
            return MessageResource.getMessage("salesType.goods.name.plural")
        } else if (type == SalesType.Service) {
            return MessageResource.getMessage("salesType.service.name.plural")
        } else {
            throw new Error("unknown sales type " + type)
        }
    }

    export function salesTypeToNumber(type: SalesType): number {
        if (type == SalesType.Goods) {
            return 0
        } else if (type == SalesType.Service) {
            return 1
        } else {
            throw new Error("unknown sales type " + type)
        }
    }
}