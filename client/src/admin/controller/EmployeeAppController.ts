import ApplicationController from "../../core/mvc/controllers/ApplicationController";
import EmployeeApplicationStore, {EmployeeAppSelectors, EmployeeAppState} from "../state/EmployeeApplicationStore";
import {PageType} from "../state/enum/PageType";
import {DialogType} from "../state/enum/DialogType";
import {fetchPreloginRpc, fetchUserZoneRpc} from "../../core/utils/HttpUtils";
import {RemoteMethods} from "../../common/backApplication/RemoteMethods";
import {Employee} from "../../common/beans/Employee";
import EmployeeActions from "./actions/EmployeeActions";
import AdminApplicationCacheManager from "./AdminApplicationCacheManager";
import CacheManager from "./AdminApplicationCacheManager";
import ClinicActions from "./actions/ClinicActions";
import SpeciesActions from "./actions/SpeciesActions";
import BreedActions from "./actions/BreedActions";
import ScheduleActions from "./actions/ScheduleActions";
import ClientActions from "./actions/ClientActions";

export default class EmployeeAppController extends ApplicationController<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore> {
    private static _instance: EmployeeAppController
    private _employeeActions: EmployeeActions
    private _clinicActions: ClinicActions
    private _speciesActions: SpeciesActions
    private _breedActions: BreedActions
    private _scheduleActions: ScheduleActions
    private _clientActions: ClientActions

    private _cacheManager: AdminApplicationCacheManager

    private constructor() {
        super(EmployeeApplicationStore.instance)
        this._employeeActions = new EmployeeActions(this)
        this._clinicActions = new ClinicActions(this)
        this._speciesActions = new SpeciesActions(this)
        this._breedActions = new BreedActions(this)
        this._scheduleActions = new ScheduleActions(this)
        this._clientActions = new ClientActions(this)

        this._cacheManager = new AdminApplicationCacheManager(this, this.store)
    }

    public static get instance(): EmployeeAppController {
        if (!EmployeeAppController._instance) {
            EmployeeAppController._instance = new EmployeeAppController()
        }
        return EmployeeAppController._instance
    }

    public get employeeActions(): EmployeeActions {
        return this._employeeActions
    }

    public get clinicActions(): ClinicActions {
        return this._clinicActions
    }

    public get speciesActions(): SpeciesActions {
        return this._speciesActions
    }

    public get breedActions(): BreedActions {
        return this._breedActions
    }

    public get scheduleActions(): ScheduleActions {
        return this._scheduleActions
    }

    public get clientActions(): ClientActions {
        return this._clientActions
    }

    public get cacheManager(): CacheManager {
        return this._cacheManager
    }

    private loadLoggedInUser(callback: () => void): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getUserProfile,
            successCallback: result => {
                this.store.setState({loggedInEmployee: result})
                callback()
            },
        })
    }

    public startApplication(): void {
        this.store.setState({isApplicationLoading: true})
        this.loadLoggedInUser(() => {
            this.openUserListPage(() => {
                this.store.setState({isApplicationLoading: false})
            })
        })
    }

    protected openPage(pageType: PageType, loadingFunction: (f: Function) => void) {
        this.store.setState({
            pageType: pageType,
            isPageLoading: true,
        })
        this.onErrorFireEvent((callback: Function) => {
                loadingFunction(() => {
                    this.store.setState({isPageLoading: false})
                    callback()
                })
            },
            () => {
                this.store.setState({isPageLoading: false})
            }
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
                this.setState({
                    selectedEmployeeForSchedulePage: employees.length > 0 ? employees[0] : undefined
                })
                this._speciesActions.loadList([], () => {
                    this._breedActions.loadList([], () => {
                        this._scheduleActions.loadAppointmentsWithClients(() => setPageLoad())
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

    public openClientsPage(): void {
        this.openPage(PageType.Clients, (setPageLoad: Function) => {
            this._clientActions.loadPermanentClientsWithPets(() => {
                setPageLoad()
            })
        })
    }

    public setShowDialog(dialogType: DialogType): void {
        this.store.setState({dialogType})
    }

    public logout(): void {
        fetchPreloginRpc({
            method: RemoteMethods.employeeLogout,
            successCallback: result => {
                this.handleUnauthorizedUserSituation()
            },
        })
    }

    public setLoggedInUser(employee: Employee): void {
        this.store.setState({loggedInEmployee: employee})
    }

    public closeCurrentDialog(): void {
        this.store.setState({dialogType: DialogType.None})
    }

    handleUnauthorizedUserSituation(): void {
        window.location.href = "login"
    }

    getDialogSubmitButtonPropertyName(): keyof EmployeeAppState {
        return "isDialogSubmitButtonLoading";
    }
}