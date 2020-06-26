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
            plannedCallDateField: this._store.createField("plannedCallDate"),
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
            editPlannedCallFormHasErrors: this._store.createFormHasErrorsSelector(["plannedCallDateField", "plannedCallNoteField"]),
            editPlannedCallFormErrorMessage: {
                dependsOn: ["editPlannedCallFormHasErrors"],
                get: (state: Pick<PlannedCallSelectors, "editPlannedCallFormHasErrors">) => "",
                value: "",
            }
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
    plannedCallDateField: Field,
    plannedCallNoteField: Field,
    editPlannedCallMode: ConfigureType,
    editPlannedCallFormHasErrors: boolean,
    editPlannedCallFormErrorMessage: string,
}

