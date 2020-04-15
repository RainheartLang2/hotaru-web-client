import FieldValidator from "./FieldValidator";
import MessageResource from "../../message/MessageResource";

export default class ConfirmPasswordValidator extends FieldValidator<string> {
    private getOriginalValue: () => string

    constructor(getOriginalValue: () => string) {
        super()
        this.getOriginalValue = getOriginalValue
    }

    getErrorMessage(): string {
        return MessageResource.getMessage("validator.confirm.password.message");
    }

    isAbortingValidator(): boolean {
        return false;
    }

    isValid(value: string): boolean {
        return value == this.getOriginalValue();
    }
}