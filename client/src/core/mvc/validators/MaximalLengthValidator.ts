import FieldValidator from "./FieldValidator";

export default class MaximalLengthValidator extends FieldValidator<string> {
    private length: number

    constructor(length: number) {
        super()
        this.length = length
    }

    getErrorMessage(): string {
        return "";
    }

    isAbortingValidator(): boolean {
        return true;
    }

    isValid(value: string): boolean {
        return value.length <= this.length;
    }

}