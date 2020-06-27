import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import PlannedCall from "../../../common/beans/PlannedCall";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {Clinic} from "../../../common/beans/Clinic";
import {Employee} from "../../../common/beans/Employee";
import {Client} from "../../../common/beans/Client";
import {Pet} from "../../../common/beans/Pet";
import {Field} from "../../../core/mvc/store/Field";
import {ConfigureType} from "../../../core/types/ConfigureType";
import {DialogType} from "../enum/DialogType";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {PlannedCallStateType} from "../../../common/beans/enums/PlannedCallStateType";
import NotPastDateValidator from "../../../core/mvc/validators/NotPastDateValidator";

export default class PlannedCallNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): PlannedCallState {
        return {
            plannedCalls: [],
            plannedCallId: undefined,
            plannedCallClient: null,
            plannedCallClinic: null,
            plannedCallDoctor: null,
            plannedCallPet: null,
            plannedCallDate: "",
            plannedCallNote: "",
        }
    }

    public getSelectors(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, PlannedCallSelectors> {
        return {
            plannedCallsById: {
                dependsOn: ["plannedCalls"],
                get: (state: Pick<PlannedCallState, "plannedCalls">) => CollectionUtils.mapIdentifiableArray(state.plannedCalls),
                value: new Map(),
            },
            plannedCallStateType: {
                dependsOn: ["plannedCallsById", "plannedCallId"],
                get: (state: Pick<PlannedCallState & PlannedCallSelectors, "plannedCallsById" | "plannedCallId">) => {
                    const id = state.plannedCallId
                    return id
                        ? state.plannedCallsById.get(id!)!.state
                        : PlannedCallStateType.Assigned
                },
                value: PlannedCallStateType.Assigned
            },
            plannedCallDateField: this._store.createField("plannedCallDate", "",
                [new RequiredFieldValidator(), new NotPastDateValidator()]),
            plannedCallNoteField: this._store.createField("plannedCallNote"),
            editPlannedCallMode: {
                dependsOn: ["dialogType"],
                get: (state: Pick<EmployeeAppState, "dialogType">) => {
                    if (state.dialogType == DialogType.CreatePlannedCall) {
                        return "create"
                    } else if (state.dialogType == DialogType.EditPlannedCall) {
                        return "edit"
                    }

                    return "none"
                },
                value: "none",
            },
            editPlannedCallFormHasStandardErrors: this._store.createFormHasErrorsSelector(["plannedCallDateField", "plannedCallNoteField"]),
            editPlannedCallFormHasErrors: {
                dependsOn: [
                    "editPlannedCallFormHasStandardErrors",
                    "plannedCallClinic",
                    "plannedCallDoctor",
                    "plannedCallClient"
                ],
                get: (state: Pick<PlannedCallState & PlannedCallSelectors,
                    "editPlannedCallFormHasStandardErrors" |
                    "plannedCallClinic" |
                    "plannedCallDoctor" |
                    "plannedCallClient"
                    >) => {
                        return state.editPlannedCallFormHasStandardErrors
                                || !state.plannedCallClient
                                || !state.plannedCallDoctor
                                || !state.plannedCallClinic
                },
                value: false,
            },
            editPlannedCallFormErrorMessage: {
                dependsOn: ["editPlannedCallFormHasErrors"],
                get: (state: Pick<PlannedCallSelectors, "editPlannedCallFormHasErrors">) => "",
                value: "",
            },
            editPlannedCallDoctorsList: {
                dependsOn: ["userListByClinicId", "employeeWithoutClinicList", "plannedCallClinic"],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors, "userListByClinicId" | "employeeWithoutClinicList" | "plannedCallClinic">) => {
                    if (!state.plannedCallClinic) {
                        return []
                    }

                    const employeesByClinic = state.userListByClinicId.get(state.plannedCallClinic.id!)
                                                ? state.userListByClinicId.get(state.plannedCallClinic.id!)!
                                                : []
                    return employeesByClinic.concat(state.employeeWithoutClinicList)
                },
                value: [],
            },
            editPlannedCallPetsList: {
                dependsOn: ["petsByOwners", "plannedCallClient"],
                get: (state: Pick<EmployeeAppState & EmployeeAppSelectors, "petsByOwners" | "plannedCallClient">) => {
                    if (!state.plannedCallClient) {
                        return []
                    }

                    const result = state.petsByOwners.get(state.plannedCallClient.id!)
                    return result ? result : []
                },
                value: [],
            },
        }
    }
}

export type PlannedCallState = {
    plannedCalls: PlannedCall[],
    plannedCallId: number | undefined,
    plannedCallClinic: Clinic | null,
    plannedCallDoctor: Employee | null,
    plannedCallClient: Client | null,
    plannedCallPet: Pet | null,
    plannedCallDate: string,
    plannedCallNote: string,
}

export type PlannedCallSelectors = {
    plannedCallsById: Map<number, PlannedCall>,
    plannedCallStateType: PlannedCallStateType,
    plannedCallDateField: Field,
    plannedCallNoteField: Field,
    editPlannedCallDoctorsList: Employee[],
    editPlannedCallPetsList: Pet[],
    editPlannedCallMode: ConfigureType,
    editPlannedCallFormHasStandardErrors: boolean,
    editPlannedCallFormHasErrors: boolean,
    editPlannedCallFormErrorMessage: string,
}

