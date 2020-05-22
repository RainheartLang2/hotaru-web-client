import TypedApplicationStore, {DefaultStateType, SelectorsInfo} from "../../core/mvc/store/TypedApplicationStore";
import {Employee} from "../../common/beans/Employee";
import {NavigationMenuItemType} from "./enum/NavigationMenuItemType";
import {SecondLevelNavigationMenuType} from "./enum/SecondLevelNavigationMenuType";
import {DictionaryMenuItemType} from "./enum/DictionaryMenuItemType";
import {PageType} from "./enum/PageType";
import {DialogType} from "./enum/DialogType";
import TypedEmployeeNode, {UserSelectors, UserPageEmployeeState} from "./nodes/TypedEmployeeNode";
import {CommonUtils} from "../../core/utils/CommonUtils";
import mergeTypes = CommonUtils.mergeTypes;
import TypedClinicNode, {ClinicPageState, ClinicSelectors} from "./nodes/TypedClinicNode";
import TypedSpeciesNode, {SpeciesPageSelector, SpeciesPageState} from "./nodes/TypedSpeciesNode";
import TypedBreedNode, {BreedsPageSelector, BreedsPageState} from "./nodes/TypedBreedNode";
import TypedScheduleNode, {ScheduleSelectors, ScheduleState} from "./nodes/TypedScheduleNode";
import TypedPetNode, {PetSelectors, PetState} from "./nodes/TypedPetNode";
import TypedClientNode, {ClientSelectors, ClientState} from "./nodes/TypedClientNode";

export default class EmployeeApplicationStore extends TypedApplicationStore<EmployeeAppState, EmployeeAppSelectors> {

    private static _instance: EmployeeApplicationStore

    private employeeNode!: TypedEmployeeNode
    private clinicNode!: TypedClinicNode
    private speciesNode!: TypedSpeciesNode
    private breedNode!: TypedBreedNode
    private scheduleNode!: TypedScheduleNode
    private petNode!: TypedPetNode
    private clientNode!: TypedClientNode

    constructor() {
        super()
        const friend = this.createFriend()
        this.employeeNode = new TypedEmployeeNode(friend)
        this.clinicNode = new TypedClinicNode(friend)
        this.speciesNode = new TypedSpeciesNode(friend)
        this.breedNode = new TypedBreedNode(friend)
        this.scheduleNode = new TypedScheduleNode(friend)
        this.petNode = new TypedPetNode(friend)
        this.clientNode = new TypedClientNode(friend)
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
            globalError: null,
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
            dictionariesNavigationSelectedItem: {
                dependsOn: ["pageType"],
                get: (state: Pick<EmployeeAppState, "pageType">) => this.calcDictionariesNavigationSelectedItem(this.state.pageType),
                value: DictionaryMenuItemType.None,
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
            default: return NavigationMenuItemType.None
        }
    }

    private calcSecondLevelNavigationMenuItemType(pageType: PageType): SecondLevelNavigationMenuType {
        switch (pageType) {
            case PageType.Species:
            case PageType.Breeds:
                return SecondLevelNavigationMenuType.Dictionaries
            default: return SecondLevelNavigationMenuType.None
        }
    }

    private calcDictionariesNavigationSelectedItem(pageType: PageType): DictionaryMenuItemType {
        switch (pageType) {
            case PageType.Species: return DictionaryMenuItemType.Species
            case PageType.Breeds: return DictionaryMenuItemType.Breed
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
    globalError: string | null,
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

type CommonEmployeeSelectors = {
    showDialog: boolean,
    navigationMenuItemType: NavigationMenuItemType,
    secondLevelNavigationMenuType: SecondLevelNavigationMenuType,
    dictionariesNavigationSelectedItem: DictionaryMenuItemType,
}

export type EmployeeAppSelectors = CommonEmployeeSelectors
    & UserSelectors
    & ClinicSelectors
    & SpeciesPageSelector
    & BreedsPageSelector
    & ScheduleSelectors
    & PetSelectors
    & ClientSelectors
