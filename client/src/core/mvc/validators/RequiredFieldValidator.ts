import FieldValidator from "./FieldValidator";
import MessageResource from "../../message/MessageResource";

export default class RequiredFieldValidator extends FieldValidator<string> {
    getErrorMessage(): string {
        return MessageResource.getMessage("validator.required.message");
    }

    isValid(value: string): boolean {
        return !!value;
    }

    isAbortingValidator(): boolean {
        return false;
    }
}