export default abstract class FieldValidator<T = any> {
    abstract validate(value: T): boolean
    abstract getErrorMessage(): string
}