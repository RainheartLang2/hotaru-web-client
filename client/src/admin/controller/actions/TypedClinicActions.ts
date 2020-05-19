import EmployeeAppController from "../EmployeeAppController";

export default class TypedClinicActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public loadClinicList(callback: Function): void {
        this.controller.cacheManager.clinicCache.execute(callback)
    }
}