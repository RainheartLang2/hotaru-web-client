import CrudNode from "../../../core/mvc/crud/CrudNode";
import {Pet} from "../../../common/beans/Pet";
import {AdminStateProperty} from "../AdminApplicationState";
import {ApplicationStoreFriend} from "../../../core/mvc/store/ApplicationStoreFriend";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";

export default class PetNode extends CrudNode<Pet> {
    constructor(store: ApplicationStoreFriend) {
        super(store)

        this.store.registerSelector(AdminStateProperty.PetsByOwner, {
            dependsOn: [AdminStateProperty.PetList],
            get: map => {
                const petList: Pet[] = map.get(AdminStateProperty.PetList)
                return CollectionUtils.mapArrayByPredicate(petList, pet => pet.ownerId)
            }
        })
    }

    buildBasedOnFields(): Pet {
        throw new Error("Not implemented operation")
    }

    protected getListPropertyName(): string {
        return AdminStateProperty.PetList
    }

    protected getMapByIdPropertyName(): string {
        throw new Error("Unsupported operation")
    }

    protected isMappedById(): boolean {
        return false;
    }

    public getOwnerPets(ownerId: number): Pet[] {
        const petsByOwners: Map<number, Pet[]> = this.store.getPropertyValue(AdminStateProperty.PetsByOwner)
        const result = petsByOwners.get(ownerId)
        return result ? result : []
    }

}