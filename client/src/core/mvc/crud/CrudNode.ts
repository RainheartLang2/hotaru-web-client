import {ApplicationStoreFriend} from "../store/ApplicationStoreFriend";
import {CollectionUtils} from "../../utils/CollectionUtils";
import Identifiable from "../../entities/Identifiable";

export default abstract class CrudNode<ItemType extends Identifiable> {
    protected store: ApplicationStoreFriend

    constructor(store: ApplicationStoreFriend) {
        this.store = store

        this.store.registerProperty(this.getListPropertyName(), [])
        this.store.registerSelector(this.getMapByIdPropertyName(), {
            dependsOn: [this.getListPropertyName()],
            get: map => {
                const list: ItemType[] = map.get(this.getListPropertyName()) as ItemType[]
                return CollectionUtils.mapArrayByUniquePredicate(list, item => item.id)
            }
        })
    }

    protected abstract getListPropertyName(): string

    protected abstract getMapByIdPropertyName(): string

    public abstract buildBasedOnFields(): ItemType

    public getList(): ItemType[] {
        return this.store.getPropertyValue(this.getListPropertyName())
    }

    public getByIdMap(): Map<number, ItemType> {
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

    public add(item: ItemType) {
        const list = this.getList()
        list.push(item)
        this.setList(list)
    }

    public update(updatedItem: ItemType) {
        const list = this.getList().map(item => item.id == updatedItem.id ? updatedItem : item)
        this.setList(list)
    }

    public delete(id: number) {
        const items = this.getList().filter(item => item.id != id)
        this.setList(items)
    }
}