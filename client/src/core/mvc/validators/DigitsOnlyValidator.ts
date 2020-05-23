import FieldValidator from "./FieldValidator";

export default class DigitsOnlyValidator extends FieldValidator<string> {
    private regexp: RegExp

    constructor(serviceCharacter: string) {
        super()
        this.regexp = new RegExp(`^(\\d|${serviceCharacter})*$`)
    }

    getErrorMessage(): string {
        return "";
    }

    isAbortingValidator(): boolean {
        return true;
    }

    isValid(value: string): boolean {
        return this.regexp.test(value);
    }
}