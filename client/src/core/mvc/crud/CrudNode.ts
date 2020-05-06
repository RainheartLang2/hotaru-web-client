import {ApplicationStoreFriend} from "../store/ApplicationStoreFriend";
import Identifiable from "../../entities/Identifiable";
import ReadNode from "../read/ReadNode";

export default abstract class CrudNode<ItemType extends Identifiable> extends ReadNode<ItemType>{

    constructor(store: ApplicationStoreFriend) {
        super(store)
    }

    //TODO: remove, as it may be not used (see ClientNode)
    public abstract buildBasedOnFields(): ItemType

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