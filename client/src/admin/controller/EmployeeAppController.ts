import TypedApplicationController from "../../core/mvc/controllers/TypedApplicationController";
import EmployeeApplicationStore, {EmployeeAppSelectors, EmployeeAppState} from "../state/EmployeeApplicationStore";
import {PageType} from "../state/enum/PageType";
import {DialogType} from "../state/enum/DialogType";
import {fetchPreloginRpc, fetchUserZoneRpc} from "../../core/utils/HttpUtils";
import {RemoteMethods} from "../../common/backApplication/RemoteMethods";
import {Employee} from "../../common/beans/Employee";
import TypedEmployeeActions from "./actions/TypedEmployeeActions";
import AdminApplicationCacheManager from "./AdminApplicationCacheManager";
import CacheManager from "./AdminApplicationCacheManager";
import TypedClinicActions from "./actions/TypedClinicActions";
import TypedSpeciesActions from "./actions/TypedSpeciesActions";
import TypedBreedActions from "./actions/TypedBreedActions";

export default class EmployeeAppController extends TypedApplicationController<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore> {
    private static _instance: EmployeeAppController
    private _employeeActions: TypedEmployeeActions
    private _clinicActions: TypedClinicActions
    private _speciesActions: TypedSpeciesActions
    private _breedActions: TypedBreedActions

    private _cacheManager: AdminApplicationCacheManager

    private constructor() {
        super(EmployeeApplicationStore.instance)
        this._employeeActions = new TypedEmployeeActions(this)
        this._clinicActions = new TypedClinicActions(this)
        this._speciesActions = new TypedSpeciesActions(this)
        this._breedActions = new TypedBreedActions(this)

        this._cacheManager = new AdminApplicationCacheManager(this, this.store)
    }

    public static get instance(): EmployeeAppController {
        if (!EmployeeAppController._instance) {
            EmployeeAppController._instance = new EmployeeAppController()
        }
        return EmployeeAppController._instance
    }

    public get employeeActions(): TypedEmployeeActions {
        return this._employeeActions
    }

    public get clinicActions(): TypedClinicActions {
        return this._clinicActions
    }

    public get speciesActions(): TypedSpeciesActions {
        return this._speciesActions
    }

    public get breedActions(): TypedBreedActions {
        return this._breedActions
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
            () => this.store.setState({isPageLoading: false})
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
    //     this.openPage(PageType.Schedule, (setPageLoad: Function) => {
    //         this._employeeActions.loadUsersList((employees) => {
    //             this.setPropertyValue(AdminStateProperty.SelectedEmployeeForSchedulePage, employees.length > 0 ? employees[0] : null)
    //             this._speciesActions.loadList([], () => {
    //                 this._breedActions.loadList([], () => {
    //                     this._appointmentActions.loadAppointmentsWithClients(() => setPageLoad())
    //                 })
    //             })
    //         })
    //     })
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