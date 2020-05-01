import CrudNode from "../../../core/mvc/crud/CrudNode";
import Species from "../../../common/beans/Species";
import {AdminStateProperty} from "../AdminApplicationState";
import {ApplicationStoreFriend} from "../../../core/mvc/store/ApplicationStoreFriend";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";

export default class SpeciesNode extends CrudNode<Species> {

    constructor(store: ApplicationStoreFriend) {
        super(store)
        this.store.registerProperty(AdminStateProperty.EditedSpeciesId, null)
        this.store.registerProperty(AdminStateProperty.EditedSpeciesName, "")
        this.store.registerField(AdminStateProperty.AddedSpeciesName, "",
            [new RequiredFieldValidator(),
                new MaximalLengthValidator(200),
            ])
    }

    public buildBasedOnFields(): Species {
        return {
            id: this.store.getPropertyValue(AdminStateProperty.EditedSpeciesId),
            name: this.store.getPropertyValue(AdminStateProperty.EditedSpeciesName),
        }
    }

    public getAddedSpeciesName(): string {
        return this.store.getFieldValue(AdminStateProperty.AddedSpeciesName)
    }

    protected getListPropertyName(): string {
        return AdminStateProperty.SpeciesList;
    }

    protected getMapByIdPropertyName(): string {
        return AdminStateProperty.SpeciesListById;
    }

}