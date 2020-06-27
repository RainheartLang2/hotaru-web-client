import FieldValidator from "./FieldValidator";
import {DateUtils} from "../../utils/DateUtils";
import MessageResource from "../../message/MessageResource";

export default class DateValidator extends FieldValidator<string> {
    getErrorMessage(): string {
        return MessageResource.getMessage("validator.date.message")
    }

    isAbortingValidator(): boolean {
        return false
    }

    isValid(value: string): boolean {
        return DateUtils.isDateValid(new Date(value))
    }

}