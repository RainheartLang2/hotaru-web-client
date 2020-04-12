import FieldValidator from "../validators/FieldValidator";

export type Field<T> = {
    value: T,
    errors: string[],
    validators: FieldValidator[],
    validationActive: boolean,
}