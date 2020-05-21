import {Employee} from "../../../common/beans/Employee";
import {Clinic} from "../../../common/beans/Clinic";
import {Field} from "../../../core/mvc/store/Field";
import {SelectorsInfo} from "../../../core/mvc/store/TypedApplicationStore";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import {DialogType} from "../enum/DialogType";
import TypedApplicationStoreFriend from "../../../core/mvc/store/TypedApplicationStoreFriend";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import OnlyDigitsValidator from "../../../core/mvc/validators/OnlyDigitsValidator";
import EmailFormatValidator from "../../../core/mvc/validators/EmailFormatValidator";

export default class TypedEmployeeNode {
    private _store: TypedApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: TypedApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): UserPageEmployeeState {
        return {
            userList: [],
            editedEmployeeId: 0,
            editedEmployeeFirstName: "",
            editedEmployeeMiddleName: "",
            editedEmployeeLastName: "",
            editedEmployeeActive: false,
            editedEmployeePhone: "",
            editedEmployeeMail: "",
            editedEmployeeAddress: "",
            editedEmployeeClinic: Clinic.getMock(),
            editedEmployeeLogin: "",
            editedEmployeePassword: "",
            editedEmployeeConfirmPassword: "",
            isEditedEmployeePasswordChanged: false,
        }
    }

    private calcEmployeeDialogType(dialogType: DialogType): EmployeeDialogType {
        switch (dialogType) {
            case DialogType.CreateEmployee:
                return "create"
            case DialogType.EditEmployee:
                return "edit"
            case DialogType.EditEmployeeProfile:
                return "profile"
            default:
                return "none"
        }
    }

    public getDerivation(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, UserSelectors> {
        return {
            userListById: {
                dependsOn: ["userList"],
                get: (state: Pick<UserPageEmployeeState, "userList">) =>
                    CollectionUtils.mapArrayByUniquePredicate(state.userList, employee => employee.id ? employee.id : 0),
                value: new Map(),
            },
            //TODO: change to selecting medics only (after implementing of access rights)
            medicsListById: {
                dependsOn: ["userList"],
                get: (state: Pick<UserPageEmployeeState, "userList">) =>
                    CollectionUtils.mapArrayByUniquePredicate(state.userList, employee => employee.id ? employee.id : 0),
                value: new Map(),
            },
            employeeDialogType: {
                dependsOn: ["dialogType"],
                get: (state: Pick<EmployeeAppState, "dialogType">) => this.calcEmployeeDialogType(state.dialogType),
                value: "none",
            },
            editedEmployeeFirstNameField: this._store.createField("editedEmployeeFirstName", "",
                [new RequiredFieldValidator(),
                    new MaximalLengthValidator(100)]
            ),
            editedEmployeeMiddleNameField: this._store.createField("editedEmployeeMiddleName", "",
                [new MaximalLengthValidator(100)]
            ),
            editedEmployeeLastNameField: this._store.createField("editedEmployeeLastName", "",
                [new RequiredFieldValidator(),
                    new MaximalLengthValidator(100)]
            ),
            editedEmployeeAddressField: this._store.createField("editedEmployeeAddress", "",
                [new MaximalLengthValidator(2048)]
            ),
            editedEmployeeMailField: this._store.createField("editedEmployeeMail", "",
                [new MaximalLengthValidator(254),
                    new EmailFormatValidator()]
            ),
            editedEmployeePhoneField: this._store.createField("editedEmployeePhone", "",
                [new MaximalLengthValidator(15),
                new OnlyDigitsValidator()]
            ),
            editedEmployeeLoginField: this._store.createField("editedEmployeeLogin", "", []),
            editedEmployeePasswordField: this._store.createField("editedEmployeePassword", "", []),
            editedEmployeeConfirmPasswordField: this._store.createField("editedEmployeeConfirmPassword", "", []),
            editedEmployeeChangePasswordButtonShow: {
                dependsOn: ["dialogType"],
                get: (state: Pick<EmployeeAppState, "dialogType">) =>
                    state.dialogType === DialogType.EditEmployee
                    || state.dialogType === DialogType.EditEmployeeProfile,
                value: false,
            },
            isChangePasswordObligatory: {
                dependsOn: ["dialogType", "isEditedEmployeePasswordChanged"],
                get: (state: Pick<EmployeeAppState, "dialogType" | "isEditedEmployeePasswordChanged">) => state.dialogType === DialogType.CreateEmployee || state.isEditedEmployeePasswordChanged,
                value: false,
            },
            employeeFormHasError: this._store.createFormHasErrorsSelector([
                "editedEmployeeFirstNameField",
                "editedEmployeeMiddleNameField",
                "editedEmployeeLastNameField",
                "editedEmployeePhoneField",
                "editedEmployeeAddressField",
                "editedEmployeeMailField",
                "editedEmployeeLoginField",
                "editedEmployeePasswordField",
                "editedEmployeeConfirmPasswordField",
            ]),
        }
    }
}

export type UserPageEmployeeState = {
    userList: Employee[],
    editedEmployeeId: number,
    editedEmployeeFirstName: string,
    editedEmployeeMiddleName: string,
    editedEmployeeLastName: string,
    editedEmployeeActive: boolean,
    editedEmployeePhone: string,
    editedEmployeeMail: string,
    editedEmployeeAddress: string,
    editedEmployeeClinic: Clinic,
    editedEmployeeLogin: string,
    editedEmployeePassword: string,
    editedEmployeeConfirmPassword: string,
    isEditedEmployeePasswordChanged: boolean,
}

type EmployeeDialogType = "create" | "edit" | "profile" | "none"

export type UserSelectors = {
    userListById: Map<number, Employee>,
    medicsListById: Map<number, Employee>,
    employeeDialogType: EmployeeDialogType,
    editedEmployeeFirstNameField: Field,
    editedEmployeeMiddleNameField: Field,
    editedEmployeeLastNameField: Field,
    editedEmployeePhoneField: Field,
    editedEmployeeMailField: Field,
    editedEmployeeAddressField: Field,
    editedEmployeeLoginField: Field,
    editedEmployeePasswordField: Field,
    editedEmployeeConfirmPasswordField: Field,
    editedEmployeeChangePasswordButtonShow: boolean,
    isChangePasswordObligatory: boolean,
    employeeFormHasError: boolean,
}