import Identifiable from "../../entities/Identifiable";
import {ApplicationStoreFriend} from "../store/ApplicationStoreFriend";
import {CollectionUtils} from "../../utils/CollectionUtils";

export default abstract class ReadNode<ItemType extends Identifiable> {
    protected store: ApplicationStoreFriend

    constructor(store: ApplicationStoreFriend) {
        this.store = store

        this.store.registerProperty(this.getListPropertyName(), [])
        if (this.isMappedById()) {
            this.store.registerSelector(this.getMapByIdPropertyName(), {
                dependsOn: [this.getListPropertyName()],
                get: map => {
                    const list: ItemType[] = map.get(this.getListPropertyName()) as ItemType[]
                    return CollectionUtils.mapArrayByUniquePredicate(list, item => item.id)
                }
            })
        }
    }
    protected abstract getListPropertyName(): string

    protected abstract getMapByIdPropertyName(): string

    protected isMappedById(): boolean {
        return true
    }

    public getList(): ItemType[] {
        return this.store.getPropertyValue(this.getListPropertyName())
    }

    public getByIdMap(): Map<number, ItemType> {
        if (!this.isMappedById()) {
            throw new Error("Unsupported operation")
        }
        return this.store.getPropertyValue(this.getMapByIdPropertyName())
    }

    public getItemById(id: number): ItemType {
        const item = this.getByIdMap().get(id)
        if (!item) {
            throw new Error("item with id " + id + " is not presented in the store")
        }
        return item
    }

    public setList(itemList: ItemType[]) {
        this.store.setPropertyValue(this.getListPropertyName(), itemList)
    }
}