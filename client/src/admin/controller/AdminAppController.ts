import AdminApplicationState, {
    AdminStateProperty
} from "../state/AdminApplicationState";
import {DialogType} from "../state/DialogType";
import ApplicationController from "../../core/mvc/ApplicationController";
import EmployeeActions from "./actions/EmployeeActions";
import {fetchPreloginRpc, fetchUserZoneRpc} from "../../core/utils/HttpUtils";
import {RemoteMethods} from "../../common/backApplication/RemoteMethods";
import {Employee} from "../../common/beans/Employee";

export default class AdminAppController extends ApplicationController<AdminApplicationState> {
    private static _instance: AdminAppController

    private _employeeActions: EmployeeActions

    private constructor() {
        super(AdminApplicationState.instance)
        this._employeeActions = new EmployeeActions(this, this.applicationStore.employeeNode)
    }

    public static get instance(): AdminAppController {
        if (!AdminAppController._instance) {
            AdminAppController._instance = new AdminAppController()
        }
        return AdminAppController._instance
    }

    private loadLoggedInUser(callback: () => void): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getUserProfile,
            successCallback: result => {
                this.applicationStore.setPropertyValue(AdminStateProperty.LoggedInEmployee, result)
                callback()
            },
        })
    }

    get employeeActions(): EmployeeActions {
        return this._employeeActions;
    }

    public startApplication(): void {
        this.applicationStore.setApplicationLoading(true)
        this._employeeActions.loadUsersList(() => {
            this.loadLoggedInUser(() => {
                this.getApplicationState().setApplicationLoading(false)
            })
        })
    }

    public logout(): void {
        fetchPreloginRpc({
            method: RemoteMethods.employeeLogout,
            successCallback: result => {
                window.location.href = "login"
            },
        })
    }

    public getLoggedInUser(): Employee {
        return this.applicationStore.getLoggedInUser()
    }

    public setLoggedInUser(employee: Employee): void {
        this.applicationStore.setLoggedInUser(employee)
    }

    public closeCurrentDialog(): void {
        this.applicationStore.setShowDialog(DialogType.None)
    }

    protected getApplicationState(): AdminApplicationState {
        return AdminApplicationState.instance
    }
}