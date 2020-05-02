import {DialogType} from "./enum/DialogType";
import EmployeeNode from "./nodes/EmployeeNode";
import ApplicationStore from "../../core/mvc/store/ApplicationStore";
import {Employee} from "../../common/beans/Employee";
import {PageType} from "./enum/PageType";
import {NavigationMenuItemType} from "./enum/NavigationMenuItemType";
import ClinicNode from "./nodes/ClinicNode";
import SpeciesNode from "./nodes/SpeciesNode";
import {SecondLevelNavigationMenuType} from "./enum/SecondLevelNavigationMenuType";
import {DictionaryMenuItemType} from "./enum/DictionaryMenuItemType";
import BreedNode from "./nodes/BreedNode";

export default class AdminApplicationState extends ApplicationStore {
    private static _instance: AdminApplicationState

    private _employeeNode: EmployeeNode
    private _clinicNode: ClinicNode
    private _speciesNode: SpeciesNode
    private _breedsNode: BreedNode

    private constructor() {
        super()
        this.registerProperty(AdminStateProperty.IsApplicationLoading, true)
        this.registerProperty(AdminStateProperty.IsPageLoading, true)
        this.registerProperty(AdminStateProperty.IsDialogLoading, false)
        this.registerProperty(AdminStateProperty.PageType, PageType.None)
        this.registerProperty(AdminStateProperty.DialogType, DialogType.None)
        this.registerSelector(AdminStateProperty.ShowDialog, {
            dependsOn: [AdminStateProperty.IsDialogLoading, AdminStateProperty.DialogType],
            get: map => {
                const isLoading = map.get(AdminStateProperty.IsDialogLoading) as boolean
                const dialogType = map.get(AdminStateProperty.DialogType) as DialogType
                return isLoading || dialogType != DialogType.None
            }
        })
        this.registerSelector(AdminStateProperty.NavigationMenuItemType, {
            dependsOn: [AdminStateProperty.PageType],
            get: map => {
                switch (this.getPropertyValue(AdminStateProperty.PageType)) {
                    case PageType.UserList: return NavigationMenuItemType.UserList
                    case PageType.ClinicList: return NavigationMenuItemType.ClinicList
                    case PageType.Schedule: return NavigationMenuItemType.Schedule
                    case PageType.Species:
                    case PageType.Breeds:
                        return NavigationMenuItemType.SettingsMenu
                    default: return NavigationMenuItemType.None
                }
            }
        })
        this.registerSelector(AdminStateProperty.SecondLevelNavigationMenuType, {
            dependsOn: [AdminStateProperty.PageType],
            get: map => {
                switch (this.getPropertyValue(AdminStateProperty.PageType)) {
                    case PageType.Species:
                    case PageType.Breeds:
                        return SecondLevelNavigationMenuType.Dictionaries
                    default: return SecondLevelNavigationMenuType.None
                }
            }
        })

        this.registerSelector(AdminStateProperty.DictionariesNavigationSelectedItem, {
            dependsOn: [AdminStateProperty.PageType],
            get: map => {
                switch (this.getPropertyValue(AdminStateProperty.PageType)) {
                    case PageType.Species: return DictionaryMenuItemType.Species
                    case PageType.Breeds: return DictionaryMenuItemType.Breed
                    default: return DictionaryMenuItemType.None
                }
            }
        })

        this.registerProperty(AdminStateProperty.LoggedInEmployee, null)
        this._employeeNode = new EmployeeNode(this.friend)
        this._clinicNode = new ClinicNode(this.friend)
        this._speciesNode = new SpeciesNode(this.friend)
        this._breedsNode = new BreedNode(this.friend)
    }

    get employeeNode(): EmployeeNode {
        return this._employeeNode;
    }

    get clinicNode(): ClinicNode {
        return this._clinicNode
    }

    get speciesNode(): SpeciesNode {
        return this._speciesNode
    }

    get breedNode(): BreedNode {
        return this._breedsNode
    }

    public static get instance(): AdminApplicationState {
        if (!AdminApplicationState._instance) {
            AdminApplicationState._instance = new AdminApplicationState()
        }
        return AdminApplicationState._instance
    }

    public isApplicationLoading(): boolean {
        return this.getPropertyValue(AdminStateProperty.IsApplicationLoading)
    }

    public setApplicationLoading(applicationLoading: boolean) {
        this.setPropertyValue(AdminStateProperty.IsApplicationLoading, applicationLoading)
    }

    public setDialogType(dialogType: DialogType): void {
        this.setPropertyValue(AdminStateProperty.DialogType, dialogType)
    }

    public setPageType(pageType: PageType): void {
        this.setPropertyValue<PageType>(AdminStateProperty.PageType, pageType)
    }

    public getLoggedInUser(): Employee {
        return this.getPropertyValue<Employee>(AdminStateProperty.LoggedInEmployee)
    }

    public setLoggedInUser(employee: Employee): void {
        this.setPropertyValue<Employee>(AdminStateProperty.LoggedInEmployee, employee)
    }
}

export enum AdminStateProperty {
    //Common
    IsApplicationLoading = "isApplicationLoading",
    IsPageLoading = "isPageLoading",
    IsDialogLoading = "isDialogLoading",
    LoggedInEmployee = "LoggedInEmployee",
    NavigationMenuItemType = "navigationMenuItemType",
    SecondLevelNavigationMenuType = "secondLevelNavigationMenuType",
    DictionariesNavigationSelectedItem = "dictionariesNavigationSelectedItem",
    PageType = "pageType",
    DialogType = "dialogType",
    ShowDialog = "showDialog",

    //EmployeeNode
    UserList = "userList",
    UserListById = "userListById",
    EmployeeDialogType = "employeeDialogType",
    EditedEmployeeId = "editedEmployeeId",
    EditedEmployeeFirstName = "editedEmployeeFirstName",
    EditedEmployeeMiddleName = "editedEmployeeMiddleName",
    EditedEmployeeLastName = "editedEmployeeLastName",
    EditedEmployeeActive = "editedEmployeeActive",
    EditedEmployeePhone = "editedEmployeePhone",
    EditedEmployeeEmail = "editedEmployeeEmail",
    EditedEmployeeAddress = "editedEmployeeAddress",
    EditedEmployeeClinic = "editedEmployeeClinic",
    EditedEmployeeLogin = "editedEmployeLogin",
    EditedEmployeePassword = "editedEmployeePassword",
    EditedEmployeeConfirmPassword = "editedEmployeeConfirmPassword",
    IsEmployeeChangePassword = "isEmployeeChangePassword",
    IsChangePasswordButtonShow = "isChangePasswordButtonShow",
    IsChangePasswordObligatory = "IsChangePasswordObligatory",
    EditEmployeeFormHasErrors = "editEmployeFormHasErrors",

    //ClinicNode
    ClinicList = "clinicList",
    ClinicListById = "clinicListById",
    ClinicListByIdWithMock = "clinicListByIdWithMock",
    ClinicDialogType = "clinicDialogType",
    EditedClinicId = "editedClinicId",
    EditedClinicName = "editedClinicName",
    EditedClinicActive = "editedClinicActive",
    EditedClinicPhone = "editedClinicPhone",
    EditedClinicEmail = "editedClinicEmail",
    EditedClinicCity = "editedClinicCity",
    EditedClinicAddress = "editedClinicAddress",
    EditedClinicSiteUrl = "editedClinicSiteUrl",
    EditClinicFormHasErrors = "editClinicFormHasErrors",

    //SpeciesNode
    SpeciesList = "speciesList",
    SpeciesListById = "speciesListById",
    EditedSpeciesId = "editedSpeciesId",
    EditedSpeciesName = "editedSpeciesName",
    AddedSpeciesName = "addedSpeciesName",

    //BreedsNode
    BreedsList = "breedsList",
    BreedsListById = "breedsListById",
    BreedPageSelectedSpecies = "breedPageSelectedSpecies",
    BreedsBySpecies = "breedsBySpecies",
    BreedsForCurrentSpecies = "breedsForCurrentSpecies",
    EditedBreedId = "editedBreedId",
    EditedBreedName = "editedBreedName",
    AddedBreedName = "addedBreedName",
}