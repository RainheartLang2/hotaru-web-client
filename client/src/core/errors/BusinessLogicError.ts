import CustomError from "./CustomError";

export default class BusinessLogicError extends CustomError {
    private type: string

    constructor(type: string) {
        super(type);
        this.type = type;
        Object.setPrototypeOf(this, BusinessLogicError.prototype)
    }
}