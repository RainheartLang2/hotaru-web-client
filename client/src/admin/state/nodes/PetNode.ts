import CrudNode from "../../../core/mvc/crud/CrudNode";
import {Pet} from "../../../common/beans/Pet";
import {AdminStateProperty} from "../AdminApplicationState";

export default class PetNode extends CrudNode<Pet> {
    buildBasedOnFields(): Pet {
        throw new Error("Not implemented operation")
    }

    protected getListPropertyName(): string {
        return AdminStateProperty.PetList
    }

    protected getMapByIdPropertyName(): string {
        return AdminStateProperty.PetListById
    }
}