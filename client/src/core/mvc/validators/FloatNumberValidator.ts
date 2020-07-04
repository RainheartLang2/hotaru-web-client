import RegularExpressionValidator from "./RegularExpressionValidator";
import {RegularExpressions} from "../../utils/RegularExpressions";
import MessageResource from "../../message/MessageResource";

export default class FloatNumberValidator extends RegularExpressionValidator {
    constructor() {
        super(RegularExpressions.number)
    }

    getErrorMessage(): string {
        return MessageResource.getMessage("validator.floatNumber.message")
    }

    isAbortingValidator(): boolean {
        return false
    }
}