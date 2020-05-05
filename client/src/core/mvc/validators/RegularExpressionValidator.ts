import FieldValidator from "./FieldValidator";

export default abstract class RegularExpressionValidator extends FieldValidator<string> {
    private expression: RegExp

    constructor(regExpString: string) {
        super()
        this.expression = new RegExp(regExpString)
    }

    isValid(value: string): boolean {
        return this.expression.test(value);
    }
}