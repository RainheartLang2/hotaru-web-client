import FieldValidator from "./FieldValidator";

export default class CallbackValidator<T = any> extends FieldValidator<T> {
    private getError: () => string
    private checkValidity: (value: T) => boolean
    private aborting: boolean

    constructor(getError: () => string, checkValidity: (value: T) => boolean, aborting: boolean = false) {
        super();
        this.getError = getError;
        this.checkValidity = checkValidity;
        this.aborting = aborting
    }

    getErrorMessage(): string {
        return this.getError();
    }

    isAbortingValidator(): boolean {
        return this.aborting;
    }

    isValid(value: T): boolean {
        return this.checkValidity(value);
    }

}