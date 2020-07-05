import ApplicationStore, {DefaultStateType, SelectorsInfo} from "../../core/mvc/store/ApplicationStore";
import {Employee} from "../../common/beans/Employee";
import {NavigationMenuItemType} from "./enum/NavigationMenuItemType";
import {SecondLevelNavigationMenuType} from "./enum/SecondLevelNavigationMenuType";
import {DictionaryMenuItemType} from "./enum/DictionaryMenuItemType";
import {PageType} from "./enum/PageType";
import {DialogType} from "./enum/DialogType";
import EmployeeNode, {UserPageEmployeeState, UserSelectors} from "./nodes/EmployeeNode";
import {CommonUtils} from "../../core/utils/CommonUtils";
import ClinicNode, {ClinicPageState, ClinicSelectors} from "./nodes/ClinicNode";
import SpeciesNode, {SpeciesPageSelector, SpeciesPageState} from "./nodes/SpeciesNode";
import BreedNode, {BreedsPageSelector, BreedsPageState} from "./nodes/BreedNode";
import ScheduleNode, {ScheduleSelectors, ScheduleState} from "./nodes/ScheduleNode";
import PetNode, {PetSelectors, PetState} from "./nodes/PetNode";
import ClientNode, {ClientSelectors, ClientState} from "./nodes/ClientNode";
import DictionaryNode, {DictionariesPageSelectors, DictionariesPagesState} from "./nodes/DictionaryNode";
import {ClinicsManagementMenuItemType} from "./enum/ClinicsManagementMenuItemType";
import ClinicsWorkScheduleNode, {
    ClinicsWorkScheduleSelectors,
    ClinicsWorkScheduleState
} from "./nodes/ClinicsWorkScheduleNode";
import {EmployeeManagementMenuItemType} from "./enum/EmployeeManagementMenuItemType";
import EmployeeWorkScheduleNode, {
    EmployeeScheduleSelectors,
    EmployeeWorkScheduleState
} from "./nodes/EmployeeWorkScheduleNode";
import {RightPanelType} from "./enum/RightPanelType";
import {Sex} from "../../common/beans/enums/Sex";
import PlannedCallNode, {PlannedCallSelectors, PlannedCallState} from "./nodes/PlannedCallNode";
import StateChangeContext from "../../core/mvc/store/StateChangeContext";
import {AccountingMenuItemType} from "./enum/AccountingMenuItemType";
import SalesUnitNode, {SalesUnitSelectors, SalesUnitState} from "./nodes/SalesUnitNode";
import mergeTypes = CommonUtils.mergeTypes;
import StockNode, {StockSelectors, StockState} from "./nodes/StocksNode";

export default class EmployeeApplicationStore extends ApplicationStore<EmployeeAppState, EmployeeAppSelectors> {

    private static _instance: EmployeeApplicationStore

    private employeeNode!: EmployeeNode
    private clinicNode!: ClinicNode
    private speciesNode!: SpeciesNode
    private breedNode!: BreedNode
    private scheduleNode!: ScheduleNode
    private petNode!: PetNode
    private clientNode!: ClientNode
    private dictionariesNode!: DictionaryNode
    private clinicsWorkScheduleNode!: ClinicsWorkScheduleNode
    private employeesWorkScheduleNode!: EmployeeWorkScheduleNode
    private plannedCallsNode!: PlannedCallNode
    private salesUnitNode!: SalesUnitNode
    private stockNode!: StockNode

    constructor() {
        super()
        const friend = this.createFriend()
        this.employeeNode = new EmployeeNode(friend)
        this.clinicNode = new ClinicNode(friend)
        this.speciesNode = new SpeciesNode(friend)
        this.breedNode = new BreedNode(friend)
        this.scheduleNode = new ScheduleNode(friend)
        this.petNode = new PetNode(friend)
        this.clientNode = new ClientNode(friend)
        this.dictionariesNode = new DictionaryNode(friend)
        this.clinicsWorkScheduleNode = new ClinicsWorkScheduleNode(friend)
        this.employeesWorkScheduleNode = new EmployeeWorkScheduleNode(friend)
        this.plannedCallsNode = new PlannedCallNode(friend)
        this.salesUnitNode = new SalesUnitNode(friend)
        this.stockNode = new StockNode(friend)
        this.initialize()
    }

    public static get instance(): EmployeeApplicationStore {
        if (!EmployeeApplicationStore._instance) {
            EmployeeApplicationStore._instance = new EmployeeApplicationStore()
        }
        return EmployeeApplicationStore._instance
    }


    private createCommonDefaultState(): CommonEmployeeState {

        return {
            isApplicationLoading: true,
            isPageLoading: false,
            isDialogLoading: false,
            isDialogSubmitButtonLoading: false,
            loggedInEmployee: null,
            pageType: PageType.None,
            dialogType: DialogType.None,
            rightPanelType: RightPanelType.None,
            globalError: null,
            sexesMapForSelect: Sex.createMapForSelect(),
        }
    }

    private createCommonDerivations(): SelectorsInfo<EmployeeAppState, CommonEmployeeSelectors> {
        return {
            showDialog: {
                dependsOn: ["dialogType", "isDialogLoading"],
                get: (state: Pick<EmployeeAppState, "dialogType" | "isDialogLoading">) => state.isDialogLoading || state.dialogType != DialogType.None,
                value: false,
            },
            navigationMenuItemType: {
                dependsOn: ["pageType"],
                get: (state: Pick<EmployeeAppState, "pageType">) => this.calcNavigationMenuItemType(state.pageType),
                value: NavigationMenuItemType.None,
            },
            secondLevelNavigationMenuType: {
                dependsOn: ["pageType"],
                get: (state: Pick<EmployeeAppState, "pageType">) => this.calcSecondLevelNavigationMenuItemType(state.pageType),
                value: SecondLevelNavigationMenuType.None,
            },
            secondLevelNavigationSelectedItem: {
                dependsOn: ["pageType"],
                get: (state: Pick<EmployeeAppState, "pageType">) => this.calcSecondLevelNavigationSelectedItem(this.state.pageType),
                value: DictionaryMenuItemType.None,
            },
            showSecondLevelNavigationMenu: {
                dependsOn: ["secondLevelNavigationMenuType"],
                get: (state: Pick<CommonEmployeeSelectors, "secondLevelNavigationMenuType">) =>
                    state.secondLevelNavigationMenuType != SecondLevelNavigationMenuType.None,
                value: false,
            }
        }
    }

    protected getDefaultState(): EmployeeAppState {
        let state = mergeTypes(this.createCommonDefaultState(), this.createDefaultStateTypeEntry())
        state = mergeTypes(state, this.employeeNode.getDefaultState())
        state = mergeTypes(state, this.clinicNode.getDefaultState())
        state = mergeTypes(state, this.speciesNode.getDefaultState())
        state = mergeTypes(state, this.breedNode.getDefaultState())
        state = mergeTypes(state, this.scheduleNode.getDefaultState())
        state = mergeTypes(state, this.petNode.getDefaultState())
        state = mergeTypes(state, this.clientNode.getDefaultState())
        state = mergeTypes(state, this.dictionariesNode.getDefaultState())
        state = mergeTypes(state, this.clinicsWorkScheduleNode.getDefaultState())
        state = mergeTypes(state, this.employeesWorkScheduleNode.getDefaultState())
        state = mergeTypes(state, this.plannedCallsNode.getDefaultState())
        state = mergeTypes(state, this.salesUnitNode.getDefaultState())
        state = mergeTypes(state, this.stockNode.getDefaultState())
        return state as EmployeeAppState
    }

    protected getSelectors(): SelectorsInfo<EmployeeAppState, EmployeeAppSelectors> {
        let selectors = mergeTypes(this.createCommonDerivations(), this.employeeNode.getDerivation())
        selectors = mergeTypes(selectors, this.clinicNode.getSelectors())
        selectors = mergeTypes(selectors, this.speciesNode.getSelectors())
        selectors = mergeTypes(selectors, this.breedNode.getSelectors())
        selectors = mergeTypes(selectors, this.scheduleNode.getSelectors())
        selectors = mergeTypes(selectors, this.petNode.getSelectors())
        selectors = mergeTypes(selectors, this.clientNode.getSelectors())
        selectors = mergeTypes(selectors, this.dictionariesNode.getSelectors())
        selectors = mergeTypes(selectors, this.clinicsWorkScheduleNode.getDefaultSelectors())
        selectors = mergeTypes(selectors, this.employeesWorkScheduleNode.getDefaultSelectors())
        selectors = mergeTypes(selectors, this.plannedCallsNode.getSelectors())
        selectors = mergeTypes(selectors, this.salesUnitNode.getSelectors())
        selectors = mergeTypes(selectors, this.stockNode.getSelectors())
        return selectors as unknown as SelectorsInfo<EmployeeAppState, EmployeeAppSelectors>
    }

    private calcNavigationMenuItemType(pageType: PageType): NavigationMenuItemType {
        switch (pageType) {
            case PageType.UserList: return NavigationMenuItemType.UserList
            case PageType.ClinicList: return NavigationMenuItemType.ClinicList
            case PageType.Schedule: return NavigationMenuItemType.Schedule
            case PageType.Species:
            case PageType.Breeds:
                return NavigationMenuItemType.SettingsMenu
            case PageType.Clients:
                return NavigationMenuItemType.ClientsList
            case PageType.PlannedCalls:
                return NavigationMenuItemType.Calls
            case PageType.SalesCategories:
            case PageType.Sales:
            case PageType.Stocks:
                return NavigationMenuItemType.Accounting

            default: return NavigationMenuItemType.None
        }
    }

    private calcSecondLevelNavigationMenuItemType(pageType: PageType): SecondLevelNavigationMenuType {
        switch (pageType) {
            case PageType.Species:
            case PageType.Breeds:
            case PageType.MeasureUnits:
            case PageType.VisitResult:
            case PageType.VisitPurpose:
            case PageType.Diagnosis:
            case PageType.AnimalColors:
                return SecondLevelNavigationMenuType.Dictionaries

            case PageType.ClinicList:
            case PageType.ClinicsWorkschedule:
                return SecondLevelNavigationMenuType.ClinicsManagement

            case PageType.UserList:
            case PageType.EmployeesWorkSchedule:
                return SecondLevelNavigationMenuType.EmployeesManagement

            case PageType.SalesCategories:
            case PageType.Sales:
            case PageType.Stocks:
                return SecondLevelNavigationMenuType.Accounting

            default: return SecondLevelNavigationMenuType.None
        }
    }

    private calcSecondLevelNavigationSelectedItem(pageType: PageType): number {
        switch (pageType) {
            case PageType.Species: return DictionaryMenuItemType.Species
            case PageType.Breeds: return DictionaryMenuItemType.Breed
            case PageType.MeasureUnits: return DictionaryMenuItemType.MeasureUnits
            case PageType.VisitResult: return DictionaryMenuItemType.VisitResult
            case PageType.VisitPurpose: return DictionaryMenuItemType.VisitPurpose
            case PageType.Diagnosis: return DictionaryMenuItemType.Diagnosis
            case PageType.AnimalColors: return DictionaryMenuItemType.AnimalColors

            case PageType.ClinicList: return ClinicsManagementMenuItemType.ClinicList
            case PageType.ClinicsWorkschedule: return ClinicsManagementMenuItemType.WorkSchedule

            case PageType.UserList: return EmployeeManagementMenuItemType.EmployeeList
            case PageType.EmployeesWorkSchedule: return EmployeeManagementMenuItemType.WorkSchedule

            case PageType.SalesCategories: return AccountingMenuItemType.SalesCategories
            case PageType.Sales: return AccountingMenuItemType.Sales
            case PageType.Stocks: return AccountingMenuItemType.Stocks

            default: return DictionaryMenuItemType.None
        }
    }
}

type CommonEmployeeState = {
    isApplicationLoading: boolean,
    isPageLoading: boolean,
    isDialogLoading: boolean,
    isDialogSubmitButtonLoading: boolean,
    loggedInEmployee: Employee | null,
    pageType: PageType,
    dialogType: DialogType,
    rightPanelType: RightPanelType,
    globalError: string | null,
    sexesMapForSelect: Map<number, Sex | null>
}

export type EmployeeAppState = DefaultStateType
    & CommonEmployeeState
    & UserPageEmployeeState
    & ClinicPageState
    & SpeciesPageState
    & BreedsPageState
    & ScheduleState
    & PetState
    & ClientState
    & DictionariesPagesState
    & ClinicsWorkScheduleState
    & EmployeeWorkScheduleState
    & PlannedCallState
    & SalesUnitState
    & StockState

type CommonEmployeeSelectors = {
    showDialog: boolean,
    navigationMenuItemType: NavigationMenuItemType,
    secondLevelNavigationMenuType: SecondLevelNavigationMenuType,
    secondLevelNavigationSelectedItem: number,
    showSecondLevelNavigationMenu: boolean,
}

export type EmployeeAppSelectors = CommonEmployeeSelectors
    & UserSelectors
    & ClinicSelectors
    & SpeciesPageSelector
    & BreedsPageSelector
    & ScheduleSelectors
    & PetSelectors
    & ClientSelectors
    & DictionariesPageSelectors
    & ClinicsWorkScheduleSelectors
    & EmployeeScheduleSelectors
    & PlannedCallSelectors
    & SalesUnitSelectors
    & StockSelectors

export type EmployeeStateContext = StateChangeContext<EmployeeAppState, EmployeeAppSelectors>