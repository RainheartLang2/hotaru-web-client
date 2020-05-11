import {Client} from "../../../common/beans/Client";
import ReadActions from "../../../core/mvc/read/ReadActions";
import AdminAppController from "../AdminAppController";
import ClientNode from "../../state/nodes/ClientNode";
import {RemoteMethod} from "../../../core/http/RemoteMethod";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {Pet} from "../../../common/beans/Pet";

export default class ClientActions extends ReadActions<Client, AdminAppController, ClientNode> {
    protected convertResultToItem(result: any): Client[] {
        return result as Client[]
    }

    protected get getAllMethod(): RemoteMethod {
        return RemoteMethods.getAllClients
    }

    public addClient(client: Client): void {
        this.node.add(client)
    }

    public updateClient(client: Client): void {
        this.node.update(client)
    }

    public loadClientsWithPets(clientsIds: number[], callback: Function) {
        fetchUserZoneRpc({
            method: this.getAllMethod,
            params: clientsIds,
            successCallback: result => {
                const clientInfo: ServerClientInfo = result
                this.node.setList(clientInfo.clients)
                this.controller.petActions.setPets(clientInfo.pets)
                callback(result)
            },
        })
    }
}

type ServerClientInfo = {
    clients: Client[],
    pets: Pet[],
}