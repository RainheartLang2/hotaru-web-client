export default abstract class FieldValidator<T> {
    abstract validate(value: T): string | null
}