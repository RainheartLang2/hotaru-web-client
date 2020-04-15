import FieldValidator from "./FieldValidator";
import MessageResource from "../../message/MessageResource";

const emailRegExp = new RegExp("^.+@.+$")

export default class EmailFormatValidator extends FieldValidator<string> {
    getErrorMessage(): string {
        return MessageResource.getMessage("validator.email.message")
    }

    isAbortingValidator(): boolean {
        return false;
    }

    isValid(value: string): boolean {
        return !value || emailRegExp.test(value)
    }
}