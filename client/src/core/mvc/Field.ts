import FieldValidator from "./validators/FieldValidator";

export default class Field<T> {
    private value: T
    private validators: FieldValidator<T>[] = []
    private errorMessages: string[] = []

    public constructor(defaultValue: T) {
        this.value = defaultValue
    }

    public addValidator(validator: FieldValidator<T>): Field<T> {
        this.validators.push(validator)
        return this
    }

    public setValue(value: T) {
        this.errorMessages = []
        this.validators.forEach((validator) => {
                const validationResult = validator.validate(value)
                if (validationResult != null) {
                    this.errorMessages.push(validationResult)
                }
            }
        )

        if (this.errorMessages.length === 0) {
            this.value = value
        }
    }

    public getValue(): T {
        return this.value
    }

    get errors(): string[] {
        return this.errorMessages
    }
}