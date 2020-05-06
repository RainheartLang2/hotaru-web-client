import Identifiable from "../../entities/Identifiable";
import ApplicationController from "../ApplicationController";
import CrudNode from "../crud/CrudNode";
import {RemoteMethod} from "../../http/RemoteMethod";
import {fetchUserZoneRpc} from "../../utils/HttpUtils";
import ReadNode from "./ReadNode";

export default abstract class ReadActions<ItemType extends Identifiable,
    ControllerType extends ApplicationController,
    NodeType extends ReadNode<ItemType>
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

    protected abstract convertResultToItem(result: any): ItemType[]

    public loadList(params: any[] = [], callback: Function = () => {}): void {
        fetchUserZoneRpc({
            method: this.getAllMethod,
            params: params,
            successCallback: result => {
                this.node.setList(this.convertResultToItem(result))
                callback(result)
            },
            loadingProperty: this.getAllLoadingProperty(),
        })
    }

    public getItemById(id: number): ItemType {
        return this.node.getItemById(id)
    }
}