import CrudNode from "./CrudNode";
import ApplicationController from "../ApplicationController";
import {fetchUserZoneRpc} from "../../utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {plainToClass} from "class-transformer";
import {Clinic} from "../../../common/beans/Clinic";
import {AdminStateProperty} from "../../../admin/state/AdminApplicationState";
import {DialogType} from "../../../admin/state/DialogType";
import {RemoteMethod} from "../../http/RemoteMethod";
import Identitiable from "../../entities/Identitiable";

export default abstract class CrudAction<ItemType extends Identitiable, ControllerType extends ApplicationController> {
    private controller: ControllerType
    private node: CrudNode<ItemType>

    constructor(controller: ControllerType,
                node: CrudNode<ItemType>) {
        this.controller = controller
        this.node = node
    }

    protected abstract getAllLoadingProperty(): string

    protected abstract get getAllMethod(): RemoteMethod
    protected abstract get addMethod(): RemoteMethod
    protected abstract get updateMethod(): RemoteMethod
    protected abstract get deleteMethod(): RemoteMethod

    protected abstract convertResultToItem(result: any): ItemType[]

    public loadList(callback: Function): void {
        fetchUserZoneRpc({
            method: this.getAllMethod,
            successCallback: result => {
                this.node.setList(this.convertResultToItem(result))
                callback()
            },
            loadingProperty: this.getAllLoadingProperty(),
        })
    }

    public submitCreateItem(callback: Function): void {
        const item = this.node.buildBasedOnFields()
        fetchUserZoneRpc({
            method: RemoteMethods.addClinic,
            params: [item],
            successCallback: (result) => {
                item.setId(result)
                this.node.add(item)
                callback()
            },
        })
    }

    public submitEditItem(callback: Function): void {
        const item = this.node.buildBasedOnFields()
        fetchUserZoneRpc({
            method: this.updateMethod,
            params: [item],
            successCallback: result => {
                this.node.update(this.node.buildBasedOnFields())
                callback
            }
        })
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