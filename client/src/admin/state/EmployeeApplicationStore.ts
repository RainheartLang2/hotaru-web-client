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

export default class EmployeeApplicationStore extends TypedApplicationStore<EmployeeState, EmployeeSelectors> {

    private static _instance: EmployeeApplicationStore

    private employeeNode!: TypedEmployeeNode;
    private clinicNode!: TypedClinicNode;

    constructor() {
        super()
        const friend = this.createFriend()
        this.employeeNode = new TypedEmployeeNode(friend)
        this.clinicNode = new TypedClinicNode(friend)
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

    private createCommonDerivations(): SelectorsInfo<EmployeeState, CommonEmployeeSelectors> {
        return {
            showDialog: {
                dependsOn: ["dialogType", "isDialogLoading"],
                get: (state: Pick<EmployeeState, "dialogType" | "isDialogLoading">) => state.isDialogLoading || state.dialogType != DialogType.None,
                value: false,
            },
            navigationMenuItemType: {
                dependsOn: ["pageType"],
                get: (state: Pick<EmployeeState, "pageType">) => this.calcNavigationMenuItemType(state.pageType),
                value: NavigationMenuItemType.None,
            },
            secondLevelNavigationMenuType: {
                dependsOn: ["pageType"],
                get: (state: Pick<EmployeeState, "pageType">) => this.calcSecondLevelNavigationMenuItemType(state.pageType),
                value: SecondLevelNavigationMenuType.None,
            },
            dictionariesNavigationSelectedItem: {
                dependsOn: ["pageType"],
                get: (state: Pick<EmployeeState, "pageType">) => this.calcDictionariesNavigationSelectedItem(this.state.pageType),
                value: DictionaryMenuItemType.None,
            }
        }
    }

    protected getDefaultState(): EmployeeState {
        const commonState = mergeTypes(this.createCommonDefaultState(), this.createDefaultStateTypeEntry())
        const employeePageState = mergeTypes(commonState, this.employeeNode.getDefaultState())
        const clinicPageState = mergeTypes(employeePageState, this.clinicNode.getDefaultState())
        const result = clinicPageState
        return result
    }

    protected getSelectors(): SelectorsInfo<EmployeeState, EmployeeSelectors> {
        const employeePageSelectors = mergeTypes(this.createCommonDerivations(), this.employeeNode.getDerivation())
        const clinicSelectors = mergeTypes(employeePageSelectors, this.clinicNode.getSelectors())
        const result = clinicSelectors
        return result
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

export type EmployeeState = DefaultStateType
    & CommonEmployeeState
    & UserPageEmployeeState
    & ClinicPageState

type CommonEmployeeSelectors = {
    showDialog: boolean,
    navigationMenuItemType: NavigationMenuItemType,
    secondLevelNavigationMenuType: SecondLevelNavigationMenuType,
    dictionariesNavigationSelectedItem: DictionaryMenuItemType,
}

export type EmployeeSelectors = CommonEmployeeSelectors & UserSelectors & ClinicSelectors