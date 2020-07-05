import EmployeeAppController from "../EmployeeAppController";

export default class StockActions {

    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public loadList(callback: Function = () => {}): void {
        callback()
    }
}