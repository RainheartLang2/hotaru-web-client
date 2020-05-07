import ApplicationController from "../../../core/mvc/ApplicationController";
import PetNode from "../../state/nodes/PetNode";
import {Pet} from "../../../common/beans/Pet";

export default class PetActions {
    private controller: ApplicationController
    private node: PetNode

    constructor(controller: ApplicationController, node: PetNode) {
        this.controller = controller;
        this.node = node;
    }

    public setPets(pets: Pet[]) {
        this.node.setList(pets)
    }
}