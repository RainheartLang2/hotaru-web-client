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
import BreedActions from "./actions/BreedActions";
import AppointmentActions from "./actions/AppointmentActions";
import ClientActions from "./actions/ClientActions";
import PetActions from "./actions/PetActions";
import AdminApplicationCacheManager from "./AdminApplicationCacheManager";

export default class AdminAppController extends ApplicationController<AdminApplicationState> {
    private static _instance: AdminAppController

    private _cacheManager: AdminApplicationCacheManager

    private _employeeActions: EmployeeActions
    private _clinicActions: ClinicActions
    private _speciesActions: SpeciesActions
    private _breedActions: BreedActions
    private _appointmentActions: AppointmentActions
    private _clientActions: ClientActions
    private _petActions: PetActions

    private constructor() {
        super(AdminApplicationState.instance)
        this._employeeActions = new EmployeeActions(this, this.applicationStore.employeeNode)
        this._clinicActions = new ClinicActions(this, this.applicationStore.clinicNode)
        this._speciesActions = new SpeciesActions(this, this.applicationStore.speciesNode)
        this._breedActions = new BreedActions(this, this.applicationStore.breedNode)
        this._appointmentActions = new AppointmentActions(this, this.applicationStore.appointmentNode)
        this._clientActions = new ClientActions(this, this.applicationStore.clientNode)
        this._petActions = new PetActions(this, this.applicationStore.petNode)

        this._cacheManager = new AdminApplicationCacheManager(this, this.applicationStore)
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

    get breedActions(): BreedActions {
        return this._breedActions
    }

    get appointmentActions(): AppointmentActions {
        return this._appointmentActions
    }

    get clientActions(): ClientActions {
        return this._clientActions
    }

    get petActions(): PetActions {
        return this._petActions
    }

    get cacheManager(): AdminApplicationCacheManager {
        return this._cacheManager;
    }

    public startApplication(): void {
        this.applicationStore.setApplicationLoading(true)
        this.loadLoggedInUser(() => {
            this.openUserListPage(() => {
                this.getApplicationState().setApplicationLoading(false)
            })
        })
    }

    protected openPage(pageType: PageType, loadingFunction: (f: Function) => void) {
        this.applicationStore.setPageType(pageType)
        this.applicationStore.setPageLoading(true)
        this.onErrorFireEvent((callback: Function) => {
            loadingFunction(() => {
                this.applicationStore.setPageLoading(false)
                callback()
            })
        },
            () => this.applicationStore.setPageLoading(false)
        )
    }

    public openUserListPage(callback: Function = () => {}): void {
        this.openPage(PageType.UserList, (setPageLoad: Function) => {
            this._employeeActions.loadUsersList(() => {
                this._clinicActions.loadClinicList(() => {
                    callback()
                    setPageLoad()
                })
            })
        })
    }

    public openClinicListPage(callback: Function = () => {}): void {
       this.openPage(PageType.ClinicList, (setPageLoad: Function) => {
           this._clinicActions.loadClinicList(() => {
               callback()
               setPageLoad()
           })
       })
    }

    public openSchedulePage(): void {
        this.openPage(PageType.Schedule, (setPageLoad: Function) => {
            this._employeeActions.loadUsersList((employees) => {
                this.setPropertyValue(AdminStateProperty.SelectedEmployeeForSchedulePage, employees.length > 0 ? employees[0] : null)
                this._speciesActions.loadList([], () => {
                    this._breedActions.loadList([], () => {
                        this._appointmentActions.loadAppointmentsWithClients(() => setPageLoad())
                    })
                })
            })
        })
    }

    public openSettings(): void {
        this.openSpeciesPage()
    }

    public openSpeciesPage(): void {
        this.openPage(PageType.Species, (setPageLoad: Function) => {
            this._speciesActions.loadList([], () => setPageLoad())
        })
    }

    public openBreedsPage(speciesId?: number): void {
        this.openPage(PageType.Breeds, (setPageLoad: Function) => {
            this._speciesActions.loadList([], () => {
                this._breedActions.loadList([], () => {
                    this._speciesActions.setSelectedSpecies(speciesId)
                    setPageLoad()
                })
            })
        })
    }

    public setShowDialog(dialogType: DialogType): void {
        this.applicationStore.setPropertyValue(AdminStateProperty.DialogType, dialogType)
    }

    public logout(): void {
        fetchPreloginRpc({
            method: RemoteMethods.employeeLogout,
            successCallback: result => {
                this.handleUnauthorizedUserSituation()
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

    handleUnauthorizedUserSituation(): void {
        window.location.href = "login"
    }

    getDialogSubmitButtonPropertyName(): string {
        return AdminStateProperty.IsDialogSubmitButtonLoading;
    }
}