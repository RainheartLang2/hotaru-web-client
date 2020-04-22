export default abstract class CustomError extends Error {
    constructor(message: string) {
        super(message);
        //Hack because of https://github.com/Microsoft/TypeScript/issues/13965
        Object.setPrototypeOf(this, CustomError.prototype)
    }
}