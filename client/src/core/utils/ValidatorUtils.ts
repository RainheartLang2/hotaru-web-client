import FieldValidator from "../mvc/validators/FieldValidator";
import MaximalLengthValidator from "../mvc/validators/MaximalLengthValidator";
import FloatNumberEnteringValidator from "../mvc/validators/FloatNumberEnteringValidator";
import FloatNumberValidator from "../mvc/validators/FloatNumberValidator";

export namespace ValidatorUtils {
    export function getFloatNumberFieldValidators(): FieldValidator[] {
        return [
            new MaximalLengthValidator(10),
            new FloatNumberEnteringValidator(),
            new FloatNumberValidator(),
        ]
    }
}