import CrudNode from "./CrudNode";
import ApplicationController from "../ApplicationController";
import {fetchUserZoneRpc} from "../../utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {RemoteMethod} from "../../http/RemoteMethod";
import Identifiable from "../../entities/Identifiable";
import ReadActions from "../read/ReadActions";

export default abstract class CrudAction<ItemType extends Identifiable,
        ControllerType extends ApplicationController,
        NodeType extends CrudNode<ItemType>>
    extends ReadActions<ItemType, ControllerType, NodeType> {

    constructor(controller: ControllerType,
                node: NodeType) {
        super(controller, node)
    }

    protected abstract get addMethod(): RemoteMethod
    protected abstract get updateMethod(): RemoteMethod
    protected abstract get deleteMethod(): RemoteMethod

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

    public deleteItem(id: number): void {
        fetchUserZoneRpc({
            method: this.deleteMethod,
            params: [id],
            successCallback: (result) => this.node.delete(id),
        })
    }
}