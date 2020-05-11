import CrudAction from "../../../core/mvc/crud/CrudAction";
import AdminAppController from "../AdminAppController";
import BreedNode from "../../state/nodes/BreedNode";
import Breed from "../../../common/beans/Breed";
import {RemoteMethod} from "../../../core/http/RemoteMethod";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {plainToClass} from "class-transformer";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import Species from "../../../common/beans/Species";

export default class BreedActions extends CrudAction<Breed, AdminAppController, BreedNode> {
    protected get addMethod(): RemoteMethod {
        return RemoteMethods.addBreed;
    }

    protected convertResultToItem(result: any): Breed[] {
        return plainToClass(Breed, result) as unknown as Breed[]
    }

    protected get deleteMethod(): RemoteMethod {
        return RemoteMethods.deleteBreed;
    }

    protected get getAllMethod(): RemoteMethod {
        return RemoteMethods.getAllBreeds;
    }

    protected get updateMethod(): RemoteMethod {
        return RemoteMethods.editBreed;
    }

    public setEditedBreedId(id?: number): void {
        this.controller.setPropertyValue(AdminStateProperty.EditedBreedId, id)
    }

    public setEditedBreedName(name: string): void {
        this.controller.setPropertyValue(AdminStateProperty.EditedBreedName, name)
    }

    public setCurrentSpecies(species: Species): void {
        this.controller.setPropertyValue(AdminStateProperty.BreedPageSelectedSpecies, species)
    }

    protected getCreateItem(): Breed {
        return {
            name: this.node.getAddedBreedName(),
            speciesId: this.node.getSelectedSpecies().id,
        }
    }

    public submitCreateItem(callback: Function = () => {}): void {
        super.submitCreateItem(() => {
            this.controller.setFieldValue(AdminStateProperty.AddedBreedName, "")
            this.controller.toggleFieldValidation(AdminStateProperty.AddedBreedName, false)
            callback()
        })
    }
}