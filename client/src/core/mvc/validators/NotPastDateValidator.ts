import FieldValidator from "./FieldValidator";
import MessageResource from "../../message/MessageResource";
import {DateUtils} from "../../utils/DateUtils";

export default class NotPastDateValidator extends FieldValidator<string> {
    getErrorMessage(): string {
        return MessageResource.getMessage("validator.notPast.message");
    }

    isAbortingValidator(): boolean {
        return false;
    }

    isValid(value: string): boolean {
        const date = new Date(value)
        return !DateUtils.isDateValid(date) || (DateUtils.getPureDate(date) >= DateUtils.getCurrentDate())
    }

}