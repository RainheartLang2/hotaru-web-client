import EmployeeAppController from "../EmployeeAppController";
import {RightPanelType} from "../../state/enum/RightPanelType";

export default class PetActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public openAddPetForm(callback: Function = () => {}) {
        this.controller.speciesActions.loadList([], () => {
            this.controller.setState({
                rightPanelType: RightPanelType.Pet,
            })
        })
    }
}