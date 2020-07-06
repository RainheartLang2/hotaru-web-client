import EmployeeAppController from "../EmployeeAppController";
import CounterAgent from "../../../common/beans/CounterAgent";

export default class CounterAgentsActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public openCreateDialog(callback: Function = () => {}): void {
        callback()
    }

    public openEditDialog(agent: CounterAgent, callback: Function = () => {}): void {
        callback()
    }
}