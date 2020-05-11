import CustomError from "./CustomError";

export default class HttpTransportError extends CustomError {
    private _code: number
    private _message: string

    constructor(code: number, message: string, ) {
        super(message);
        this._code = code;
        this._message = message;
        Object.setPrototypeOf(this, HttpTransportError.prototype)
    }

    get code(): number {
        return this._code;
    }

    get message(): string {
        return this._message;
    }
}