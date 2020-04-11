import CustomError from "./CustomError";

export default class HtttpTransportError extends CustomError {
    private _code: number
    private _message: string

    constructor(code: number, message: string, ) {
        super(message);
        this._code = code;
        this._message = message;
    }

    get code(): number {
        return this._code;
    }

    get message(): string {
        return this._message;
    }
}