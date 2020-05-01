import CrudNode from "./CrudNode";
import ApplicationController from "../ApplicationController";
import {fetchUserZoneRpc} from "../../utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {RemoteMethod} from "../../http/RemoteMethod";
import Identitiable from "../../entities/Identitiable";

export default abstract class CrudAction<ItemType extends Identitiable,
    ControllerType extends ApplicationController,
    NodeType extends CrudNode<ItemType>
    > {
    protected controller: ControllerType
    protected node: NodeType

    constructor(controller: ControllerType,
                node: NodeType) {
        this.controller = controller
        this.node = node
    }

    protected abstract getAllLoadingProperty(): string

    protected abstract get getAllMethod(): RemoteMethod
    protected abstract get addMethod(): RemoteMethod
    protected abstract get updateMethod(): RemoteMethod
    protected abstract get deleteMethod(): RemoteMethod

    protected abstract convertResultToItem(result: any): ItemType[]

    public loadList(callback: Function = () => {}): void {
        fetchUserZoneRpc({
            method: this.getAllMethod,
            successCallback: result => {
                this.node.setList(this.convertResultToItem(result))
                callback()
            },
            loadingProperty: this.getAllLoadingProperty(),
        })
    }

    public submitCreateItem(callback: Function = () => {}): void {
        const item = this.getCreateItem()
        fetchUserZoneRpc({
            method: this.addMethod,
            params: [item],
            successCallback: (result) => {
                item.id = +result
                this.node.add(item)
                callback()
            },
        })
    }

    protected getCreateItem(): ItemType {
        return this.node.buildBasedOnFields()
    }

    public submitEditItem(callback: Function = () => {}): void {
        const item = this.getEditItem()
        fetchUserZoneRpc({
            method: this.updateMethod,
            params: [item],
            successCallback: result => {
                this.node.update(item)
                callback
            }
        })
    }

    protected getEditItem(): ItemType {
        return this.node.buildBasedOnFields()
    }

    public getItemById(id: number): ItemType {
        return this.node.getItemById(id)
    }

    public deleteItem(id: number): void {
        fetchUserZoneRpc({
            method: this.deleteMethod,
            params: [id],
            successCallback: (result) => this.node.delete(id),
        })
    }
}