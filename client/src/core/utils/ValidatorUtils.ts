import FieldValidator from "../mvc/validators/FieldValidator";
import MaximalLengthValidator from "../mvc/validators/MaximalLengthValidator";
import FloatNumberEnteringValidator from "../mvc/validators/FloatNumberEnteringValidator";
import FloatNumberValidator from "../mvc/validators/FloatNumberValidator";
import RequiredFieldValidator from "../mvc/validators/RequiredFieldValidator";
import EnteringPriceValidator from "../mvc/validators/EnteringPriceValidator";
import PriceValidator from "../mvc/validators/PriceValidator";
import DigitsOnlyValidator from "../mvc/validators/DigitsOnlyValidator";
import EmailFormatValidator from "../mvc/validators/EmailFormatValidator";

export namespace ValidatorUtils {
    export function getFloatNumberFieldValidators(): FieldValidator[] {
        return [
            new MaximalLengthValidator(10),
            new FloatNumberEnteringValidator(),
            new FloatNumberValidator(),
        ]
    }

    export function getStandardTextValidators(length: number): FieldValidator[] {
        return [
            new RequiredFieldValidator(),
            new MaximalLengthValidator(length),
        ]
    }

    export function getPriceValidators(): FieldValidator[] {
        return [
            new RequiredFieldValidator(),
            new MaximalLengthValidator(10),
            new EnteringPriceValidator(),
            new PriceValidator(),
        ]
    }

    export function getPhoneValidators(): FieldValidator[] {
        return [new MaximalLengthValidator(15),
            new DigitsOnlyValidator("\\*")]
    }

    export function getEmailValidators(): FieldValidator[] {
        return [new MaximalLengthValidator(254),
            new EmailFormatValidator()]
    }
}