import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import Species from "../../../common/beans/Species";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import {Field} from "../../../core/mvc/store/Field";
import Breed from "../../../common/beans/Breed";

export default class BreedNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): BreedsPageState {
        return {
            breedsList:[],
            breedPageSelectedSpecies: Species.getMock(),
            editedBreedId: undefined,
            editedBreedName: "",
            addedBreedName: "",
        }
    }

    public getSelectors(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, BreedsPageSelector> {
        return {
            breedsListById: {
                dependsOn: ["breedsList"],
                get: (state: Pick<BreedsPageState, "breedsList">) =>
                    CollectionUtils.mapArrayByUniquePredicate(state.breedsList, breed => breed.id ? breed.id: 0),
                value: new Map<number, Breed>(),
            },
            breedsBySpecies: {
                dependsOn: ["breedsList"],
                get: (state: Pick<BreedsPageState, "breedsList">) =>
                    CollectionUtils.mapArrayByPredicate(state.breedsList, breed => breed.speciesId ? breed.speciesId : 0),
                value: new Map<number, Breed[]>(),
            },
            breedsForCurrentSpecies: {
                dependsOn: ["breedPageSelectedSpecies", "breedsBySpecies"],
                get: (state: Pick<EmployeeAppState & BreedsPageSelector, "breedPageSelectedSpecies" | "breedsBySpecies">) => {
                    const breedsBySpecies = state.breedsBySpecies
                    const selectedSpecies = state.breedPageSelectedSpecies

                    if (selectedSpecies && selectedSpecies.id) {
                        const result = breedsBySpecies.get(selectedSpecies.id)
                        if (result) {
                            return result
                        } else {
                            throw new Error("")
                        }
                    } else {
                        return []
                    }
                },
                value: [],
            },
            addedBreedNameField: this._store.createField("addedBreedName", "", [
                new RequiredFieldValidator(),
                new MaximalLengthValidator(200),
            ],
                false)
        }
    }
}

export type BreedsPageState = {
    breedsList: Breed[],
    breedPageSelectedSpecies: Species,
    editedBreedId: number | undefined,
    editedBreedName: string,
    addedBreedName: string,
}

export type BreedsPageSelector = {
    breedsListById: Map<number, Breed>,
    breedsBySpecies: Map<number, Breed[]>,
    breedsForCurrentSpecies: Breed[],
    addedBreedNameField: Field,
}
