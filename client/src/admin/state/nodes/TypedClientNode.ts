import TypedApplicationStoreFriend from "../../../core/mvc/store/TypedApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import {SelectorsInfo} from "../../../core/mvc/store/TypedApplicationStore";
import {PetSelectors, PetState} from "./TypedPetNode";
import {Client} from "../../../common/beans/Client";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";

export default class TypedClientNode {
    private _store: TypedApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: TypedApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): ClientState {
        return {
            clientsList: []
        }
    }

    public getSelectors(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, ClientSelectors> {
        return {
            clientsListById: {
                dependsOn: ["clientsList"],
                get: (state: Pick<ClientState, "clientsList">) =>
                    CollectionUtils.mapArrayByUniquePredicate(state.clientsList, client => client.id ? client.id : 0),
                value: new Map<number, Client>(),
            }
        }
    }
}

export type ClientState = {
    clientsList: Client[],
}

export type ClientSelectors = {
    clientsListById: Map<number, Client>
}