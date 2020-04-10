export default abstract class FieldValidator<T = any> {
    abstract isValid(value: T): boolean
    abstract getErrorMessage(): string
    abstract isAbortingValidator(): boolean
}