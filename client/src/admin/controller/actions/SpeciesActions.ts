import CrudAction from "../../../core/mvc/crud/CrudAction";
import AdminAppController from "../AdminAppController";
import Species from "../../../common/beans/Species";
import {RemoteMethod} from "../../../core/http/RemoteMethod";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import {plainToClass} from "class-transformer";
import SpeciesNode from "../../state/nodes/SpeciesNode";

export default class SpeciesActions extends CrudAction<Species, AdminAppController, SpeciesNode> {

    protected get addMethod(): RemoteMethod {
        return RemoteMethods.addSpecies
    }

    protected convertResultToItem(result: any): Species[] {
        return plainToClass(Species, result) as unknown as Species[];
    }

    protected get deleteMethod(): RemoteMethod {
        return RemoteMethods.deleteSpecies
    }

    protected getAllLoadingProperty(): string {
        return AdminStateProperty.IsPageLoading
    }

    protected get getAllMethod(): RemoteMethod {
        return RemoteMethods.getAllSpecies
    }

    protected get updateMethod(): RemoteMethod {
        return RemoteMethods.editSpecies
    }

    public setEditedSpeciesId(id?: number) {
        this.controller.setPropertyValue(AdminStateProperty.EditedSpeciesId, id)
    }

    public setEditedSpeciesName(name: string) {
        this.controller.setPropertyValue(AdminStateProperty.EditedSpeciesName, name)
    }

    protected getCreateItem(): Species {
        return {
            name: this.node.getAddedSpeciesName()
        }
    }
}