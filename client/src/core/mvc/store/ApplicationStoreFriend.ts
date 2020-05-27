import FieldValidator from "../validators/FieldValidator";
import {Field} from "./Field";
import {Selector} from "./ApplicationStore";

export default abstract class ApplicationStoreFriend<StateType, SelectorsType> {
    public abstract createField(originalProperty: keyof (StateType & SelectorsType),
                                defaultValue?: string,
                                validators?: FieldValidator[],
    ): Selector<(StateType & SelectorsType), Pick<(StateType & SelectorsType), any>, Field>

    public abstract createFormHasErrorsSelector(fieldsKeys: (keyof SelectorsType)[],
    ): Selector<(StateType & SelectorsType), Pick<(StateType & SelectorsType), any>, boolean>

    public abstract get state(): Readonly<StateType & SelectorsType>
}