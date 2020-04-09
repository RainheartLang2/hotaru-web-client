export default abstract class FieldValidator<T> {
    abstract validate(value: T): boolean
    abstract getErrorMessage(): string
}