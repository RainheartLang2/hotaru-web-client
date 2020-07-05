import RegularExpressionValidator from "./RegularExpressionValidator";
import {RegularExpressions} from "../../utils/RegularExpressions";

export default class EnteringPriceValidator extends RegularExpressionValidator {
    constructor() {
        super(RegularExpressions.enteringPrice)
    }

    getErrorMessage(): string {
        return "";
    }

    isAbortingValidator(): boolean {
        return true;
    }
}