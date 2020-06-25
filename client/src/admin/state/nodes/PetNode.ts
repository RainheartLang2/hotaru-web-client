import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {Pet} from "../../../common/beans/Pet";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {Field} from "../../../core/mvc/store/Field";
import Species from "../../../common/beans/Species";
import Breed from "../../../common/beans/Breed";
import {AnimalColor} from "../../../common/beans/AnimalColor";
import {Sex} from "../../../common/beans/enums/Sex";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import {RightPanelType} from "../enum/RightPanelType";
import {ConfigureType} from "../../../core/types/ConfigureType";
import {DialogType} from "../enum/DialogType";

export default class PetNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): PetState {
        return {
            petList: [],
            editedPetId: undefined,
            editedPetName: "",
            editedPetSpecies: null,
            editedPetBreed: null,
            editedPetSex: null,
            editedPetColor: null,
            editedPetBirthDate: "",
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
            petsById: {
                dependsOn: ["petList"],
                get: (state: Pick<PetState, "petList">) =>
                    CollectionUtils.mapIdentifiableArray(state.petList),
                value: new Map<number, Pet>(),
            },
            editedPetClientId: {
                dependsOn: ["dialogType", "editedClientId"],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors, "dialogType" | "editedClientId">) =>
                    state.dialogType == DialogType.EditClient
                        ? state.editedClientId
                        : null,
                value: null,
            },
            petsForSelectedClient: {
                dependsOn: ["editedPetClientId", "petsByOwners"],
                get: (state: Pick<PetState & PetSelectors, "editedPetClientId" | "petsByOwners">) =>
                    state.editedPetClientId && state.petsByOwners.get(state.editedPetClientId)
                        ? state.petsByOwners.get(state.editedPetClientId)!
                        : []
                ,
                value: [],
            },
            editedPetNameField: this._store.createField("editedPetName", "", [new MaximalLengthValidator(100)]),
            editedPetBirthDateField: this._store.createField("editedPetBirthDate"),
            editedPetNoteField: this._store.createField("editedPetNote", "", [new MaximalLengthValidator(2048)]),
            editedPetBreedsList: {
                dependsOn: ["breedsBySpecies", "editedPetSpecies"],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors, "breedsBySpecies" | "editedPetSpecies">) => {
                    if (!state.editedPetSpecies) {
                        return []
                    }

                    const result = state.breedsBySpecies.get(state.editedPetSpecies.id!)
                    if (!result) {
                        throw new Error("no breed for id " + state.editedPetSpecies.id)
                    }
                    return result
                },
                value: [],
            },
            editedPetFormMode: {
                dependsOn: ["rightPanelType"],
                get: (state: Pick<EmployeeAppState, "rightPanelType">) => {
                    if (state.rightPanelType == RightPanelType.AddPet) {
                        return "create"
                    }
                    if (state.rightPanelType == RightPanelType.EditPet) {
                        return "edit"
                    }
                    return "none"
                },
                value: "none",
            },
            editPetFormHasErrors: {
                dependsOn: ["editedPetSpecies"],
                get: (state: Pick<PetState, "editedPetSpecies">) => {
                    return state.editedPetSpecies == null
                },
                value: false,
            }
        }
    }
}

export type PetState = {
    petList: Pet[],
    editedPetId?: number,
    editedPetName: string,
    editedPetSpecies: Species | null,
    editedPetBreed: Breed | null,
    editedPetColor: AnimalColor | null,
    editedPetSex: Sex | null,
    editedPetBirthDate: string,
    editedPetNote: string,
}

export type PetSelectors = {
    petsByOwners: Map<number, Pet[]>,
    petsById: Map<number, Pet>,
    petsForSelectedClient: Pet[],
    editedPetClientId: number | null,
    editedPetBreedsList: Breed[],
    editedPetNameField: Field,
    editedPetBirthDateField: Field,
    editedPetNoteField: Field,
    editedPetFormMode: ConfigureType,
    editPetFormHasErrors: boolean,
}