import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {Pet} from "../../../common/beans/Pet";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {Client} from "../../../common/beans/Client";
import {Field} from "../../../core/mvc/store/Field";
import Species from "../../../common/beans/Species";
import Breed from "../../../common/beans/Breed";
import {AnimalColor} from "../../../common/beans/AnimalColor";
import {Sex} from "../../../common/beans/enums/Sex";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";

export default class PetNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): PetState {
        return {
            petList: [],
            petPageSelectedClient: null,
            editedPetName: "",
            editedPetSpecies: null,
            editedPetBreed: null,
            editedPetSex: null,
            editedPetColor: null,
            editedPetBirthDate: null,
            editedPetNote: "",
        }
    }

    public getSelectors(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, PetSelectors> {
        return {
            petsByOwners: {
                dependsOn: ["petList"],
                get: (state: Pick<PetState, "petList">) =>
                    CollectionUtils.mapArrayByPredicate(state.petList, pet => pet.ownerId ? pet.ownerId : 0),
                value: new Map<number, Pet[]>(),
            },
            petsForSelectedClient: {
                dependsOn: ["petPageSelectedClient", "petsByOwners"],
                get: (state: Pick<PetState & PetSelectors, "petPageSelectedClient" | "petsByOwners">) =>
                    state.petPageSelectedClient
                        ? state.petsByOwners.get(state.petPageSelectedClient.id!)!
                        : []
                ,
                value: [],
            },
            editedPetNameField: this._store.createField("editedPetName", "", [new MaximalLengthValidator(100)]),
            editedPetNoteField: this._store.createField("editedPetNote", "", [new MaximalLengthValidator(2048)]),
        }
    }
}

export type PetState = {
    petList: Pet[],
    petPageSelectedClient: Client | null,
    editedPetName: string,
    editedPetSpecies: Species | null,
    editedPetBreed: Breed | null,
    editedPetColor: AnimalColor | null,
    editedPetSex: Sex | null,
    editedPetBirthDate: Date | null,
    editedPetNote: string,
}

export type PetSelectors = {
    petsByOwners: Map<number, Pet[]>,
    petsForSelectedClient: Pet[],
    editedPetNameField: Field,
    editedPetNoteField: Field,
}