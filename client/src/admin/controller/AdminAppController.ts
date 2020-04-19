import AdminApplicationState, {
} from "../state/AdminApplicationState";
import {DialogType} from "../state/DialogType";
import ApplicationController from "../../core/mvc/ApplicationController";
import EmployeeActions from "./actions/EmployeeActions";

export default class AdminAppController extends ApplicationController<AdminApplicationState> {
    private static _instance: AdminAppController

    private _employeeActions: EmployeeActions

    private constructor() {
        super(AdminApplicationState.instance)
        this._employeeActions = new EmployeeActions(this, this.errorHandler, this.applicationStore.employeeNode)
    }

    public static get instance(): AdminAppController {
        if (!AdminAppController._instance) {
            AdminAppController._instance = new AdminAppController()
        }
        return AdminAppController._instance
    }

    get employeeActions(): EmployeeActions {
        return this._employeeActions;
    }

    public startApplication(): void {
        this.applicationStore.setApplicationLoading(true)
        this._employeeActions.loadUsersList(() => this.getApplicationState().setApplicationLoading(false))
    }

    public closeCurrentDialog(): void {
        this.applicationStore.setShowDialog(DialogType.None)
    }

    protected getApplicationState(): AdminApplicationState {
        return AdminApplicationState.instance
    }
}