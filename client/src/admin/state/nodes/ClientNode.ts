import ReadNode from "../../../core/mvc/read/ReadNode";
import {Client} from "../../../common/beans/Client";
import {AdminStateProperty} from "../AdminApplicationState";
import CrudNode from "../../../core/mvc/crud/CrudNode";
import {ApplicationStoreFriend} from "../../../core/mvc/store/ApplicationStoreFriend";

export default class ClientNode extends CrudNode<Client> {

    constructor(store: ApplicationStoreFriend) {
        super(store)
    }

    buildBasedOnFields(): Client {
        return {};
    }
    protected getListPropertyName(): string {
        return AdminStateProperty.ClientsList;
    }

    protected getMapByIdPropertyName(): string {
        return AdminStateProperty.ClientsListById;
    }

}