import FieldValidator from "../validators/FieldValidator";

export type Field<T = string> = {
    value: T,
    errors: string[],
    validators: FieldValidator[],
    validationActive: boolean,
}