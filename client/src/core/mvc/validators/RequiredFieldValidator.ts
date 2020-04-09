import FieldValidator from "./FieldValidator";

export default class RequiredFieldValidator extends FieldValidator<string> {
    getErrorMessage(): string {
        return "Поле является обязательным для заполнения";
    }

    validate(value: string): boolean {
        return !!value;
    }

}