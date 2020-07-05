import RegularExpressionValidator from "./RegularExpressionValidator";
import {RegularExpressions} from "../../utils/RegularExpressions";
import MessageResource from "../../message/MessageResource";

export default class PriceValidator extends RegularExpressionValidator {
    constructor() {
        super(RegularExpressions.price)
    }

    getErrorMessage(): string {
        return MessageResource.getMessage("validator.price.message")
    }

    isAbortingValidator(): boolean {
        return false
    }
}