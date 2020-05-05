import RegularExpressionValidator from "./RegularExpressionValidator";
import MessageResource from "../../message/MessageResource";

export default class TimeValidator extends RegularExpressionValidator {
    constructor() {
        super("\\d\\d:\\d\\d")
    }

    getErrorMessage(): string {
        return MessageResource.getMessage("validator.time.message");
    }

    isAbortingValidator(): boolean {
        return false;
    }
}