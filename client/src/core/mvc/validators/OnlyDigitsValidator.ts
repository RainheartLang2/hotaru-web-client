import FieldValidator from "./FieldValidator";

const regexp = new RegExp("^\\d*$")
export default class OnlyDigitsValidator extends FieldValidator<string> {
    getErrorMessage(): string {
        return "";
    }

    isAbortingValidator(): boolean {
        return true;
    }

    isValid(value: string): boolean {
        return regexp.test(value);
    }
}