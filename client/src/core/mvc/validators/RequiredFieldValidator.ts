import FieldValidator from "./FieldValidator";
import MessageResource from "../../message/MessageResource";

export default class RequiredFieldValidator extends FieldValidator<string> {

    private checkCallback: () => boolean
    constructor(callback: () => boolean = () => true) {
        super()
        this.checkCallback = callback
    }
    getErrorMessage(): string {
        return MessageResource.getMessage("validator.required.message");
    }

    isValid(value: string): boolean {
        return !this.checkCallback() || !!value;
    }

    isAbortingValidator(): boolean {
        return false;
    }
}