import FieldValidator from "../validators/FieldValidator";
import {Field} from "./Field";
import {Selector} from "./TypedApplicationStore";

export default abstract class TypedApplicationStoreFriend<StateType, DerivativeType> {
    public abstract createField(originalProperty: keyof (StateType & DerivativeType),
                                defaultValue?: string,
                                validators?: FieldValidator[],
    ): Selector<(StateType & DerivativeType), Pick<(StateType & DerivativeType), any>, Field>

    public abstract createFormHasNoErrorsSelector(fieldsKeys: (keyof (StateType & DerivativeType))[]
    ): Selector<(StateType & DerivativeType), Pick<(StateType & DerivativeType), any>, boolean>
}