import MessageResource from "../../message/MessageResource";
import FieldValidator from "./FieldValidator";

export default class SimpleComplexValidator extends FieldValidator {
    private validationFunction: () => boolean
    private errorMessageKey: string

    constructor(validationFunction: () => boolean, errorMessageKey: string) {
        super()
        this.validationFunction = validationFunction
        this.errorMessageKey = errorMessageKey
    }

    getErrorMessage(): string {
        return MessageResource.getMessage(this.errorMessageKey);
    }

    isValid(): boolean {
        return this.validationFunction()
    }

    isAbortingValidator(): boolean {
        return false;
    }
}