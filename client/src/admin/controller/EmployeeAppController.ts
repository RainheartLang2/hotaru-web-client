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
import DictionariesActions from "./actions/DictionariesActions";
import ClinicsWorkScheduleActions from "./actions/ClinicsWorkScheduleActions";
import EmployeeWorkScheduleActions from "./actions/EmployeeWorkScheduleActions";
import PetActions from "./actions/PetActions";
import {RightPanelType} from "../state/enum/RightPanelType";
import PlannedCallActions from "./actions/PlannedCallActions";

export default class EmployeeAppController extends ApplicationController<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore> {
    private static _instance: EmployeeAppController
    private _employeeActions: EmployeeActions
    private _clinicActions: ClinicActions
    private _speciesActions: SpeciesActions
    private _breedActions: BreedActions
    private _scheduleActions: ScheduleActions
    private _clientActions: ClientActions
    private _dictionariesActions: DictionariesActions
    private _clinicsWorksScheduleActions: ClinicsWorkScheduleActions
    private _employeeScheduleActions: EmployeeWorkScheduleActions
    private _petActions: PetActions
    private _plannedCallActions: PlannedCallActions
    private _cacheManager: AdminApplicationCacheManager

    private constructor() {
        super(EmployeeApplicationStore.instance)
        this._employeeActions = new EmployeeActions(this)
        this._clinicActions = new ClinicActions(this)
        this._speciesActions = new SpeciesActions(this)
        this._breedActions = new BreedActions(this)
        this._scheduleActions = new ScheduleActions(this)
        this._clientActions = new ClientActions(this)
        this._dictionariesActions = new DictionariesActions(this)
        this._clinicsWorksScheduleActions = new ClinicsWorkScheduleActions(this)
        this._employeeScheduleActions = new EmployeeWorkScheduleActions(this)
        this._petActions = new PetActions(this)
        this._plannedCallActions = new PlannedCallActions(this)

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

    public get clinicsWorkScheduleActions(): ClinicsWorkScheduleActions {
        return this._clinicsWorksScheduleActions
    }

    public get employeeScheduleActions(): EmployeeWorkScheduleActions {
        return this._employeeScheduleActions
    }

    public get dictionariesActions(): DictionariesActions {
        return this._dictionariesActions
    }

    public get petActions(): PetActions {
        return this._petActions
    }

    get plannedCallActions(): PlannedCallActions {
        return this._plannedCallActions;
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
            this.openClientsPage(() => {
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

    public openSchedulePage(callback: Function = () => {}): void {
        this.openPage(PageType.Schedule, (setPageLoad: Function) => {
            this._employeeActions.loadUsersList((employees) => {
                this.setState({
                    selectedEmployeeForSchedulePage: employees.length > 0 ? employees[0] : undefined
                })
                this._speciesActions.loadList([], () => {
                    this._breedActions.loadList([], () => {
                        this._scheduleActions.loadAppointmentsWithClients(() => {
                            this._employeeScheduleActions.loadEmployeeSchedule(
                                this.state.selectedEmployeeForSchedulePage!.id!,
                                this.state.schedulePageDate,
                                () => setPageLoad())
                        })
                        callback()
                    })
                })
            })
        })
    }

    public openGlobalSettings(): void {

    }

    public openLocalePage(): void {

    }

    public openAccessPage(): void {

    }

    public openClinicsManagement(): void {
        this.openClinicListPage()
    }

    public openClinicsWorkschedule(): void {
        this.openPage(PageType.ClinicsWorkschedule, (setPageLoad: Function) => {
            this._clinicsWorksScheduleActions.loadWorkSchedule(setPageLoad)
        })
    }

    public openEmployeeWorkSchedule(): void {
        this.openPage(PageType.EmployeesWorkSchedule, (setPageLoad: Function) => {
            this._employeeScheduleActions.loadWorkSchedule(setPageLoad)
        } )
    }

    public openDictionaries(): void {
        this.openSpeciesPage()
    }

    public openMeasureUnitsPage(): void {
        this.openPage(PageType.MeasureUnits, (setPageLoad: Function) => {
            this._dictionariesActions.loadMeasureUnits([], setPageLoad)
        })
    }

    public openVisitResultPage(): void {
        this.openPage(PageType.VisitResult,(setPageLoad: Function) => {
            this._dictionariesActions.loadVisitResult(setPageLoad)
        })
    }

    public openVisitPurposePage(): void {
        this.openPage(PageType.VisitPurpose, (setPageLoad: Function) => {
            this._dictionariesActions.loadVisitPurposes(setPageLoad)
        })
    }

    public openDiagnosisPage(): void {
        this.openPage(PageType.Diagnosis, (setPageLoad: Function) => {
            this._dictionariesActions.loadDiagnosisList(setPageLoad)
        })
    }

    public openAnimalColorsPage(): void {
        this.openPage(PageType.AnimalColors, (setPageLoad: Function) => {
            this._dictionariesActions.loadAnimalColorsList(setPageLoad)
        })
    }

    public openSpeciesPage(): void {
        this.openPage(PageType.Species, (setPageLoad: Function) => {
            this._speciesActions.loadList([], setPageLoad)
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

    public openClientsPage(callback: Function = () => {}): void {
        this.loadClientsInitData(() => {
            this.openPage(PageType.Clients, (setPageLoad: Function) => {
                this._clientActions.loadPermanentClientsWithPets(() => {
                    setPageLoad()
                    callback()
                })
            })
        })
    }

    public loadClientsInitData(callback: Function = () => {}) {
        this.speciesActions.loadList([], () => {
            this.breedActions.loadList([], () => {
                this.dictionariesActions.loadAnimalColorsList(() => {
                    callback()
                })
            })
        })
    }

    public openCallsPage(callback: Function = () => {}): void {
        this.openPage(PageType.PlannedCalls, (setPageLoad: Function) => {
            this.clinicActions.loadClinicList(() => {
                this.employeeActions.loadUsersList(() => {
                    this.clientActions.loadPermanentClientsWithPets(() => {
                        this.plannedCallActions.loadList(() => {
                            setPageLoad()
                            callback()
                        })
                    })
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

    public closeCurrentRightPanel(): void {
        this.store.setState({rightPanelType: RightPanelType.None})
    }

    handleUnauthorizedUserSituation(): void {
        window.location.href = "login"
    }

    getDialogSubmitButtonPropertyName(): keyof EmployeeAppState {
        return "isDialogSubmitButtonLoading";
    }
}