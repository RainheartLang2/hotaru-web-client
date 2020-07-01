import FieldValidator from "../validators/FieldValidator";
import {Field} from "./Field";
import {DefaultStateType, Selector} from "./ApplicationStore";
import StateChangeContext from "./StateChangeContext";

export default abstract class ApplicationStoreFriend<StateType extends DefaultStateType, SelectorsType> {
    public abstract createField(originalProperty: keyof (StateType & SelectorsType),
                                defaultValue?: string,
                                validators?: FieldValidator[],
                                validationActive?: boolean,
    ): Selector<(StateType & SelectorsType), Pick<(StateType & SelectorsType), any>, Field>

    public abstract createFormHasErrorsSelector(fieldsKeys: (keyof SelectorsType)[],
    ): Selector<(StateType & SelectorsType), Pick<(StateType & SelectorsType), any>, boolean>

    public abstract get state(): Readonly<StateType & SelectorsType>

    public abstract recalculateSelectors(selectors: (keyof SelectorsType)[],
                                         context: StateChangeContext<StateType, SelectorsType>
    ): void
}
