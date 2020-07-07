import FieldValidator from "./FieldValidator";
import {RegularExpressions} from "../../utils/RegularExpressions";

export default class DigitsOnlyValidator extends FieldValidator<string> {
    private regexp: RegExp

    constructor(serviceCharacter?: string) {
        super()
        if (serviceCharacter) {
            this.regexp = new RegExp(`^(\\d|${serviceCharacter})*$`)
        } else {
            this.regexp = new RegExp(RegularExpressions.digitsOnly)
        }

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