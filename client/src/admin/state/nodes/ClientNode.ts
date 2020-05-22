import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {Client} from "../../../common/beans/Client";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";

export default class ClientNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
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