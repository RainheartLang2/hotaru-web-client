export default abstract class CustomError extends Error {
    constructor(message: string) {
        super(message)
    }
}