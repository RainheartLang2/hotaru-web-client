export default abstract class ComplexValidator {
    abstract isValid(): boolean
    abstract getErrorMessage(): string
}