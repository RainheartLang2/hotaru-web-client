import FieldValidator from "./FieldValidator";
import MessageResource from "../../message/MessageResource";

export default class PositiveNumberValidator extends FieldValidator<string> {
    getErrorMessage(): string {
        return MessageResource.getMessage("validator.positive.message");
    }

    isAbortingValidator(): boolean {
        return false;
    }

    isValid(value: string): boolean {
        return value == "" || +value > 0;
    }

}