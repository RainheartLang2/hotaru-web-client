import EmployeeAppController from "../EmployeeAppController";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {Client} from "../../../common/beans/Client";
import {Pet} from "../../../common/beans/Pet";

export default class TypedClientActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public loadList(params: any[] = [], callback: Function = () => {}): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllClients,
            params: params,
            successCallback: result => {
                this.controller.setState({
                    clientsList: result
                })
                callback(result)
            },
        })
    }

    public loadClientsWithPets(clientsIds: number[], callback: Function) {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllClients,
            params: clientsIds,
            successCallback: result => {
                const clientInfo: ServerClientInfo = result
                this.controller.batched(() => {
                    this.controller.setState({
                        clientsList: clientInfo.clients,
                        petList: clientInfo.pets,
                    })
                })
                callback(result)
            },
        })
    }

    public addClient(client: Client): void {
        this.controller.setState({
            clientsList: [...this.controller.state.clientsList, client],
        })
    }
}

type ServerClientInfo = {
    clients: Client[],
    pets: Pet[],
}