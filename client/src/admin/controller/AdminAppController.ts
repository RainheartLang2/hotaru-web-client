import AdminApplicationState, {
} from "../state/AdminApplicationState";
import {DialogType} from "../state/DialogType";
import ApplicationController from "../../core/mvc/ApplicationController";
import EmployeeActions from "./actions/EmployeeActions";

export default class AdminAppController extends ApplicationController<AdminApplicationState> {
    private static INSTANCE: AdminAppController

    private _employeeActions: EmployeeActions

    private constructor() {
        super(AdminApplicationState.getInstance())
        this._employeeActions = new EmployeeActions(this, this.applicationStore)
    }

    public static getInstance(): AdminAppController {
        if (!AdminAppController.INSTANCE) {
            AdminAppController.INSTANCE = new AdminAppController()
        }
        return AdminAppController.INSTANCE
    }

    get employeeActions(): EmployeeActions {
        return this._employeeActions;
    }

    public subscribe(property: string, component: React.Component, propertyAlias: string = property) {
        this.applicationStore.subscribe(property, component, propertyAlias)
    }

    public startApplication(): void {
        this.applicationStore.setApplicationLoading(true)
        this._employeeActions.loadUsersList(() => this.getApplicationState().setApplicationLoading(false))
    }

    public closeCurrentDialog(): void {
        this.applicationStore.setShowDialog(DialogType.NONE)
    }

    protected getApplicationState(): AdminApplicationState {
        return AdminApplicationState.getInstance()
    }
}