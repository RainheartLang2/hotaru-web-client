import TypedApplicationStoreFriend from "../../../core/mvc/store/TypedApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import {SelectorsInfo} from "../../../core/mvc/store/TypedApplicationStore";
import {Pet} from "../../../common/beans/Pet";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";

export default class TypedPetNode {
    private _store: TypedApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: TypedApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): PetState {
        return {
            petList: []
        }
    }

    public getSelectors(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, PetSelectors> {
        return {
            petsByOwners: {
                dependsOn: ["petList"],
                get: (state: Pick<PetState, "petList">) =>
                    CollectionUtils.mapArrayByPredicate(state.petList, pet => pet.ownerId ? pet.ownerId : 0),
                value: new Map<number, Pet[]>(),
            }
        }
    }
}

export type PetState = {
    petList: Pet[],
}

export type PetSelectors = {
    petsByOwners: Map<number, Pet[]>,
}