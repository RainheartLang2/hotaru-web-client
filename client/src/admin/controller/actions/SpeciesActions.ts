import Species from "../../../common/beans/Species";
import EmployeeAppController from "../EmployeeAppController";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";

export default class SpeciesActions {

    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public setEditedSpeciesId(id?: number) {
        this.controller.setState({editedSpeciesId: id})
    }

    public setEditedSpeciesName(name: string) {
        this.controller.setState({editedSpeciesName: name})
    }

    private getSpeciesById(id: number): Species {
        const result = this.controller.state.speciesListById.get(id)
        if (!result) {
            throw new Error("species with id " + id + " not exists")
        }
        return result
    }

    public setSelectedSpecies(speciesId?: number): void {
        let selectedSpecies
        if (!speciesId) {
            const speciesList = this.controller.state.speciesList
            if (speciesList.length > 0) {
                selectedSpecies = speciesList[0]
            }
        } else {
            selectedSpecies = this.getSpeciesById(speciesId)
        }
        this.controller.setState({
            breedPageSelectedSpecies: selectedSpecies
        })
    }

    public loadList(params: any[] = [], callback: Function = () => {}): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllSpecies,
            params: params,
            successCallback: result => {
                this.controller.setState({
                    speciesList: result
                })
                callback(result)
            },
        })
    }

    public submitCreateItem(callback: Function = () => {}): void {
        const item: Species = {
            name: this.controller.state.addedSpeciesName
        }
        fetchUserZoneRpc({
            method: RemoteMethods.addSpecies,
            params: [item],
            successCallback: (result) => {
                item.id = +result
                this.controller.setState({
                    speciesList: [...this.controller.state.speciesList, item],
                    addedSpeciesName: "",
                })
                callback()
            },
        })
    }

    public submitEditItem(callback: Function = () => {}): void {
        const item: Species = {
            id: this.controller.state.editedSpeciesId,
            name: this.controller.state.editedSpeciesName,
        }
        fetchUserZoneRpc({
            method: RemoteMethods.editSpecies,
            params: [item],
            successCallback: result => {
                this.controller.setState({
                    speciesList: CollectionUtils.updateArray(this.controller.state.speciesList, item, species => species.id)
                })
                callback
            }
        })
    }

    public deleteSpecies(id: number): void {
        fetchUserZoneRpc({
            method: RemoteMethods.deleteSpecies,
            params: [id],
            successCallback: (result) => this.controller.setState({
                speciesList: this.controller.state.speciesList.filter(species => species.id != id)
            }),
        })
    }
}