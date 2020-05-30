import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import {Field} from "../../../core/mvc/store/Field";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import Species from "../../../common/beans/Species";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";

export default class SpeciesNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): SpeciesPageState {
        return {
            speciesList: [],
            editedSpeciesId: undefined,
            editedSpeciesName: "",
            addedSpeciesName: "",
        }
    }

    public getSelectors(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, SpeciesPageSelector> {
        return {
            speciesListById: {
                dependsOn: ["speciesList"],
                get: (state: Pick<SpeciesPageState, "speciesList">) =>
                    CollectionUtils.mapArrayByUniquePredicate(state.speciesList, species => species.id ? species.id : 0),
                value: new Map<number, Species>(),
            },
            addedSpeciesNameField: this._store.createField("addedSpeciesName", "", [
                new RequiredFieldValidator(),
                new MaximalLengthValidator(200),
            ], false),
            addedSpeciesNameHasError: this._store.createFormHasErrorsSelector(["addedSpeciesNameField"])
        }
    }
}

export type SpeciesPageState = {
    speciesList: Species[],
    editedSpeciesId: number | undefined,
    editedSpeciesName: string,
    addedSpeciesName: string,
}

export type SpeciesPageSelector = {
    speciesListById: Map<number, Species>,
    addedSpeciesNameField: Field,
    addedSpeciesNameHasError: boolean,
}