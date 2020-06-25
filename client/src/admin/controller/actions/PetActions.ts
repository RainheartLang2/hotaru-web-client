import EmployeeAppController from "../EmployeeAppController";
import {RightPanelType} from "../../state/enum/RightPanelType";
import {Pet} from "../../../common/beans/Pet";
import {DateUtils} from "../../../core/utils/DateUtils";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";

export default class PetActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public openAddPetForm(callback: Function = () => {}) {
        this.controller.loadInitData(() => {
            this.controller.setState({
                rightPanelType: RightPanelType.AddPet,
                editedPetId: undefined,
                editedPetName: "",
                editedPetBreed: null,
                editedPetSpecies: null,
                editedPetColor: null,
                editedPetSex: null,
                editedPetBirthDate: "",
                editedPetNote: "",
            })
            callback()
        })
    }

    public openEditPetForm(pet: Pet, callback: Function = () => {}) {
        this.controller.loadInitData(() => {
            const breed = pet.breedId ? this.controller.state.breedsListById.get(pet.breedId) : null
            const species = pet.speciesId ? this.controller.state.speciesListById.get(pet.speciesId!) : null
            this.controller.setState({
                rightPanelType: RightPanelType.EditPet,
                editedPetId: pet.id,
                editedPetName: pet.name,
                editedPetBreed: breed,
                editedPetSpecies: species,
                editedPetColor: pet.colorId ? this.controller.state.animalColorsById.get(pet.colorId) : null,
                editedPetSex: pet.petSex,
                editedPetBirthDate: pet.birthDate ? DateUtils.standardFormatDate(pet.birthDate) : "",
                editedPetNote: pet.note,
            })
        })
    }

    private buildPetByFields(): Pet {
        const state = this.controller.state
        return {
            id: state.editedPetId,
            ownerId: state.editedPetClientId!,
            name: state.editedPetNameField.value,
            speciesId: state.editedPetSpecies ? state.editedPetSpecies.id : undefined,
            breedId: state.editedPetBreed ? state.editedPetBreed.id : undefined,
            colorId: state.editedPetColor ? state.editedPetColor.id : undefined,
            petSex: state.editedPetSex,
            birthDate: state.editedPetBirthDateField.value ? new Date(state.editedPetBirthDateField.value) : null,
            note: state.editedPetNoteField.value,
        }
    }

    public addPet(): void {
        const pet = this.buildPetByFields()
        fetchUserZoneRpc({
            method: RemoteMethods.addPet,
            params: [pet],
            successCallback: result => {
                pet.id = +result
                this.controller.setState({
                    petList: [...this.controller.state.petList, pet]
                })
                this.controller.closeCurrentRightPanel()
            }
        })
    }

    public editPet(): void {
        const pet = this.buildPetByFields()
        fetchUserZoneRpc({
            method: RemoteMethods.updatePet,
            params: [pet],
            successCallback: result => {
                this.controller.setState({
                    petList: CollectionUtils.updateArray(this.controller.state.petList, pet, pet => pet.id)
                })
                this.controller.closeCurrentRightPanel()
            }
        })
    }

    public deletePet(id: number): void {
        fetchUserZoneRpc({
            method: RemoteMethods.deletePet,
            params: [id],
            successCallback: result => {
                this.controller.setState({
                    petList: this.controller.state.petList.filter(pet => pet.id != id)
                })
            }
        })
    }
}