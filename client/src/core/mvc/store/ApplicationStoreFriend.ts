import FieldValidator from "../validators/FieldValidator";
import {Field} from "./Field";
import {Selector} from "./ApplicationStore";

export default abstract class ApplicationStoreFriend<StateType, DerivativeType> {
    public abstract createField(originalProperty: keyof (StateType & DerivativeType),
                                defaultValue?: string,
                                validators?: FieldValidator[],
    ): Selector<(StateType & DerivativeType), Pick<(StateType & DerivativeType), any>, Field>

    public abstract createFormHasErrorsSelector(fieldsKeys: (keyof (StateType & DerivativeType))[]
    ): Selector<(StateType & DerivativeType), Pick<(StateType & DerivativeType), any>, boolean>
}