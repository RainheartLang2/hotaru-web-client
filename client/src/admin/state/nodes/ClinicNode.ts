import {Clinic} from "../../../common/beans/Clinic";
import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {Field} from "../../../core/mvc/store/Field";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import EmailFormatValidator from "../../../core/mvc/validators/EmailFormatValidator";
import {ConfigureDialogType} from "../../../core/types/ConfigureDialogType";
import {DialogType} from "../enum/DialogType";

export default class ClinicNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): ClinicPageState {
        return {
            clinicList: [],
            editedClinicId: 0,
            editedClinicName: "",
            editedClinicActive: false,
            editedClinicPhone: "",
            editedClinicEmail: "",
            editedClinicAddress: "",
            editedClinicCity: "",
            editedClinicSiteUrl: "",
        }
    }

    public getSelectors(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, ClinicSelectors> {
        return {
            clinicListById: {
                dependsOn: ["clinicList"],
                get: (state: Pick<ClinicPageState, "clinicList">) => CollectionUtils.mapArrayByUniquePredicate(state.clinicList, clinic => clinic.id ? clinic.id : 0),
                value: new Map<number, Clinic>()
            },
            clinicListByIdWithMock: {
                dependsOn: ["clinicListById"],
                get: (state: Pick<ClinicSelectors, "clinicListById">) => {
                    const resultMap = new Map<number, Clinic>()
                    resultMap.set(0, Clinic.getMock())
                    CollectionUtils.mergeMaps(resultMap, state.clinicListById)
                    return resultMap
                },
                value: new Map<number, Clinic>()
            },
            editedClinicNameField: this._store.createField("editedClinicName", "",
                [new RequiredFieldValidator(), new MaximalLengthValidator(200)]),
            editedClinicPhoneField: this._store.createField("editedClinicPhone", "", [new MaximalLengthValidator(15)]),
            editedClinicEmailField: this._store.createField("editedClinicEmail", "",
                [new EmailFormatValidator(), new MaximalLengthValidator(254)]),
            editedClinicAddressField: this._store.createField("editedClinicAddress", "",
                [new RequiredFieldValidator(), new MaximalLengthValidator(1024)]),
            editedClinicCityField: this._store.createField("editedClinicCity", "", []),
            editedClinicSiteUrlField: this._store.createField("editedClinicSiteUrl", "",
                [new MaximalLengthValidator(256)]),
            editedClinicFormHasErrors: this._store.createFormHasErrorsSelector(["editedClinicName",
                "editedClinicPhone",
                "editedClinicEmail",
                "editedClinicAddress",
                "editedClinicSiteUrl"
            ]),
            clinicDialogType: {
                dependsOn: ["dialogType"],
                get: (state: Pick<EmployeeAppState, "dialogType">) => {
                    switch (state.dialogType) {
                        case DialogType.CreateClinic:
                            return "create"
                        case DialogType.EditClinic:
                            return "edit"
                        default:
                            return "none"
                    }
                },
                value: "none",
            }
        }
    }
}

export type ClinicPageState = {
    clinicList: Clinic[],
    editedClinicId: number,
    editedClinicName: string,
    editedClinicActive: boolean,
    editedClinicPhone: string,
    editedClinicEmail: string,
    editedClinicAddress: string,
    editedClinicCity: string,
    editedClinicSiteUrl: string,
}

export type ClinicSelectors = {
    clinicListById: Map<number, Clinic>,
    clinicListByIdWithMock: Map<number, Clinic>,
    clinicDialogType: ConfigureDialogType,
    editedClinicNameField: Field,
    editedClinicPhoneField: Field,
    editedClinicEmailField: Field,
    editedClinicAddressField: Field,
    editedClinicCityField: Field,
    editedClinicSiteUrlField: Field,
    editedClinicFormHasErrors: boolean,
}