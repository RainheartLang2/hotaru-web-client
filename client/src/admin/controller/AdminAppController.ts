import AdminApplicationState, {AdminStateProperty} from "../state/AdminApplicationState";
import {DialogType} from "../state/enum/DialogType";
import ApplicationController from "../../core/mvc/ApplicationController";
import EmployeeActions from "./actions/EmployeeActions";
import {fetchPreloginRpc, fetchUserZoneRpc} from "../../core/utils/HttpUtils";
import {RemoteMethods} from "../../common/backApplication/RemoteMethods";
import {Employee} from "../../common/beans/Employee";
import {PageType} from "../state/enum/PageType";
import ClinicActions from "./actions/ClinicActions";
import SpeciesActions from "./actions/SpeciesActions";

export default class AdminAppController extends ApplicationController<AdminApplicationState> {
    private static _instance: AdminAppController

    private _employeeActions: EmployeeActions
    private _clinicActions: ClinicActions
    private _speciesActions: SpeciesActions

    private constructor() {
        super(AdminApplicationState.instance)
        this._employeeActions = new EmployeeActions(this, this.applicationStore.employeeNode)
        this._clinicActions = new ClinicActions(this, this.applicationStore.clinicNode)
        this._speciesActions = new SpeciesActions(this, this.applicationStore.speciesNode)
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
        return this._employeeActions
    }

    get clinicActions(): ClinicActions {
        return this._clinicActions
    }

    get speciesActions(): SpeciesActions {
        return this._speciesActions
    }

    public startApplication(): void {
        this.applicationStore.setApplicationLoading(true)
        this.loadLoggedInUser(() => {
            this.openUserListPage(() => {
                this.getApplicationState().setApplicationLoading(false)
            })
        })
    }

    public openUserListPage(callback: Function = () => {}): void {
        this.applicationStore.setPageType(PageType.UserList)
        this._employeeActions.loadUsersList(() => {
            this._clinicActions.loadClinicList(() => {
                callback()
            })
        })
    }

    public openClinicListPage(callback: Function = () => {}): void {
        this.applicationStore.setPageType(PageType.ClinicList)
        this._clinicActions.loadClinicList(() => {
            callback()
        })
    }

    public openSchedulePage(): void {
        this.applicationStore.setPageType(PageType.Schedule)
    }

    public openSettings(): void {
        this.openSpeciesPage()
    }

    public openSpeciesPage(): void {
        this.applicationStore.setPageType(PageType.Species)
        this._speciesActions.loadList()
    }

    public setShowDialog(dialogType: DialogType): void {
        this.applicationStore.setPropertyValue(AdminStateProperty.DialogType, dialogType)
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
        this.applicationStore.setDialogType(DialogType.None)
    }

    protected getApplicationState(): AdminApplicationState {
        return AdminApplicationState.instance
    }
}