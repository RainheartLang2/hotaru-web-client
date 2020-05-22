import EmployeeAppController from "../EmployeeAppController";
import Species from "../../../common/beans/Species";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import Breed from "../../../common/beans/Breed";

export default class BreedActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    private getBreedById(id: number): Breed {
        const result = this.controller.state.breedsListById.get(id)
        if (!result) {
            throw new Error("breed with id " + id + " not exists")
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
            selectedSpecies = this.getBreedById(speciesId)
        }
        this.controller.setState({
            breedPageSelectedSpecies: selectedSpecies
        })
    }

    public loadList(params: any[] = [], callback: Function = () => {}): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllBreeds,
            params: params,
            successCallback: result => {
                this.controller.setState({
                    breedsList: result
                })
                callback(result)
            },
        })
    }

    public submitCreateItem(callback: Function = () => {}): void {
        const item: Breed = {
            name: this.controller.state.addedBreedName,
            speciesId: this.controller.state.breedPageSelectedSpecies.id,
        }
        fetchUserZoneRpc({
            method: RemoteMethods.addBreed,
            params: [item],
            successCallback: (result) => {
                item.id = +result
                this.controller.setState({
                    breedsList: [...this.controller.state.breedsList, item],
                    addedBreedName: "",
                })
                callback()
            },
        })
    }

    public submitEditItem(callback: Function = () => {}): void {
        const item: Breed = {
            id: this.controller.state.editedSpeciesId,
            name: this.controller.state.editedSpeciesName,
            speciesId: this.controller.state.breedPageSelectedSpecies.id,
        }
        fetchUserZoneRpc({
            method: RemoteMethods.editBreed,
            params: [item],
            successCallback: result => {
                this.controller.setState({
                    breedsList: CollectionUtils.updateArray(this.controller.state.breedsList, item, breed => breed.id)
                })
                callback
            }
        })
    }

    public deleteBreed(id: number): void {
        fetchUserZoneRpc({
            method: RemoteMethods.deleteBreed,
            params: [id],
            successCallback: (result) => this.controller.setState({
                breedsList: this.controller.state.breedsList.filter(breed => breed.id != id)
            }),
        })
    }
}