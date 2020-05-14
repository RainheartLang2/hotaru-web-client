import FieldValidator from "../validators/FieldValidator";

export type Field<T = any> = {
    value: T,
    errors: string[],
    validators: FieldValidator[],
    validationActive: boolean,
}