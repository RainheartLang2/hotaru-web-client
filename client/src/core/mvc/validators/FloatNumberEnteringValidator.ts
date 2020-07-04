import RegularExpressionValidator from "./RegularExpressionValidator";
import {RegularExpressions} from "../../utils/RegularExpressions";

export default class FloatNumberEnteringValidator extends RegularExpressionValidator {
    constructor() {
        super(RegularExpressions.enteredNumber)
    }

    getErrorMessage(): string {
        return "";
    }

    isAbortingValidator(): boolean {
        return true;
    }
}