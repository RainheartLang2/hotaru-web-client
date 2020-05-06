import {Client} from "../../../common/beans/Client";
import ReadActions from "../../../core/mvc/read/ReadActions";
import AdminAppController from "../AdminAppController";
import ClientNode from "../../state/nodes/ClientNode";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import {RemoteMethod} from "../../../core/http/RemoteMethod";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";

export default class ClientActions extends ReadActions<Client, AdminAppController, ClientNode> {
    protected convertResultToItem(result: any): Client[] {
        return result as Client[]
    }

    protected getAllLoadingProperty(): string {
        return AdminStateProperty.IsPageLoading
    }

    protected get getAllMethod(): RemoteMethod {
        return RemoteMethods.getAllClients
    }

    public addClient(client: Client): void {
        this.node.add(client)
    }

}